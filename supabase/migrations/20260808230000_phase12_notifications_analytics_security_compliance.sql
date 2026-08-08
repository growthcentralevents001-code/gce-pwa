-- Phase 12 — Notifications, Analytics, Audit, Security & Compliance
-- Authority: FD-020/023/031/034/035/039; ADR-010/013/014; OD-008/009/010
-- Target: gce-dev only. Production untouched.
-- Reuses audit_events (append-only). Does NOT invent retention day counts.
-- Live provider sends remain OFF; retention_enforcement OFF.

-- ---------------------------------------------------------------------------
-- Feature flags
-- ---------------------------------------------------------------------------

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('notifications_in_app', true, 'Phase 12 in-app notifications'),
  ('notifications_email_sandbox', true, 'Phase 12 mock/sandbox email adapter'),
  ('notifications_sms_sandbox', true, 'Phase 12 mock/sandbox SMS adapter'),
  ('notifications_push_sandbox', true, 'Phase 12 mock/sandbox push adapter'),
  ('notifications_email_live', false, 'Live email provider — OFF until compliance approved'),
  ('notifications_sms_live', false, 'Live SMS/DLT provider — OFF until compliance approved'),
  ('notifications_push_live', false, 'Live web-push — OFF; SW dirty WIP deferred'),
  ('marketing_notifications', false, 'Marketing/promotional bulk — OFF by default'),
  ('analytics_pipeline', true, 'Phase 12 analytics event ingestion'),
  ('security_monitoring', true, 'Phase 12 security event capture'),
  ('fraud_review', true, 'Phase 12 risk/fraud review queue (no auto-ban)'),
  ('compliance_holds', true, 'Phase 12 scoped compliance holds'),
  ('retention_enforcement', false, 'Destructive retention purge — OFF pending OD-009')
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  description = EXCLUDED.description,
  updated_at = now();

-- Money / destructive gates forced OFF
UPDATE public.feature_flags
SET enabled = false, updated_at = now()
WHERE key IN (
  'marketplace_ticket_payments',
  'settlement_execution',
  'payout_execution',
  'refund_processing',
  'notifications_email_live',
  'notifications_sms_live',
  'notifications_push_live',
  'marketing_notifications',
  'retention_enforcement'
);

-- ---------------------------------------------------------------------------
-- Templates (versioned)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_key text NOT NULL,
  version int NOT NULL DEFAULT 1,
  channel text NOT NULL CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
  locale text NOT NULL DEFAULT 'en-IN',
  category text NOT NULL CHECK (category IN (
    'transactional', 'booking', 'membership', 'leads', 'finance',
    'marketing', 'security', 'operational'
  )),
  is_active boolean NOT NULL DEFAULT true,
  subject_template text,
  title_template text NOT NULL,
  body_template text NOT NULL,
  variables_schema jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (template_key, version, channel, locale)
);

CREATE INDEX IF NOT EXISTS idx_notif_templates_active
  ON public.notification_templates (template_key, channel)
  WHERE is_active = true;

INSERT INTO public.notification_templates (
  template_key, version, channel, locale, category,
  subject_template, title_template, body_template, variables_schema
) VALUES
  ('booking.confirmed', 1, 'in_app', 'en-IN', 'booking',
   NULL, 'Booking confirmed', 'Your booking {{booking_ref}} is confirmed.',
   '{"required":["booking_ref"]}'::jsonb),
  ('booking.confirmed', 1, 'email', 'en-IN', 'booking',
   'Booking confirmed — {{booking_ref}}', 'Booking confirmed',
   'Your booking {{booking_ref}} is confirmed. Live ticket payments remain gated.',
   '{"required":["booking_ref"]}'::jsonb),
  ('offer.claimed', 1, 'in_app', 'en-IN', 'booking',
   NULL, 'Offer claimed', 'Your claim is active until {{expires_at}}. Claim is not a purchase.',
   '{"required":["expires_at"]}'::jsonb),
  ('security.notice', 1, 'in_app', 'en-IN', 'security',
   NULL, 'Security notice', '{{summary}}',
   '{"required":["summary"]}'::jsonb),
  ('membership.activated', 1, 'in_app', 'en-IN', 'membership',
   NULL, 'Membership activated', 'Your membership is active. Circle allocation may still be pending.',
   '{}'::jsonb),
  ('lead.assigned', 1, 'in_app', 'en-IN', 'leads',
   NULL, 'Lead assigned', 'A Lead Assist opportunity requires your response.',
   '{}'::jsonb),
  ('finance.hold', 1, 'in_app', 'en-IN', 'finance',
   NULL, 'Settlement hold', 'A financial hold was applied to {{subject_ref}}. Contact support if unexpected.',
   '{"required":["subject_ref"]}'::jsonb)
ON CONFLICT (template_key, version, channel, locale) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Outbox intents + deliveries + dead letters
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.notification_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_event_id text,
  source_domain text,
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id),
  template_key text NOT NULL,
  template_version int,
  channel text NOT NULL CHECK (channel IN ('in_app', 'email', 'sms', 'push')),
  category text NOT NULL CHECK (category IN (
    'transactional', 'booking', 'membership', 'leads', 'finance',
    'marketing', 'security', 'operational'
  )),
  locale text NOT NULL DEFAULT 'en-IN',
  priority text NOT NULL DEFAULT 'normal'
    CHECK (priority IN ('low', 'normal', 'high', 'critical')),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  deep_link text,
  status text NOT NULL DEFAULT 'pending'
    CHECK (status IN (
      'pending', 'queued', 'rendering', 'dispatching', 'delivered',
      'failed', 'suppressed', 'dead_letter', 'cancelled'
    )),
  attempt_count int NOT NULL DEFAULT 0,
  max_attempts int NOT NULL DEFAULT 5,
  scheduled_at timestamptz NOT NULL DEFAULT now(),
  next_attempt_at timestamptz,
  provider text,
  idempotency_key text NOT NULL,
  last_error text,
  delivered_at timestamptz,
  correlation_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_notif_intents_dispatch
  ON public.notification_intents (status, next_attempt_at, scheduled_at)
  WHERE status IN ('pending', 'queued', 'failed');

CREATE INDEX IF NOT EXISTS idx_notif_intents_recipient
  ON public.notification_intents (recipient_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.notification_deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid NOT NULL REFERENCES public.notification_intents(id) ON DELETE CASCADE,
  channel text NOT NULL,
  provider text NOT NULL DEFAULT 'sandbox',
  provider_message_id text,
  status text NOT NULL DEFAULT 'accepted'
    CHECK (status IN ('accepted', 'sent', 'delivered', 'bounced', 'failed', 'suppressed')),
  response jsonb NOT NULL DEFAULT '{}'::jsonb,
  attempted_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notif_deliveries_intent
  ON public.notification_deliveries (intent_id, attempted_at DESC);

CREATE TABLE IF NOT EXISTS public.notification_dead_letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  intent_id uuid NOT NULL REFERENCES public.notification_intents(id) ON DELETE CASCADE,
  reason text NOT NULL,
  last_error text,
  attempt_count int NOT NULL DEFAULT 0,
  disposition text NOT NULL DEFAULT 'open'
    CHECK (disposition IN ('open', 'retried', 'discarded', 'resolved')),
  disposed_by uuid REFERENCES auth.users(id),
  disposed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (intent_id)
);

-- ---------------------------------------------------------------------------
-- In-app notifications + preferences + push subscriptions
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.in_app_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_user_id uuid NOT NULL REFERENCES auth.users(id),
  intent_id uuid REFERENCES public.notification_intents(id) ON DELETE SET NULL,
  notification_type text NOT NULL,
  category text NOT NULL,
  title text NOT NULL,
  body text NOT NULL,
  deep_link text,
  source_entity_type text,
  source_entity_id text,
  priority text NOT NULL DEFAULT 'normal',
  read_at timestamptz,
  archived_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_in_app_recipient_unread
  ON public.in_app_notifications (recipient_user_id, created_at DESC)
  WHERE archived_at IS NULL;

CREATE TABLE IF NOT EXISTS public.notification_preferences (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  in_app_enabled boolean NOT NULL DEFAULT true,
  email_enabled boolean NOT NULL DEFAULT true,
  sms_enabled boolean NOT NULL DEFAULT false,
  push_enabled boolean NOT NULL DEFAULT false,
  marketing_opt_in boolean NOT NULL DEFAULT false,
  category_overrides jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.notification_preference_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id),
  actor_user_id uuid REFERENCES auth.users(id),
  before_data jsonb,
  after_data jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint_hash text NOT NULL,
  endpoint_ref text NOT NULL,
  provider text NOT NULL DEFAULT 'web_push',
  is_active boolean NOT NULL DEFAULT true,
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, endpoint_hash)
);

-- ---------------------------------------------------------------------------
-- Analytics (minimised)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_family text NOT NULL,
  event_name text NOT NULL,
  schema_version int NOT NULL DEFAULT 1,
  actor_user_id uuid,
  subject_type text,
  subject_id text,
  organisation_id uuid,
  vertical text,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_domain text,
  source_event_id text,
  idempotency_key text NOT NULL,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_analytics_family_time
  ON public.analytics_events (event_family, occurred_at DESC);

CREATE TABLE IF NOT EXISTS public.analytics_kpi_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kpi_key text NOT NULL,
  period_start timestamptz NOT NULL,
  period_end timestamptz NOT NULL,
  value_numeric numeric,
  value_json jsonb NOT NULL DEFAULT '{}'::jsonb,
  formula_status text NOT NULL DEFAULT 'operational'
    CHECK (formula_status IN ('operational', 'unresolved', 'pending_validation')),
  computed_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (kpi_key, period_start, period_end)
);

-- ---------------------------------------------------------------------------
-- Security / risk / alerts / incidents
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.security_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  severity text NOT NULL DEFAULT 'informational'
    CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
  actor_user_id uuid,
  subject_type text,
  subject_id text,
  workspace_key text,
  organisation_id uuid,
  summary text NOT NULL,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  correlation_id text,
  source text NOT NULL DEFAULT 'platform',
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_security_events_sev_time
  ON public.security_events (severity, created_at DESC);

CREATE TABLE IF NOT EXISTS public.risk_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  signal_type text NOT NULL,
  category text NOT NULL DEFAULT 'fraud'
    CHECK (category IN ('fraud', 'abuse', 'payment', 'redemption', 'lead_spam', 'other')),
  subject_type text NOT NULL,
  subject_id text NOT NULL,
  actor_user_id uuid,
  score_bps int NOT NULL DEFAULT 0,
  recommendation text NOT NULL DEFAULT 'review'
    CHECK (recommendation IN ('flag', 'hold', 'review', 'escalate', 'ignore')),
  review_status text NOT NULL DEFAULT 'open'
    CHECK (review_status IN ('open', 'in_review', 'cleared', 'actioned', 'escalated')),
  auto_action_applied text NOT NULL DEFAULT 'none'
    CHECK (auto_action_applied IN ('none', 'flag_only')),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  idempotency_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (idempotency_key)
);

CREATE INDEX IF NOT EXISTS idx_risk_signals_open
  ON public.risk_signals (review_status, created_at DESC);

CREATE TABLE IF NOT EXISTS public.operational_alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  alert_key text NOT NULL,
  severity text NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
  title text NOT NULL,
  summary text NOT NULL,
  threshold_config jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'acknowledged', 'resolved', 'suppressed')),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  occurrence_count int NOT NULL DEFAULT 1,
  acknowledged_by uuid REFERENCES auth.users(id),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  details jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_operational_alerts_open_key
  ON public.operational_alerts (alert_key)
  WHERE status = 'open';

CREATE TABLE IF NOT EXISTS public.incident_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source text NOT NULL,
  severity text NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('informational', 'low', 'medium', 'high', 'critical')),
  status text NOT NULL DEFAULT 'candidate'
    CHECK (status IN ('candidate', 'acknowledged', 'investigating', 'resolved', 'dismissed')),
  title text NOT NULL,
  summary text NOT NULL,
  related_event_ids jsonb NOT NULL DEFAULT '[]'::jsonb,
  owner_user_id uuid REFERENCES auth.users(id),
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  resolution_ref text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Compliance / privacy / retention
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.compliance_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type text NOT NULL CHECK (subject_type IN (
    'user', 'organisation', 'venue', 'bdp_unit', 'entitlement', 'transaction'
  )),
  subject_id text NOT NULL,
  scope text NOT NULL DEFAULT 'scoped',
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'active'
    CHECK (status IN ('active', 'released', 'expired')),
  started_at timestamptz NOT NULL DEFAULT now(),
  release_conditions text,
  released_at timestamptz,
  created_by uuid NOT NULL REFERENCES auth.users(id),
  released_by uuid REFERENCES auth.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_compliance_holds_active
  ON public.compliance_holds (subject_type, subject_id)
  WHERE status = 'active';

CREATE UNIQUE INDEX IF NOT EXISTS uq_compliance_holds_active_subject
  ON public.compliance_holds (subject_type, subject_id)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.sensitive_access_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_user_id uuid NOT NULL REFERENCES auth.users(id),
  record_type text NOT NULL,
  record_id text NOT NULL,
  purpose text,
  workspace_key text,
  access_result text NOT NULL DEFAULT 'success'
    CHECK (access_result IN ('success', 'denied')),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_sensitive_access_actor_time
  ON public.sensitive_access_events (actor_user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS public.privacy_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_user_id uuid NOT NULL REFERENCES auth.users(id),
  request_type text NOT NULL CHECK (request_type IN (
    'access', 'correction', 'erasure', 'restricted_processing'
  )),
  status text NOT NULL DEFAULT 'received'
    CHECK (status IN (
      'received', 'under_review', 'needs_info', 'approved',
      'rejected', 'completed', 'blocked_legal_hold'
    )),
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  review_notes text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.retention_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_key text NOT NULL UNIQUE,
  data_class text NOT NULL,
  retention_basis text NOT NULL DEFAULT 'pending_validation',
  retention_period_days int,
  period_status text NOT NULL DEFAULT 'pending_validation'
    CHECK (period_status IN ('pending_validation', 'approved', 'configurable')),
  deletion_or_anonymisation text NOT NULL DEFAULT 'review_required'
    CHECK (deletion_or_anonymisation IN (
      'review_required', 'anonymise_allowed', 'purge_forbidden', 'configurable'
    )),
  legal_hold_exception boolean NOT NULL DEFAULT true,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.retention_policies (
  policy_key, data_class, retention_basis, retention_period_days,
  period_status, deletion_or_anonymisation, notes
) VALUES
  ('audit_events', 'audit', 'legal_accounting', NULL, 'pending_validation', 'purge_forbidden',
   'OD-009 — audit purge not permitted without approved retention'),
  ('kyc_documents', 'kyc', 'privacy_kyc', NULL, 'pending_validation', 'review_required',
   'OD-009 — KYC retention Pending Privacy Validation'),
  ('notification_deliveries', 'operational', 'ops', NULL, 'pending_validation', 'configurable',
   'Delivery logs — period pending'),
  ('analytics_events', 'analytics', 'analytics', NULL, 'pending_validation', 'anonymise_allowed',
   'Prefer anonymisation over hard delete'),
  ('ledger_finance', 'finance', 'legal_accounting', NULL, 'pending_validation', 'purge_forbidden',
   'Ledger/finance history must not be erased for privacy requests')
ON CONFLICT (policy_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.retention_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  policy_key text NOT NULL REFERENCES public.retention_policies(policy_key),
  subject_ref text,
  eligibility text NOT NULL DEFAULT 'not_eligible'
    CHECK (eligibility IN ('not_eligible', 'review_required', 'anonymise_candidate', 'blocked_hold')),
  decided_by uuid REFERENCES auth.users(id),
  decision text,
  decided_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_is_compliance_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('platform_admin', 'platform', NULL);
$$;

CREATE OR REPLACE FUNCTION public.gce_is_support_or_platform_admin()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_is_platform_admin()
      OR public.gce_has_active_assignment('support_admin', 'platform', NULL);
$$;

CREATE OR REPLACE FUNCTION public.gce_is_security_ops()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_is_platform_admin()
      OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('support_admin', 'platform', NULL);
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_dead_letters ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.in_app_notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notification_preference_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analytics_kpi_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.security_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.risk_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.operational_alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.incident_signals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.compliance_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sensitive_access_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.privacy_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_policies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.retention_reviews ENABLE ROW LEVEL SECURITY;

-- Templates: authenticated read active; admin write via service
DROP POLICY IF EXISTS p12_templates_select ON public.notification_templates;
CREATE POLICY p12_templates_select ON public.notification_templates
  FOR SELECT TO authenticated
  USING (is_active = true OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p12_intents_select ON public.notification_intents;
CREATE POLICY p12_intents_select ON public.notification_intents
  FOR SELECT TO authenticated
  USING (
    recipient_user_id = public.gce_current_user_id()
    OR public.gce_is_support_or_platform_admin()
  );

DROP POLICY IF EXISTS p12_deliveries_select ON public.notification_deliveries;
CREATE POLICY p12_deliveries_select ON public.notification_deliveries
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.notification_intents i
      WHERE i.id = intent_id
        AND (i.recipient_user_id = public.gce_current_user_id()
             OR public.gce_is_support_or_platform_admin())
    )
  );

DROP POLICY IF EXISTS p12_dead_select ON public.notification_dead_letters;
CREATE POLICY p12_dead_select ON public.notification_dead_letters
  FOR SELECT TO authenticated
  USING (public.gce_is_support_or_platform_admin());

DROP POLICY IF EXISTS p12_inapp_select ON public.in_app_notifications;
CREATE POLICY p12_inapp_select ON public.in_app_notifications
  FOR SELECT TO authenticated
  USING (recipient_user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p12_inapp_update ON public.in_app_notifications;
CREATE POLICY p12_inapp_update ON public.in_app_notifications
  FOR UPDATE TO authenticated
  USING (recipient_user_id = public.gce_current_user_id())
  WITH CHECK (recipient_user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS p12_prefs_own ON public.notification_preferences;
CREATE POLICY p12_prefs_own ON public.notification_preferences
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p12_pref_events_own ON public.notification_preference_events;
CREATE POLICY p12_pref_events_own ON public.notification_preference_events
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p12_push_own ON public.push_subscriptions;
CREATE POLICY p12_push_own ON public.push_subscriptions
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p12_analytics_admin ON public.analytics_events;
CREATE POLICY p12_analytics_admin ON public.analytics_events
  FOR SELECT TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_has_active_assignment('finance_admin', 'platform', NULL));

DROP POLICY IF EXISTS p12_kpi_admin ON public.analytics_kpi_snapshots;
CREATE POLICY p12_kpi_admin ON public.analytics_kpi_snapshots
  FOR SELECT TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_has_active_assignment('finance_admin', 'platform', NULL));

DROP POLICY IF EXISTS p12_sec_ops ON public.security_events;
CREATE POLICY p12_sec_ops ON public.security_events
  FOR SELECT TO authenticated
  USING (public.gce_is_security_ops());

DROP POLICY IF EXISTS p12_risk_ops ON public.risk_signals;
CREATE POLICY p12_risk_ops ON public.risk_signals
  FOR SELECT TO authenticated
  USING (public.gce_is_security_ops());

DROP POLICY IF EXISTS p12_alerts_ops ON public.operational_alerts;
CREATE POLICY p12_alerts_ops ON public.operational_alerts
  FOR SELECT TO authenticated
  USING (public.gce_is_security_ops() OR public.gce_has_active_assignment('finance_admin', 'platform', NULL));

DROP POLICY IF EXISTS p12_incidents_ops ON public.incident_signals;
CREATE POLICY p12_incidents_ops ON public.incident_signals
  FOR SELECT TO authenticated
  USING (public.gce_is_security_ops());

DROP POLICY IF EXISTS p12_holds_select ON public.compliance_holds;
CREATE POLICY p12_holds_select ON public.compliance_holds
  FOR SELECT TO authenticated
  USING (public.gce_is_compliance_admin() OR public.gce_has_active_assignment('finance_admin', 'platform', NULL));

DROP POLICY IF EXISTS p12_sensitive_select ON public.sensitive_access_events;
CREATE POLICY p12_sensitive_select ON public.sensitive_access_events
  FOR SELECT TO authenticated
  USING (
    actor_user_id = public.gce_current_user_id()
    OR public.gce_is_compliance_admin()
  );

DROP POLICY IF EXISTS p12_privacy_own ON public.privacy_requests;
CREATE POLICY p12_privacy_own ON public.privacy_requests
  FOR SELECT TO authenticated
  USING (
    requester_user_id = public.gce_current_user_id()
    OR public.gce_is_compliance_admin()
  );

DROP POLICY IF EXISTS p12_privacy_insert ON public.privacy_requests;
CREATE POLICY p12_privacy_insert ON public.privacy_requests
  FOR INSERT TO authenticated
  WITH CHECK (requester_user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS p12_retention_select ON public.retention_policies;
CREATE POLICY p12_retention_select ON public.retention_policies
  FOR SELECT TO authenticated
  USING (public.gce_is_compliance_admin());

DROP POLICY IF EXISTS p12_retention_review_select ON public.retention_reviews;
CREATE POLICY p12_retention_review_select ON public.retention_reviews
  FOR SELECT TO authenticated
  USING (public.gce_is_compliance_admin());

COMMENT ON TABLE public.notification_intents IS 'Phase 12 durable notification outbox';
COMMENT ON TABLE public.retention_policies IS 'Phase 12 retention hooks — periods PENDING PRIVACY VALIDATION (OD-009)';
COMMENT ON TABLE public.risk_signals IS 'Phase 12 fraud/risk review — auto_action limited to flag_only';
