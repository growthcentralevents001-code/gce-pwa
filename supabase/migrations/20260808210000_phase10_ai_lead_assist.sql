-- Phase 10 — AI Lead Assist & Opportunity Management (Stage 1 unpaid)
-- Authority: FD-031/032/035/039; SM_Lead_Assist
-- Target: gce-dev only. Production untouched.
-- Paid Lead Assist / ₹500 / escrow / success-fee / wallet lead fees remain OFF.
-- Does NOT post Phase 9 revenue/commission from lead activity.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.assist_lead_quality_status AS ENUM (
    'unverified',
    'preliminarily_verified',
    'qualified',
    'rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assist_lead_work_status AS ENUM (
    'draft',
    'submitted',
    'classifying',
    'classified',
    'routing',
    'routed',
    'review_required',
    'offered',
    'accepted',
    'declined',
    'no_response',
    'in_follow_up',
    'reassigned',
    'contact_revealed',
    'outcome_pending',
    'closed_dual_confirmed',
    'closed_unconverted',
    'expired',
    'cancelled',
    'disputed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assist_privacy_level AS ENUM (
    'standard',
    'restricted',
    'masked',
    'manual_review'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assist_assignment_status AS ENUM (
    'proposed',
    'assigned',
    'accepted',
    'declined',
    'expired',
    'reassigned_closed',
    'revoked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assist_outcome_party_status AS ENUM (
    'pending',
    'submitted',
    'confirmed',
    'disputed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Canonical Assist Leads (additive — legacy public.leads remains historical)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.assist_leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_ref text NOT NULL UNIQUE,
  giver_user_id uuid NOT NULL REFERENCES public.users(id),
  giver_membership_id uuid REFERENCES public.connect_memberships(id),
  origin_circle_id uuid REFERENCES public.connect_circles(id),
  source text NOT NULL DEFAULT 'in_app',
  title text NOT NULL,
  quality_status public.assist_lead_quality_status NOT NULL DEFAULT 'unverified',
  work_status public.assist_lead_work_status NOT NULL DEFAULT 'draft',
  privacy_level public.assist_privacy_level NOT NULL DEFAULT 'standard',
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  city text,
  district text,
  state text,
  urgency text NOT NULL DEFAULT 'normal',
  budget_indication_minor bigint,
  contact_reveal_state text NOT NULL DEFAULT 'masked', -- masked|revealed|revoked
  expires_at timestamptz,
  legacy_lead_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  CONSTRAINT assist_leads_budget_nonneg CHECK (
    budget_indication_minor IS NULL OR budget_indication_minor >= 0
  ),
  CONSTRAINT assist_leads_source_in_app CHECK (source IN ('in_app', 'meeting_followup', 'desk_created'))
);

DROP TRIGGER IF EXISTS trg_assist_leads_updated_at ON public.assist_leads;
CREATE TRIGGER trg_assist_leads_updated_at
  BEFORE UPDATE ON public.assist_leads
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE INDEX IF NOT EXISTS idx_assist_leads_giver ON public.assist_leads (giver_user_id, work_status);
CREATE INDEX IF NOT EXISTS idx_assist_leads_circle ON public.assist_leads (origin_circle_id, work_status);

CREATE TABLE IF NOT EXISTS public.assist_lead_requirement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  version_no int NOT NULL,
  requirement_summary text NOT NULL,
  requirement_details text,
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  tag_codes text[] NOT NULL DEFAULT '{}',
  city text,
  district text,
  state text,
  timeline_notes text,
  urgency text,
  budget_indication_minor bigint,
  confidentiality_preference text,
  change_reason text,
  actor_user_id uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assist_req_version_unique UNIQUE (lead_id, version_no)
);

CREATE TABLE IF NOT EXISTS public.assist_lead_ai_runs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  provider text NOT NULL DEFAULT 'deterministic_fallback',
  model_id text NOT NULL DEFAULT 'rules-v1',
  purpose text NOT NULL DEFAULT 'classification',
  prompt_template_version text NOT NULL DEFAULT 'phase10-v1',
  confidence_bps int NOT NULL DEFAULT 0,
  review_required boolean NOT NULL DEFAULT false,
  status text NOT NULL DEFAULT 'completed', -- completed|failed|fallback
  structured_output jsonb NOT NULL DEFAULT '{}'::jsonb,
  error_message text,
  cost_metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assist_ai_confidence_range CHECK (confidence_bps BETWEEN 0 AND 10000)
);

CREATE TABLE IF NOT EXISTS public.assist_lead_ai_classifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  ai_run_id uuid REFERENCES public.assist_lead_ai_runs(id),
  suggested_specialisation_id uuid REFERENCES public.business_specialisations(id),
  suggested_tag_codes text[] NOT NULL DEFAULT '{}',
  extracted_city text,
  extracted_state text,
  urgency text,
  confidence_bps int NOT NULL DEFAULT 0,
  ranking_reasons text[] NOT NULL DEFAULT '{}',
  review_required boolean NOT NULL DEFAULT false,
  review_reason text,
  reviewed_by uuid REFERENCES public.users(id),
  final_specialisation_id uuid REFERENCES public.business_specialisations(id),
  override_reason text,
  is_canonical boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_assist_ai_class_canonical
  ON public.assist_lead_ai_classifications (lead_id)
  WHERE is_canonical = true;

CREATE TABLE IF NOT EXISTS public.assist_lead_routing_candidates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  candidate_user_id uuid NOT NULL REFERENCES public.users(id),
  candidate_membership_id uuid REFERENCES public.connect_memberships(id),
  candidate_circle_id uuid REFERENCES public.connect_circles(id),
  routing_tier text NOT NULL, -- circle_first|cross_circle|wider_network
  score_bps int NOT NULL DEFAULT 0,
  match_features jsonb NOT NULL DEFAULT '{}'::jsonb,
  ranking_reasons text[] NOT NULL DEFAULT '{}',
  eligible boolean NOT NULL DEFAULT true,
  ineligibility_reason text,
  ai_run_id uuid REFERENCES public.assist_lead_ai_runs(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assist_candidate_unique UNIQUE (lead_id, candidate_user_id),
  CONSTRAINT assist_candidate_not_assignment CHECK (true) -- documentation: candidates != assignments
);

CREATE TABLE IF NOT EXISTS public.assist_lead_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  receiver_user_id uuid NOT NULL REFERENCES public.users(id),
  receiver_membership_id uuid REFERENCES public.connect_memberships(id),
  receiver_circle_id uuid REFERENCES public.connect_circles(id),
  status public.assist_assignment_status NOT NULL DEFAULT 'assigned',
  assignment_source text NOT NULL DEFAULT 'system', -- system|desk|manual
  assigned_by uuid REFERENCES public.users(id),
  assigned_at timestamptz NOT NULL DEFAULT now(),
  responded_at timestamptz,
  decline_reason text,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_assist_one_active_assignment
  ON public.assist_lead_assignments (lead_id)
  WHERE is_active = true;

CREATE TABLE IF NOT EXISTS public.assist_lead_assignment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.assist_lead_assignments(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  from_status public.assist_assignment_status,
  to_status public.assist_assignment_status NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_opportunity_desk_queue (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  reason text NOT NULL,
  priority text NOT NULL DEFAULT 'normal',
  status text NOT NULL DEFAULT 'open', -- open|in_progress|resolved|cancelled
  owner_user_id uuid REFERENCES public.users(id),
  notes text,
  resolved_at timestamptz,
  resolved_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_assist_desk_queue_updated_at ON public.assist_opportunity_desk_queue;
CREATE TRIGGER trg_assist_desk_queue_updated_at
  BEFORE UPDATE ON public.assist_opportunity_desk_queue
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_assist_desk_open_per_lead_reason
  ON public.assist_opportunity_desk_queue (lead_id, reason)
  WHERE status IN ('open', 'in_progress');

CREATE TABLE IF NOT EXISTS public.assist_contact_reveal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  assignment_id uuid REFERENCES public.assist_lead_assignments(id),
  viewer_user_id uuid NOT NULL REFERENCES public.users(id),
  fields_revealed text[] NOT NULL DEFAULT '{}',
  reason text,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_lead_outcomes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  outcome_type text NOT NULL DEFAULT 'closed_business', -- closed_business|unconverted|other
  status text NOT NULL DEFAULT 'pending', -- pending|confirmed|disputed|cancelled
  declared_amount_minor bigint,
  confirmed_amount_minor bigint,
  currency text NOT NULL DEFAULT 'INR',
  giver_status public.assist_outcome_party_status NOT NULL DEFAULT 'pending',
  receiver_status public.assist_outcome_party_status NOT NULL DEFAULT 'pending',
  giver_amount_minor bigint,
  receiver_amount_minor bigint,
  giver_submitted_at timestamptz,
  receiver_submitted_at timestamptz,
  confirmed_at timestamptz,
  dispute_reason text,
  -- Hard Stage-1 finance boundary
  creates_finance_transaction boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assist_outcome_no_auto_finance CHECK (creates_finance_transaction = false),
  CONSTRAINT assist_outcome_amounts_nonneg CHECK (
    (declared_amount_minor IS NULL OR declared_amount_minor >= 0)
    AND (confirmed_amount_minor IS NULL OR confirmed_amount_minor >= 0)
    AND (giver_amount_minor IS NULL OR giver_amount_minor >= 0)
    AND (receiver_amount_minor IS NULL OR receiver_amount_minor >= 0)
  )
);

DROP TRIGGER IF EXISTS trg_assist_lead_outcomes_updated_at ON public.assist_lead_outcomes;
CREATE TRIGGER trg_assist_lead_outcomes_updated_at
  BEFORE UPDATE ON public.assist_lead_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_assist_outcome_one_active
  ON public.assist_lead_outcomes (lead_id)
  WHERE status IN ('pending', 'confirmed', 'disputed');

CREATE TABLE IF NOT EXISTS public.assist_closed_business_confirmations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  outcome_id uuid NOT NULL REFERENCES public.assist_lead_outcomes(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  party text NOT NULL CHECK (party IN ('giver', 'receiver')),
  party_user_id uuid NOT NULL REFERENCES public.users(id),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT assist_cbc_unique_party UNIQUE (outcome_id, party)
);

CREATE TABLE IF NOT EXISTS public.assist_lead_duplicate_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  related_lead_id uuid REFERENCES public.assist_leads(id),
  signal text NOT NULL,
  status text NOT NULL DEFAULT 'suspected', -- suspected|confirmed|dismissed|merged
  reviewed_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_lead_abuse_flags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.assist_leads(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES public.users(id),
  flag_type text NOT NULL,
  details text,
  status text NOT NULL DEFAULT 'open',
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_lead_reassignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.assist_leads(id) ON DELETE CASCADE,
  from_assignment_id uuid REFERENCES public.assist_lead_assignments(id),
  to_assignment_id uuid REFERENCES public.assist_lead_assignments(id),
  reason text NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  contact_access_revoked boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.assist_domain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  lead_id uuid REFERENCES public.assist_leads(id) ON DELETE SET NULL,
  actor_user_id uuid REFERENCES public.users(id),
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_assist_domain_events_type
  ON public.assist_domain_events (event_type, created_at DESC);

CREATE TABLE IF NOT EXISTS public.legacy_lead_assist_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_object text NOT NULL UNIQUE,
  mapping_status text NOT NULL DEFAULT 'historical_only',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_lead_assist_migration_map (legacy_object, mapping_status, notes) VALUES
  ('leads', 'historical_only', 'Legacy BDM/circle lead form — not Stage-1 Assist SoT'),
  ('circle_leads', 'historical_only', 'Prototype Circle leads'),
  ('bdm_leads', 'unsafe_deprecated', 'Do not map to Assist commissions'),
  ('referrals', 'historical_only', 'Legacy referrals'),
  ('rupee_500_lead_fee', 'inactive', 'FD-031/032/039 — Stage 1 unpaid; ₹500 obsolete'),
  ('lead_escrow', 'inactive', 'FD-039 inactive'),
  ('lead_success_fee', 'inactive', 'Not Stage 1; non-automatic FD-029/031'),
  ('pay_to_receive', 'inactive', 'FD-039 inactive'),
  ('paid_contact_reveal', 'inactive', 'Stage 1 unpaid'),
  ('subscription_credit_for_leads', 'inactive', 'Not activated')
ON CONFLICT (legacy_object) DO NOTHING;

-- Feature flags
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('lead_assist_stage1', true, 'Phase 10 unpaid Stage-1 Lead Assist (core rights)'),
  ('ai_lead_classification', true, 'Assistive AI/deterministic classification for Lead Assist'),
  ('ai_candidate_ranking', true, 'Assistive candidate ranking (cannot bypass eligibility)'),
  ('opportunity_desk', true, 'Opportunity Desk human review queue'),
  ('contact_reveal', true, 'Authorised contact reveal after assignment'),
  ('paid_lead_assist', false, 'FD-039 — paid Lead Assist OFF'),
  ('lead_escrow', false, 'FD-039 — lead escrow OFF'),
  ('lead_success_fee', false, 'FD-031/029 — success fee OFF in Stage 1'),
  ('pay_to_receive_leads', false, 'FD-039 — pay-to-receive OFF'),
  ('paid_contact_reveal', false, 'Paid contact reveal OFF'),
  ('rupee_500_lead_fee', false, 'Legacy ₹500 lead fee OFF')
ON CONFLICT (key) DO UPDATE SET
  enabled = CASE
    WHEN feature_flags.key IN (
      'paid_lead_assist','lead_escrow','lead_success_fee','pay_to_receive_leads',
      'paid_contact_reveal','rupee_500_lead_fee'
    ) THEN false
    ELSE EXCLUDED.enabled
  END;

UPDATE public.feature_flags SET enabled = false
WHERE key IN (
  'paid_lead_assist','lead_escrow','lead_success_fee','pay_to_receive_leads',
  'paid_contact_reveal','rupee_500_lead_fee'
);

-- Opportunity Desk workspace seed
INSERT INTO public.workspaces (workspace_key, label, role_key) VALUES
  ('opportunity-desk', 'Opportunity Desk', 'opportunity_desk')
ON CONFLICT (workspace_key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_is_opportunity_desk()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_has_active_assignment('opportunity_desk', NULL, NULL)
      OR public.gce_is_platform_admin();
$$;

CREATE OR REPLACE FUNCTION public.gce_assist_emit_event(
  p_type text,
  p_lead_id uuid,
  p_actor uuid,
  p_payload jsonb DEFAULT '{}'::jsonb
)
RETURNS public.assist_domain_events
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_row public.assist_domain_events;
BEGIN
  INSERT INTO public.assist_domain_events (event_type, lead_id, actor_user_id, payload)
  VALUES (p_type, p_lead_id, p_actor, COALESCE(p_payload, '{}'::jsonb))
  RETURNING * INTO v_row;
  RETURN v_row;
END;
$$;

-- Block paid/monetisation flags from enabling Stage-1 finance side effects on outcomes
CREATE OR REPLACE FUNCTION public.gce_assist_block_paid_mechanics()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.creates_finance_transaction IS TRUE THEN
    RAISE EXCEPTION 'Lead Assist Stage 1 cannot create finance transactions (FD-031/039)'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_assist_block_paid ON public.assist_lead_outcomes;
CREATE TRIGGER trg_assist_block_paid
  BEFORE INSERT OR UPDATE ON public.assist_lead_outcomes
  FOR EACH ROW EXECUTE FUNCTION public.gce_assist_block_paid_mechanics();

-- Dual confirmation reconciliation
CREATE OR REPLACE FUNCTION public.gce_assist_reconcile_outcome(p_outcome_id uuid)
RETURNS public.assist_lead_outcomes
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_out public.assist_lead_outcomes;
BEGIN
  SELECT * INTO v_out FROM public.assist_lead_outcomes WHERE id = p_outcome_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Outcome not found';
  END IF;

  IF v_out.giver_status = 'submitted' AND v_out.receiver_status = 'submitted' THEN
    IF v_out.giver_amount_minor IS NOT DISTINCT FROM v_out.receiver_amount_minor THEN
      UPDATE public.assist_lead_outcomes SET
        status = 'confirmed',
        giver_status = 'confirmed',
        receiver_status = 'confirmed',
        confirmed_amount_minor = v_out.giver_amount_minor,
        confirmed_at = now(),
        creates_finance_transaction = false
      WHERE id = p_outcome_id
      RETURNING * INTO v_out;

      UPDATE public.assist_leads SET work_status = 'closed_dual_confirmed'
      WHERE id = v_out.lead_id;
    ELSE
      UPDATE public.assist_lead_outcomes SET
        status = 'disputed',
        giver_status = 'disputed',
        receiver_status = 'disputed',
        dispute_reason = 'amount_mismatch'
      WHERE id = p_outcome_id
      RETURNING * INTO v_out;

      UPDATE public.assist_leads SET work_status = 'disputed'
      WHERE id = v_out.lead_id;
    END IF;
  END IF;
  RETURN v_out;
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.assist_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_requirement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_ai_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_ai_classifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_routing_candidates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_assignment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_opportunity_desk_queue ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_contact_reveal_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_closed_business_confirmations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_duplicate_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_abuse_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_lead_reassignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assist_domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_lead_assist_migration_map ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS assist_leads_select ON public.assist_leads;
CREATE POLICY assist_leads_select ON public.assist_leads
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR giver_user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.assist_lead_assignments a
      WHERE a.lead_id = id
        AND a.receiver_user_id = public.gce_current_user_id()
        AND a.is_active = true
    )
  );

DROP POLICY IF EXISTS assist_leads_insert ON public.assist_leads;
CREATE POLICY assist_leads_insert ON public.assist_leads
  FOR INSERT TO authenticated
  WITH CHECK (
    giver_user_id = public.gce_current_user_id()
    OR public.gce_is_opportunity_desk()
  );

DROP POLICY IF EXISTS assist_leads_update ON public.assist_leads;
CREATE POLICY assist_leads_update ON public.assist_leads
  FOR UPDATE TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR giver_user_id = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_opportunity_desk()
    OR giver_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS assist_req_select ON public.assist_lead_requirement_versions;
CREATE POLICY assist_req_select ON public.assist_lead_requirement_versions
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.assist_leads l WHERE l.id = lead_id)
  );

DROP POLICY IF EXISTS assist_req_write ON public.assist_lead_requirement_versions;
CREATE POLICY assist_req_write ON public.assist_lead_requirement_versions
  FOR ALL TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  )
  WITH CHECK (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  );

-- Candidates: desk + platform only (candidates must NOT see full lead contact)
DROP POLICY IF EXISTS assist_candidates_desk ON public.assist_lead_routing_candidates;
CREATE POLICY assist_candidates_desk ON public.assist_lead_routing_candidates
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk())
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_ai_desk ON public.assist_lead_ai_runs;
CREATE POLICY assist_ai_desk ON public.assist_lead_ai_runs
  FOR ALL TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  )
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_class_select ON public.assist_lead_ai_classifications;
CREATE POLICY assist_class_select ON public.assist_lead_ai_classifications
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS assist_class_desk_write ON public.assist_lead_ai_classifications;
CREATE POLICY assist_class_desk_write ON public.assist_lead_ai_classifications
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk())
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_assign_select ON public.assist_lead_assignments;
CREATE POLICY assist_assign_select ON public.assist_lead_assignments
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR receiver_user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS assist_assign_write ON public.assist_lead_assignments;
CREATE POLICY assist_assign_write ON public.assist_lead_assignments
  FOR ALL TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR receiver_user_id = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_opportunity_desk()
    OR receiver_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS assist_assign_events_select ON public.assist_lead_assignment_events;
CREATE POLICY assist_assign_events_select ON public.assist_lead_assignment_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_lead_assignments a
      WHERE a.id = assignment_id
        AND (
          a.receiver_user_id = public.gce_current_user_id()
          OR EXISTS (
            SELECT 1 FROM public.assist_leads l
            WHERE l.id = a.lead_id AND l.giver_user_id = public.gce_current_user_id()
          )
        )
    )
  );

DROP POLICY IF EXISTS assist_desk_queue_access ON public.assist_opportunity_desk_queue;
CREATE POLICY assist_desk_queue_access ON public.assist_opportunity_desk_queue
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk())
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_reveal_select ON public.assist_contact_reveal_events;
CREATE POLICY assist_reveal_select ON public.assist_contact_reveal_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR viewer_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS assist_reveal_insert ON public.assist_contact_reveal_events;
CREATE POLICY assist_reveal_insert ON public.assist_contact_reveal_events
  FOR INSERT TO authenticated
  WITH CHECK (viewer_user_id = public.gce_current_user_id() OR public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_outcomes_select ON public.assist_lead_outcomes;
CREATE POLICY assist_outcomes_select ON public.assist_lead_outcomes
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND (
        l.giver_user_id = public.gce_current_user_id()
        OR EXISTS (
          SELECT 1 FROM public.assist_lead_assignments a
          WHERE a.lead_id = l.id
            AND a.receiver_user_id = public.gce_current_user_id()
            AND a.is_active = true
        )
      )
    )
  );

DROP POLICY IF EXISTS assist_outcomes_write ON public.assist_lead_outcomes;
CREATE POLICY assist_outcomes_write ON public.assist_lead_outcomes
  FOR ALL TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND (
        l.giver_user_id = public.gce_current_user_id()
        OR EXISTS (
          SELECT 1 FROM public.assist_lead_assignments a
          WHERE a.lead_id = l.id
            AND a.receiver_user_id = public.gce_current_user_id()
        )
      )
    )
  )
  WITH CHECK (
    public.gce_is_opportunity_desk()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND (
        l.giver_user_id = public.gce_current_user_id()
        OR EXISTS (
          SELECT 1 FROM public.assist_lead_assignments a
          WHERE a.lead_id = l.id
            AND a.receiver_user_id = public.gce_current_user_id()
        )
      )
    )
  );

DROP POLICY IF EXISTS assist_cbc_select ON public.assist_closed_business_confirmations;
CREATE POLICY assist_cbc_select ON public.assist_closed_business_confirmations
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR party_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS assist_cbc_insert ON public.assist_closed_business_confirmations;
CREATE POLICY assist_cbc_insert ON public.assist_closed_business_confirmations
  FOR INSERT TO authenticated
  WITH CHECK (party_user_id = public.gce_current_user_id() OR public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_dup_desk ON public.assist_lead_duplicate_flags;
CREATE POLICY assist_dup_desk ON public.assist_lead_duplicate_flags
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk())
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_abuse_desk ON public.assist_lead_abuse_flags;
CREATE POLICY assist_abuse_desk ON public.assist_lead_abuse_flags
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk() OR public.gce_has_active_assignment('compliance_admin', NULL, NULL))
  WITH CHECK (public.gce_is_opportunity_desk() OR public.gce_has_active_assignment('compliance_admin', NULL, NULL));

DROP POLICY IF EXISTS assist_reassign_select ON public.assist_lead_reassignments;
CREATE POLICY assist_reassign_select ON public.assist_lead_reassignments
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR EXISTS (SELECT 1 FROM public.assist_leads l WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id())
  );

DROP POLICY IF EXISTS assist_reassign_desk ON public.assist_lead_reassignments;
CREATE POLICY assist_reassign_desk ON public.assist_lead_reassignments
  FOR ALL TO authenticated
  USING (public.gce_is_opportunity_desk())
  WITH CHECK (public.gce_is_opportunity_desk());

DROP POLICY IF EXISTS assist_events_select ON public.assist_domain_events;
CREATE POLICY assist_events_select ON public.assist_domain_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_opportunity_desk()
    OR actor_user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.assist_leads l
      WHERE l.id = lead_id AND l.giver_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS legacy_assist_map_select ON public.legacy_lead_assist_migration_map;
CREATE POLICY legacy_assist_map_select ON public.legacy_lead_assist_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.assist_leads IS
  'FD-031 Stage 1 unpaid Lead Assist — formal in-app leads; legacy public.leads remains historical';
COMMENT ON TABLE public.assist_lead_outcomes IS
  'Dual-confirmed closed business is NOT a Phase 9 finance transaction (creates_finance_transaction=false)';
COMMENT ON TABLE public.assist_lead_routing_candidates IS
  'Candidate ranking is NOT assignment — receivers gain access only via assist_lead_assignments';
