-- Phase 13 — Admin, Operations & Support
-- Authority: FD-023/035/036/037/038/039; Phase 4–12 reuse
-- Target: gce-dev only. Production untouched.
-- Strategy: shared ops_cases as umbrella linked to domain disputes (P6/P8/P9/P11/P12).
-- Does NOT invent Super Admin or direct ledger mutation.
-- Money / live provider / marketing / retention_enforcement remain OFF.

-- ---------------------------------------------------------------------------
-- Feature flags
-- ---------------------------------------------------------------------------

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('ops_approval_queues', true, 'Phase 13 approval queue console'),
  ('ops_exception_queues', true, 'Phase 13 exception queue console'),
  ('ops_case_management', true, 'Phase 13 shared case/dispute desk'),
  ('ops_moderation', true, 'Phase 13 content moderation actions'),
  ('ops_manual_overrides', true, 'Phase 13 typed operational overrides'),
  ('ops_support_console', true, 'Phase 13 Support Admin console'),
  ('ops_incident_console', true, 'Phase 13 incident workflow over Phase 12 signals')
ON CONFLICT (key) DO UPDATE SET
  enabled = EXCLUDED.enabled,
  description = EXCLUDED.description,
  updated_at = now();

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
-- Shared case umbrella (links domain SoT; does not replace P6/P8 disputes)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ops_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  case_type text NOT NULL CHECK (case_type IN (
    'membership','circle','connect_bdp','venue','marketplace_bdp','event','offer',
    'booking','claim','redemption','enterprise','project','vendor','finance',
    'refund','chargeback','privacy','compliance','security','account_access',
    'general_support','moderation','incident','other'
  )),
  vertical text NOT NULL DEFAULT 'platform' CHECK (vertical IN (
    'platform','connect','marketplace','enterprise','finance','compliance','support'
  )),
  status text NOT NULL DEFAULT 'open' CHECK (status IN (
    'open','assigned','investigating','waiting_on_customer','waiting_on_partner',
    'waiting_on_internal','escalated','resolved','closed','reopened'
  )),
  priority text NOT NULL DEFAULT 'normal' CHECK (priority IN ('low','normal','high','urgent')),
  severity text NOT NULL DEFAULT 'informational'
    CHECK (severity IN ('informational','low','medium','high','critical')),
  summary text NOT NULL,
  requester_user_id uuid REFERENCES auth.users(id),
  subject_user_id uuid REFERENCES auth.users(id),
  owner_user_id uuid REFERENCES auth.users(id),
  assigned_team text,
  organisation_id uuid,
  escalation_level int NOT NULL DEFAULT 0,
  sla_target_hours int,
  sla_label text NOT NULL DEFAULT 'operational_recommendation',
  linked_domain_table text,
  linked_domain_id text,
  resolution_summary text,
  resolved_at timestamptz,
  closed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_cases_status_priority
  ON public.ops_cases (status, priority, updated_at DESC);

CREATE INDEX IF NOT EXISTS idx_ops_cases_owner
  ON public.ops_cases (owner_user_id, status);

CREATE INDEX IF NOT EXISTS idx_ops_cases_vertical
  ON public.ops_cases (vertical, status, created_at DESC);

CREATE INDEX IF NOT EXISTS idx_ops_cases_linked
  ON public.ops_cases (linked_domain_table, linked_domain_id);

CREATE TABLE IF NOT EXISTS public.ops_case_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.ops_cases(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  actor_user_id uuid REFERENCES auth.users(id),
  from_status text,
  to_status text,
  details jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_case_events_case
  ON public.ops_case_events (case_id, created_at);

CREATE TABLE IF NOT EXISTS public.ops_case_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.ops_cases(id) ON DELETE CASCADE,
  author_user_id uuid NOT NULL REFERENCES auth.users(id),
  visibility text NOT NULL DEFAULT 'internal'
    CHECK (visibility IN ('internal','customer_visible')),
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_case_notes_case
  ON public.ops_case_notes (case_id, created_at);

CREATE TABLE IF NOT EXISTS public.ops_case_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.ops_cases(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  entity_id text NOT NULL,
  label text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (case_id, entity_type, entity_id)
);

-- ---------------------------------------------------------------------------
-- Approval / exception queues (projections — domain SoT remains vertical tables)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ops_approval_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  queue_key text NOT NULL,
  subject_type text NOT NULL,
  subject_id text NOT NULL,
  vertical text NOT NULL DEFAULT 'platform',
  title text NOT NULL,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN (
    'pending','assigned','approved','rejected','changes_requested','held','escalated','cancelled'
  )),
  requester_user_id uuid REFERENCES auth.users(id),
  assignee_user_id uuid REFERENCES auth.users(id),
  policy_version text,
  reason text,
  decision_reason text,
  decided_by uuid REFERENCES auth.users(id),
  decided_at timestamptz,
  domain_action text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_approval_pending
  ON public.ops_approval_queue (queue_key, status, created_at)
  WHERE status IN ('pending','assigned','held','escalated');

CREATE TABLE IF NOT EXISTS public.ops_exception_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  exception_key text NOT NULL,
  source text NOT NULL,
  subject_type text,
  subject_id text,
  vertical text NOT NULL DEFAULT 'platform',
  severity text NOT NULL DEFAULT 'medium'
    CHECK (severity IN ('informational','low','medium','high','critical')),
  title text NOT NULL,
  summary text NOT NULL,
  status text NOT NULL DEFAULT 'open' CHECK (status IN (
    'open','assigned','investigating','resolved','dismissed','escalated'
  )),
  owner_user_id uuid REFERENCES auth.users(id),
  resolution text,
  resolved_by uuid REFERENCES auth.users(id),
  resolved_at timestamptz,
  case_id uuid REFERENCES public.ops_cases(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  idempotency_key text NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ops_exception_open
  ON public.ops_exception_queue (status, severity, created_at DESC)
  WHERE status IN ('open','assigned','investigating','escalated');

-- ---------------------------------------------------------------------------
-- Typed overrides + moderation
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ops_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  override_category text NOT NULL CHECK (override_category IN (
    'attribution_correction','allocation_correction','workflow_state_correction',
    'approval_correction','refund_exception_request','rank_review','data_correction',
    'other_typed'
  )),
  subject_type text NOT NULL,
  subject_id text NOT NULL,
  reason text NOT NULL,
  previous_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  intended_state jsonb NOT NULL DEFAULT '{}'::jsonb,
  status text NOT NULL DEFAULT 'requested' CHECK (status IN (
    'requested','approved','rejected','applied','cancelled'
  )),
  requester_user_id uuid NOT NULL REFERENCES auth.users(id),
  approver_user_id uuid REFERENCES auth.users(id),
  applied_by uuid REFERENCES auth.users(id),
  requires_second_approver boolean NOT NULL DEFAULT false,
  finance_immutable boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ops_overrides_reason_nonempty CHECK (length(trim(reason)) >= 8)
);

CREATE TABLE IF NOT EXISTS public.ops_moderation_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type text NOT NULL CHECK (subject_type IN (
    'event','offer','venue_profile','feedback','upload','support_abuse','other'
  )),
  subject_id text NOT NULL,
  action text NOT NULL CHECK (action IN (
    'flag','review','hide','suspend','restore','dismiss'
  )),
  reason text NOT NULL,
  actor_user_id uuid NOT NULL REFERENCES auth.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ops_moderation_reason_nonempty CHECK (length(trim(reason)) >= 5)
);

CREATE INDEX IF NOT EXISTS idx_ops_moderation_subject
  ON public.ops_moderation_actions (subject_type, subject_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Incident workflow extension (over Phase 12 incident_signals)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.ops_incident_actions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id uuid NOT NULL REFERENCES public.incident_signals(id) ON DELETE CASCADE,
  action text NOT NULL CHECK (action IN (
    'acknowledge','assign','investigate','contain','resolve','reopen','note'
  )),
  actor_user_id uuid NOT NULL REFERENCES auth.users(id),
  note text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Promote customer_support_signals into cases (status adapter)
-- ---------------------------------------------------------------------------

ALTER TABLE public.customer_support_signals
  ADD COLUMN IF NOT EXISTS ops_case_id uuid REFERENCES public.ops_cases(id);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_is_ops_operator()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_is_platform_admin()
      OR public.gce_has_active_assignment('support_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('relationship_manager', 'platform', NULL)
      OR public.gce_has_active_assignment('platform_relationship_manager', 'platform', NULL)
      OR public.gce_has_active_assignment('enterprise_platform_expert', 'platform', NULL);
$$;

CREATE OR REPLACE FUNCTION public.gce_is_vertical_ops(p_vertical text)
RETURNS boolean
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF public.gce_is_platform_admin() THEN
    RETURN true;
  END IF;
  IF p_vertical = 'finance' THEN
    RETURN public.gce_has_active_assignment('finance_admin', 'platform', NULL);
  END IF;
  IF p_vertical = 'compliance' THEN
    RETURN public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
        OR public.gce_has_active_assignment('platform_admin', 'platform', NULL);
  END IF;
  IF p_vertical = 'support' THEN
    RETURN public.gce_has_active_assignment('support_admin', 'platform', NULL)
        OR public.gce_has_active_assignment('relationship_manager', 'platform', NULL)
        OR public.gce_has_active_assignment('platform_relationship_manager', 'platform', NULL);
  END IF;
  IF p_vertical IN ('connect','marketplace','enterprise','platform') THEN
    RETURN public.gce_has_active_assignment('support_admin', 'platform', NULL)
        OR public.gce_has_active_assignment('platform_admin', 'platform', NULL)
        OR public.gce_has_active_assignment('enterprise_platform_expert', 'platform', NULL)
        OR public.gce_has_active_assignment('relationship_manager', 'platform', NULL)
        OR public.gce_has_active_assignment('platform_relationship_manager', 'platform', NULL);
  END IF;
  RETURN false;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_next_ops_case_number()
RETURNS text
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  n bigint;
BEGIN
  n := (EXTRACT(EPOCH FROM now()) * 1000)::bigint;
  RETURN 'OPS-' || n::text;
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.ops_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_case_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_case_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_approval_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_exception_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_overrides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_moderation_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ops_incident_actions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS p13_cases_select ON public.ops_cases;
CREATE POLICY p13_cases_select ON public.ops_cases
  FOR SELECT TO authenticated
  USING (
    public.gce_is_ops_operator()
    OR public.gce_is_vertical_ops(vertical)
    OR requester_user_id = public.gce_current_user_id()
    OR subject_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS p13_case_events_select ON public.ops_case_events;
CREATE POLICY p13_case_events_select ON public.ops_case_events
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ops_cases c
      WHERE c.id = case_id
        AND (
          public.gce_is_ops_operator()
          OR public.gce_is_vertical_ops(c.vertical)
          OR c.requester_user_id = public.gce_current_user_id()
        )
    )
  );

DROP POLICY IF EXISTS p13_case_notes_select ON public.ops_case_notes;
CREATE POLICY p13_case_notes_select ON public.ops_case_notes
  FOR SELECT TO authenticated
  USING (
    (visibility = 'customer_visible' AND EXISTS (
      SELECT 1 FROM public.ops_cases c
      WHERE c.id = case_id
        AND (c.requester_user_id = public.gce_current_user_id()
             OR c.subject_user_id = public.gce_current_user_id())
    ))
    OR (visibility = 'internal' AND (
      public.gce_is_ops_operator() OR public.gce_is_platform_admin()
    ))
    OR (author_user_id = public.gce_current_user_id())
  );

DROP POLICY IF EXISTS p13_case_links_select ON public.ops_case_links;
CREATE POLICY p13_case_links_select ON public.ops_case_links
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.ops_cases c
      WHERE c.id = case_id
        AND (public.gce_is_ops_operator() OR public.gce_is_vertical_ops(c.vertical)
             OR c.requester_user_id = public.gce_current_user_id())
    )
  );

DROP POLICY IF EXISTS p13_approval_select ON public.ops_approval_queue;
CREATE POLICY p13_approval_select ON public.ops_approval_queue
  FOR SELECT TO authenticated
  USING (public.gce_is_ops_operator() OR public.gce_is_vertical_ops(vertical));

DROP POLICY IF EXISTS p13_exception_select ON public.ops_exception_queue;
CREATE POLICY p13_exception_select ON public.ops_exception_queue
  FOR SELECT TO authenticated
  USING (public.gce_is_ops_operator() OR public.gce_is_vertical_ops(vertical));

DROP POLICY IF EXISTS p13_overrides_select ON public.ops_overrides;
CREATE POLICY p13_overrides_select ON public.ops_overrides
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
    OR requester_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS p13_moderation_select ON public.ops_moderation_actions;
CREATE POLICY p13_moderation_select ON public.ops_moderation_actions
  FOR SELECT TO authenticated
  USING (public.gce_is_ops_operator() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS p13_incident_actions_select ON public.ops_incident_actions;
CREATE POLICY p13_incident_actions_select ON public.ops_incident_actions
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
    OR public.gce_has_active_assignment('support_admin', 'platform', NULL)
  );

COMMENT ON TABLE public.ops_cases IS 'Phase 13 shared ops case umbrella; domain disputes remain SoT via links';
COMMENT ON TABLE public.ops_overrides IS 'Typed operational overrides — never direct ledger mutation';
COMMENT ON TABLE public.ops_approval_queue IS 'Approval projection; domain approve RPCs/services remain authoritative';
