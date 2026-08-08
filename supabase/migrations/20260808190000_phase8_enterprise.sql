-- Phase 8 — GCE Enterprise (additive)
-- Authority: FD-026/028/029/034/035/038/039; commercial constants
-- Target: gce-dev only. Production untouched. No full Phase 9 settlement.
-- Legacy enterprise_requests/proposals/applications remain historical prototypes.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.enterprise_bdp_pack_status AS ENUM (
    'draft','submitted','pending_verification','pending_payment','pending_approval',
    'active','rejected','suspended','terminated','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_bdp_package_option AS ENUM (
    'direct_30000','finance_recovery_36000'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_attribution_status AS ENUM (
    'unattributed','proposed','pending_evidence','active','disputed',
    'suspended','reassigned_closed','voided'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_client_status AS ENUM (
    'draft','active','on_hold','suspended','terminated','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_opportunity_status AS ENUM (
    'draft','open','qualifying','proposal_in_progress','quoting','won','lost','on_hold','cancelled','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_quote_status AS ENUM (
    'draft','internal_review','pending_finance_cosign','finance_cosigned',
    'issued','viewed','accepted','rejected','changes_requested','expired','superseded','cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_project_status AS ENUM (
    'setup','approved','active','on_hold','completed','cancelled','terminated'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_milestone_status AS ENUM (
    'planned','due','submitted','accepted','disputed','completed','cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.enterprise_entitlement_state AS ENUM (
    'estimated','provisional','earned','on_hold','settlement_eligible','paid','reversed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.legacy_enterprise_map_status AS ENUM (
    'mapped','historical_only','ambiguous','needs_review','reusable_shell'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Enterprise BDP Franchise Packs (FD-026: ₹30k/₹36k; 30 clients; max 2 packs)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enterprise_bdp_packs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_assignment_id uuid REFERENCES public.role_assignments(id),
  application_status public.enterprise_bdp_pack_status NOT NULL DEFAULT 'draft',
  package_option public.enterprise_bdp_package_option NOT NULL DEFAULT 'finance_recovery_36000',
  package_total_minor bigint NOT NULL,
  initial_payment_minor bigint NOT NULL DEFAULT 0,
  recoverable_balance_minor bigint NOT NULL DEFAULT 0,
  recovered_to_date_minor bigint NOT NULL DEFAULT 0,
  remaining_recoverable_minor bigint NOT NULL DEFAULT 0,
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  offline_payment_ref text,
  terms_accepted_at timestamptz,
  activated_at timestamptz,
  suspended_at timestamptz,
  terminated_at timestamptz,
  clients_capacity_max int NOT NULL DEFAULT 30,
  active_client_count int NOT NULL DEFAULT 0,
  pricing_rule_version text NOT NULL DEFAULT 'fd026-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ebdp_packs_clients_cap CHECK (clients_capacity_max = 30),
  CONSTRAINT ebdp_packs_recovery_nonneg CHECK (
    recovered_to_date_minor >= 0
    AND remaining_recoverable_minor >= 0
    AND recovered_to_date_minor + remaining_recoverable_minor = recoverable_balance_minor
  ),
  CONSTRAINT ebdp_packs_package_amounts CHECK (
    (package_option = 'direct_30000'
      AND package_total_minor = 3000000
      AND initial_payment_minor = 3000000
      AND recoverable_balance_minor = 0)
    OR (package_option = 'finance_recovery_36000'
      AND package_total_minor = 3600000
      AND initial_payment_minor = 500000
      AND recoverable_balance_minor = 3100000)
  )
);

CREATE INDEX IF NOT EXISTS idx_ebdp_packs_user_status
  ON public.enterprise_bdp_packs (user_id, application_status);

DROP TRIGGER IF EXISTS trg_ebdp_packs_updated_at ON public.enterprise_bdp_packs;
CREATE TRIGGER trg_ebdp_packs_updated_at
  BEFORE UPDATE ON public.enterprise_bdp_packs
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE OR REPLACE FUNCTION public.gce_ebdp_person_pack_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_count int;
BEGIN
  IF NEW.application_status = 'active' THEN
    SELECT count(*)::int INTO v_count
    FROM public.enterprise_bdp_packs p
    WHERE p.user_id = NEW.user_id
      AND p.application_status = 'active'
      AND p.id IS DISTINCT FROM NEW.id;
    IF v_count >= 2 THEN
      RAISE EXCEPTION 'Enterprise BDP max 2 active packs (FD-026)' USING ERRCODE = '23514';
    END IF;
    IF v_count >= 1 AND COALESCE((NEW.metadata->>'second_pack_approved')::boolean, false) IS NOT TRUE THEN
      RAISE EXCEPTION 'Second Enterprise BDP pack requires platform approval (FD-026)'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ebdp_person_pack_cap ON public.enterprise_bdp_packs;
CREATE TRIGGER trg_ebdp_person_pack_cap
  BEFORE INSERT OR UPDATE OF application_status ON public.enterprise_bdp_packs
  FOR EACH ROW EXECUTE FUNCTION public.gce_ebdp_person_pack_cap();

-- ---------------------------------------------------------------------------
-- Enterprise Client profile (organisation-linked)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enterprise_client_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  display_name text NOT NULL,
  industry text,
  status public.enterprise_client_status NOT NULL DEFAULT 'draft',
  verification_status text NOT NULL DEFAULT 'not_started',
  primary_representative_user_id uuid REFERENCES public.users(id),
  billing_ref text,
  compliance_ref text,
  engagement_status text NOT NULL DEFAULT 'prospect',
  legacy_application_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_client_org_unique UNIQUE (organisation_id)
);

DROP TRIGGER IF EXISTS trg_enterprise_client_profiles_updated_at ON public.enterprise_client_profiles;
CREATE TRIGGER trg_enterprise_client_profiles_updated_at
  BEFORE UPDATE ON public.enterprise_client_profiles
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Client-based attribution (not territory)
CREATE TABLE IF NOT EXISTS public.enterprise_client_attributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id) ON DELETE CASCADE,
  pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  bdp_user_id uuid REFERENCES public.users(id),
  status public.enterprise_attribution_status NOT NULL DEFAULT 'proposed',
  provenance text NOT NULL DEFAULT 'sourced',
  basis text,
  effective_from timestamptz,
  effective_to timestamptz,
  is_correction boolean NOT NULL DEFAULT false,
  created_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ebdp_attr_no_self_approve CHECK (
    approved_by IS NULL OR created_by IS DISTINCT FROM approved_by OR is_correction = true
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_ebdp_attr_one_active_per_client
  ON public.enterprise_client_attributions (client_id)
  WHERE status = 'active';

DROP TRIGGER IF EXISTS trg_ebdp_attr_updated_at ON public.enterprise_client_attributions;
CREATE TRIGGER trg_ebdp_attr_updated_at
  BEFORE UPDATE ON public.enterprise_client_attributions
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE OR REPLACE FUNCTION public.gce_ebdp_client_pack_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_count int; v_max int;
BEGIN
  IF NEW.status <> 'active' OR NEW.pack_id IS NULL THEN RETURN NEW; END IF;
  SELECT clients_capacity_max INTO v_max FROM public.enterprise_bdp_packs WHERE id = NEW.pack_id;
  SELECT count(*)::int INTO v_count
  FROM public.enterprise_client_attributions
  WHERE pack_id = NEW.pack_id AND status = 'active' AND id IS DISTINCT FROM NEW.id;
  IF v_count >= COALESCE(v_max, 30) THEN
    RAISE EXCEPTION 'Enterprise BDP pack client capacity exceeded (max 30, FD-026)'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_ebdp_client_pack_cap ON public.enterprise_client_attributions;
CREATE TRIGGER trg_ebdp_client_pack_cap
  BEFORE INSERT OR UPDATE OF status ON public.enterprise_client_attributions
  FOR EACH ROW EXECUTE FUNCTION public.gce_ebdp_client_pack_cap();

CREATE OR REPLACE FUNCTION public.gce_ebdp_refresh_client_counts(p_pack_id uuid)
RETURNS public.enterprise_bdp_packs
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_pack public.enterprise_bdp_packs; v_active int;
BEGIN
  SELECT count(*)::int INTO v_active
  FROM public.enterprise_client_attributions
  WHERE pack_id = p_pack_id AND status = 'active';
  UPDATE public.enterprise_bdp_packs SET
    active_client_count = v_active, updated_at = now()
  WHERE id = p_pack_id RETURNING * INTO v_pack;
  RETURN v_pack;
END;
$$;

-- ---------------------------------------------------------------------------
-- Opportunity / requirement / proposal / quote
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enterprise_opportunities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  summary text,
  category text,
  status public.enterprise_opportunity_status NOT NULL DEFAULT 'draft',
  source text,
  priority text NOT NULL DEFAULT 'normal',
  expected_budget_min_minor bigint,
  expected_budget_max_minor bigint,
  client_rep_user_id uuid REFERENCES public.users(id),
  attributed_bdp_user_id uuid REFERENCES public.users(id),
  pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  owner_user_id uuid REFERENCES public.users(id),
  expert_user_id uuid REFERENCES public.users(id),
  legacy_request_id uuid,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_enterprise_opportunities_updated_at ON public.enterprise_opportunities;
CREATE TRIGGER trg_enterprise_opportunities_updated_at
  BEFORE UPDATE ON public.enterprise_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_requirements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.enterprise_opportunities(id) ON DELETE CASCADE,
  current_version int NOT NULL DEFAULT 1,
  readiness_status text NOT NULL DEFAULT 'draft',
  structured_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_requirement_opp_unique UNIQUE (opportunity_id)
);

DROP TRIGGER IF EXISTS trg_enterprise_requirements_updated_at ON public.enterprise_requirements;
CREATE TRIGGER trg_enterprise_requirements_updated_at
  BEFORE UPDATE ON public.enterprise_requirements
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_requirement_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requirement_id uuid NOT NULL REFERENCES public.enterprise_requirements(id) ON DELETE CASCADE,
  version_no int NOT NULL,
  raw_requirement text,
  structured_scope text,
  objectives text,
  deliverables text,
  timeline_notes text,
  locations text,
  budget_guidance_minor bigint,
  constraints text,
  change_reason text,
  actor_user_id uuid REFERENCES public.users(id),
  approval_status text NOT NULL DEFAULT 'draft',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_req_version_unique UNIQUE (requirement_id, version_no)
);

CREATE TABLE IF NOT EXISTS public.enterprise_solution_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.enterprise_opportunities(id) ON DELETE CASCADE,
  requirement_version_id uuid REFERENCES public.enterprise_requirement_versions(id),
  version_no int NOT NULL DEFAULT 1,
  title text NOT NULL,
  solution_summary text,
  assumptions text,
  exclusions text,
  validity_until timestamptz,
  pricing_summary_minor bigint NOT NULL DEFAULT 0,
  internal_status text NOT NULL DEFAULT 'draft',
  client_facing_status text NOT NULL DEFAULT 'internal',
  prepared_by uuid REFERENCES public.users(id),
  reviewed_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_solution_prop_unique UNIQUE (opportunity_id, version_no)
);

DROP TRIGGER IF EXISTS trg_enterprise_solution_proposals_updated_at ON public.enterprise_solution_proposals;
CREATE TRIGGER trg_enterprise_solution_proposals_updated_at
  BEFORE UPDATE ON public.enterprise_solution_proposals
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_quotes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  opportunity_id uuid NOT NULL REFERENCES public.enterprise_opportunities(id) ON DELETE CASCADE,
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id),
  proposal_id uuid REFERENCES public.enterprise_solution_proposals(id),
  requirement_version_id uuid REFERENCES public.enterprise_requirement_versions(id),
  quote_ref text NOT NULL UNIQUE,
  version_no int NOT NULL DEFAULT 1,
  total_proposed_minor bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status public.enterprise_quote_status NOT NULL DEFAULT 'draft',
  finance_cosign_required boolean NOT NULL DEFAULT false,
  finance_cosigned_by uuid REFERENCES public.users(id),
  finance_cosigned_at timestamptz,
  issued_by uuid REFERENCES public.users(id),
  issued_at timestamptz,
  accepted_by uuid REFERENCES public.users(id),
  accepted_at timestamptz,
  validity_until timestamptz,
  supersedes_quote_id uuid REFERENCES public.enterprise_quotes(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_quotes_total_nonneg CHECK (total_proposed_minor >= 0)
);

DROP TRIGGER IF EXISTS trg_enterprise_quotes_updated_at ON public.enterprise_quotes;
CREATE TRIGGER trg_enterprise_quotes_updated_at
  BEFORE UPDATE ON public.enterprise_quotes
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Finance co-sign enforcement: cannot issue if > ₹5L without finance cosign
CREATE OR REPLACE FUNCTION public.gce_enterprise_quote_issue_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.status = 'issued' AND (
       OLD.status IS DISTINCT FROM 'issued'
    ) THEN
    IF NEW.total_proposed_minor > 50000000 AND (
         NEW.finance_cosign_required IS NOT TRUE
      OR NEW.finance_cosigned_by IS NULL
      OR NEW.finance_cosigned_at IS NULL
    ) THEN
      RAISE EXCEPTION 'Finance co-sign required before issuing quotes above ₹5,00,000 (FD-038)'
        USING ERRCODE = '23514';
    END IF;
    -- Enterprise BDP alone may not issue — issued_by must not equal attributed BDP without expert/ops path
    -- Enforced in application SoD; DB ensures finance rule only here.
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_enterprise_quote_issue_guard ON public.enterprise_quotes;
CREATE TRIGGER trg_enterprise_quote_issue_guard
  BEFORE UPDATE OF status ON public.enterprise_quotes
  FOR EACH ROW EXECUTE FUNCTION public.gce_enterprise_quote_issue_guard();

CREATE TABLE IF NOT EXISTS public.enterprise_quote_lines (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quote_id uuid NOT NULL REFERENCES public.enterprise_quotes(id) ON DELETE CASCADE,
  line_no int NOT NULL,
  label text NOT NULL,
  component_type text NOT NULL DEFAULT 'enterprise_service',
  sourcing_vertical text NOT NULL DEFAULT 'enterprise',
  amount_minor bigint NOT NULL DEFAULT 0,
  platform_commission_bps int NOT NULL DEFAULT 2000,
  revenue_component_key text NOT NULL,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_quote_line_unique UNIQUE (quote_id, line_no),
  CONSTRAINT enterprise_quote_line_rev_key UNIQUE (revenue_component_key),
  CONSTRAINT enterprise_quote_line_amount_nonneg CHECK (amount_minor >= 0)
);

-- ---------------------------------------------------------------------------
-- Projects / components / milestones / vendors
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.enterprise_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id),
  opportunity_id uuid REFERENCES public.enterprise_opportunities(id),
  accepted_quote_id uuid REFERENCES public.enterprise_quotes(id),
  project_ref text NOT NULL UNIQUE,
  title text NOT NULL,
  status public.enterprise_project_status NOT NULL DEFAULT 'setup',
  owner_user_id uuid REFERENCES public.users(id),
  attribution_id uuid REFERENCES public.enterprise_client_attributions(id),
  pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  commercial_total_minor bigint NOT NULL DEFAULT 0,
  starts_on date,
  ends_on date,
  gce_execution_role text NOT NULL DEFAULT 'platform_intermediary',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_enterprise_project_one_per_accepted_quote
  ON public.enterprise_projects (accepted_quote_id)
  WHERE accepted_quote_id IS NOT NULL;

DROP TRIGGER IF EXISTS trg_enterprise_projects_updated_at ON public.enterprise_projects;
CREATE TRIGGER trg_enterprise_projects_updated_at
  BEFORE UPDATE ON public.enterprise_projects
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_project_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.enterprise_projects(id) ON DELETE CASCADE,
  component_key text NOT NULL,
  label text NOT NULL,
  component_type text NOT NULL,
  sourcing_vertical text NOT NULL, -- enterprise | marketplace | connect | vendor | other
  provider_ref text,
  marketplace_venue_id uuid REFERENCES public.marketplace_venues(id),
  commercial_amount_minor bigint NOT NULL DEFAULT 0,
  platform_commission_bps int NOT NULL DEFAULT 2000,
  platform_commission_minor bigint NOT NULL DEFAULT 0,
  revenue_component_key text NOT NULL,
  status text NOT NULL DEFAULT 'planned',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_component_key_unique UNIQUE (project_id, component_key),
  CONSTRAINT enterprise_component_revenue_unique UNIQUE (revenue_component_key),
  CONSTRAINT enterprise_component_amount_nonneg CHECK (
    commercial_amount_minor >= 0 AND platform_commission_minor >= 0
  )
);

DROP TRIGGER IF EXISTS trg_enterprise_project_components_updated_at ON public.enterprise_project_components;
CREATE TRIGGER trg_enterprise_project_components_updated_at
  BEFORE UPDATE ON public.enterprise_project_components
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_milestones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.enterprise_projects(id) ON DELETE CASCADE,
  component_id uuid REFERENCES public.enterprise_project_components(id),
  name text NOT NULL,
  amount_minor bigint,
  percentage_bps int,
  due_trigger text,
  due_on date,
  status public.enterprise_milestone_status NOT NULL DEFAULT 'planned',
  submitted_at timestamptz,
  accepted_at timestamptz,
  accepted_by uuid REFERENCES public.users(id),
  sort_order int NOT NULL DEFAULT 0,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_milestone_amount_or_pct CHECK (
    amount_minor IS NOT NULL OR percentage_bps IS NOT NULL
  )
  -- Intentionally NO default 30/40/30 schedule
);

DROP TRIGGER IF EXISTS trg_enterprise_milestones_updated_at ON public.enterprise_milestones;
CREATE TRIGGER trg_enterprise_milestones_updated_at
  BEFORE UPDATE ON public.enterprise_milestones
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  business_name text NOT NULL,
  category text,
  contact_name text,
  contact_email text,
  contact_phone text,
  verification_status text NOT NULL DEFAULT 'not_started',
  status text NOT NULL DEFAULT 'active',
  payout_ref text,
  capabilities text,
  login_enabled boolean NOT NULL DEFAULT false, -- portal inactive
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT enterprise_vendors_no_login CHECK (login_enabled = false)
);

DROP TRIGGER IF EXISTS trg_enterprise_vendors_updated_at ON public.enterprise_vendors;
CREATE TRIGGER trg_enterprise_vendors_updated_at
  BEFORE UPDATE ON public.enterprise_vendors
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_vendor_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.enterprise_projects(id) ON DELETE CASCADE,
  component_id uuid REFERENCES public.enterprise_project_components(id),
  vendor_id uuid NOT NULL REFERENCES public.enterprise_vendors(id),
  scope text,
  commercial_amount_minor bigint,
  status text NOT NULL DEFAULT 'assigned',
  assigned_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.enterprise_change_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.enterprise_projects(id) ON DELETE CASCADE,
  title text NOT NULL,
  requested_change text NOT NULL,
  commercial_impact_minor bigint NOT NULL DEFAULT 0,
  timeline_impact text,
  status text NOT NULL DEFAULT 'requested',
  requested_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  client_accepted_by uuid REFERENCES public.users(id),
  client_accepted_at timestamptz,
  version_no int NOT NULL DEFAULT 1,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_enterprise_change_orders_updated_at ON public.enterprise_change_orders;
CREATE TRIGGER trg_enterprise_change_orders_updated_at
  BEFORE UPDATE ON public.enterprise_change_orders
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid REFERENCES public.enterprise_client_profiles(id),
  project_id uuid REFERENCES public.enterprise_projects(id),
  subject_type text NOT NULL,
  title text NOT NULL,
  details text,
  severity text NOT NULL DEFAULT 'medium',
  status text NOT NULL DEFAULT 'open',
  owner_user_id uuid REFERENCES public.users(id),
  escalation text,
  resolution text,
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_enterprise_disputes_updated_at ON public.enterprise_disputes;
CREATE TRIGGER trg_enterprise_disputes_updated_at
  BEFORE UPDATE ON public.enterprise_disputes
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.enterprise_client_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id),
  source_pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  target_pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  status text NOT NULL DEFAULT 'requested',
  effective_from timestamptz,
  notes text,
  requested_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  completed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Entitlement boundary (25% of platform commission; not project value)
CREATE TABLE IF NOT EXISTS public.enterprise_revenue_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  earning_event_key text NOT NULL UNIQUE,
  client_id uuid NOT NULL REFERENCES public.enterprise_client_profiles(id),
  project_id uuid REFERENCES public.enterprise_projects(id),
  component_id uuid REFERENCES public.enterprise_project_components(id),
  revenue_component_key text NOT NULL,
  attribution_id uuid REFERENCES public.enterprise_client_attributions(id),
  pack_id uuid REFERENCES public.enterprise_bdp_packs(id),
  eligible_event_revenue_minor bigint NOT NULL DEFAULT 0,
  platform_commission_minor bigint NOT NULL DEFAULT 0,
  ebdp_entitlement_bps int NOT NULL DEFAULT 2500,
  ebdp_entitlement_minor bigint NOT NULL DEFAULT 0,
  has_valid_attribution boolean NOT NULL DEFAULT false,
  state public.enterprise_entitlement_state NOT NULL DEFAULT 'estimated',
  rule_version text NOT NULL DEFAULT 'fd026-fd038-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT ebdp_ent_component_unique UNIQUE (revenue_component_key),
  CONSTRAINT ebdp_ent_nonneg CHECK (
    eligible_event_revenue_minor >= 0
    AND platform_commission_minor >= 0
    AND ebdp_entitlement_minor >= 0
  )
);

DROP TRIGGER IF EXISTS trg_enterprise_revenue_entitlements_updated_at ON public.enterprise_revenue_entitlements;
CREATE TRIGGER trg_enterprise_revenue_entitlements_updated_at
  BEFORE UPDATE ON public.enterprise_revenue_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Cross-vertical no-double-commission ledger of claimed revenue components
CREATE TABLE IF NOT EXISTS public.gce_commissioned_revenue_components (
  revenue_component_key text PRIMARY KEY,
  source_vertical text NOT NULL,
  stakeholder_family text NOT NULL, -- enterprise_bdp | marketplace_bdp | connect_bdp | none
  entitlement_ref uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb
);

CREATE OR REPLACE FUNCTION public.gce_claim_revenue_component(
  p_key text,
  p_vertical text,
  p_stakeholder text,
  p_entitlement_ref uuid DEFAULT NULL
)
RETURNS public.gce_commissioned_revenue_components
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_row public.gce_commissioned_revenue_components;
BEGIN
  INSERT INTO public.gce_commissioned_revenue_components (
    revenue_component_key, source_vertical, stakeholder_family, entitlement_ref
  ) VALUES (p_key, p_vertical, p_stakeholder, p_entitlement_ref)
  ON CONFLICT (revenue_component_key) DO NOTHING
  RETURNING * INTO v_row;

  IF v_row.revenue_component_key IS NULL THEN
    SELECT * INTO v_row FROM public.gce_commissioned_revenue_components WHERE revenue_component_key = p_key;
    IF v_row.stakeholder_family IS DISTINCT FROM p_stakeholder
       AND v_row.stakeholder_family <> 'none'
       AND p_stakeholder <> 'none' THEN
      RAISE EXCEPTION 'No double commission on revenue component % (held by %)', p_key, v_row.stakeholder_family
        USING ERRCODE = '23505';
    END IF;
  END IF;
  RETURN v_row;
END;
$$;

CREATE TABLE IF NOT EXISTS public.legacy_enterprise_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_object text NOT NULL UNIQUE,
  mapping_status public.legacy_enterprise_map_status NOT NULL DEFAULT 'needs_review',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_enterprise_migration_map (legacy_object, mapping_status, notes) VALUES
  ('enterprise_requests', 'historical_only', 'Prototype; replaced by enterprise_opportunities'),
  ('enterprise_proposals', 'historical_only', 'Prototype; replaced by enterprise_solution_proposals + enterprise_quotes'),
  ('enterprise_applications', 'historical_only', 'Lead form; bridge via legacy_application_id optional'),
  ('enterprise_campaigns', 'historical_only', 'Not FD-aligned commercial model'),
  ('legacy_enterprise_role', 'ambiguous', 'Do not auto-map to enterprise_bdp — context may be client/BDP/staff')
ON CONFLICT (legacy_object) DO NOTHING;

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('enterprise_bdp_pack_payments', false, 'Money gate — Enterprise BDP pack production collection'),
  ('enterprise_vendor_portal', false, 'Vendor self-serve portal inactive (FD-039)')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.enterprise_bdp_packs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_client_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_client_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_requirements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_requirement_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_solution_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_quote_lines ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_project_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_vendor_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_change_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_client_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enterprise_revenue_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gce_commissioned_revenue_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_enterprise_migration_map ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.gce_is_ebdp_pack_owner(p_pack_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.enterprise_bdp_packs p
    WHERE p.id = p_pack_id AND p.user_id = public.gce_current_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.gce_is_enterprise_client_rep(p_client_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.enterprise_client_profiles c
    JOIN public.organisation_memberships om ON om.organisation_id = c.organisation_id
    WHERE c.id = p_client_id
      AND om.user_id = public.gce_current_user_id()
      AND om.status = 'active'
  ) OR EXISTS (
    SELECT 1 FROM public.enterprise_client_profiles c
    WHERE c.id = p_client_id AND c.primary_representative_user_id = public.gce_current_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.gce_is_enterprise_expert()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_has_active_assignment('enterprise_platform_expert', NULL, NULL)
      OR public.gce_is_platform_admin();
$$;

-- Packs
DROP POLICY IF EXISTS ebdp_packs_select ON public.enterprise_bdp_packs;
CREATE POLICY ebdp_packs_select ON public.enterprise_bdp_packs
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS ebdp_packs_insert ON public.enterprise_bdp_packs;
CREATE POLICY ebdp_packs_insert ON public.enterprise_bdp_packs
  FOR INSERT TO authenticated
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS ebdp_packs_update ON public.enterprise_bdp_packs;
CREATE POLICY ebdp_packs_update ON public.enterprise_bdp_packs
  FOR UPDATE TO authenticated
  USING (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id())
  WITH CHECK (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id());

-- Clients
DROP POLICY IF EXISTS ent_clients_select ON public.enterprise_client_profiles;
CREATE POLICY ent_clients_select ON public.enterprise_client_profiles
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_client_rep(id)
    OR public.gce_is_enterprise_expert()
    OR EXISTS (
      SELECT 1 FROM public.enterprise_client_attributions a
      WHERE a.client_id = id AND a.status = 'active'
        AND a.bdp_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS ent_clients_write ON public.enterprise_client_profiles;
CREATE POLICY ent_clients_write ON public.enterprise_client_profiles
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

-- Attributions
DROP POLICY IF EXISTS ent_attr_select ON public.enterprise_client_attributions;
CREATE POLICY ent_attr_select ON public.enterprise_client_attributions
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR bdp_user_id = public.gce_current_user_id()
    OR public.gce_is_enterprise_client_rep(client_id)
  );

DROP POLICY IF EXISTS ent_attr_admin ON public.enterprise_client_attributions;
CREATE POLICY ent_attr_admin ON public.enterprise_client_attributions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- Opportunities / requirements / proposals / quotes / projects
DROP POLICY IF EXISTS ent_opp_select ON public.enterprise_opportunities;
CREATE POLICY ent_opp_select ON public.enterprise_opportunities
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR public.gce_is_enterprise_client_rep(client_id)
    OR attributed_bdp_user_id = public.gce_current_user_id()
    OR owner_user_id = public.gce_current_user_id()
    OR expert_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS ent_opp_write ON public.enterprise_opportunities;
CREATE POLICY ent_opp_write ON public.enterprise_opportunities
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR attributed_bdp_user_id = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR attributed_bdp_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS ent_req_all ON public.enterprise_requirements;
CREATE POLICY ent_req_all ON public.enterprise_requirements
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin() OR public.gce_is_enterprise_expert()
    OR EXISTS (
      SELECT 1 FROM public.enterprise_opportunities o
      WHERE o.id = opportunity_id AND (
        public.gce_is_enterprise_client_rep(o.client_id)
        OR o.attributed_bdp_user_id = public.gce_current_user_id()
      )
    )
  )
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_req_ver_all ON public.enterprise_requirement_versions;
CREATE POLICY ent_req_ver_all ON public.enterprise_requirement_versions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_sol_prop_all ON public.enterprise_solution_proposals;
CREATE POLICY ent_sol_prop_all ON public.enterprise_solution_proposals
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_quotes_select ON public.enterprise_quotes;
CREATE POLICY ent_quotes_select ON public.enterprise_quotes
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
    OR public.gce_is_enterprise_client_rep(client_id)
    OR EXISTS (
      SELECT 1 FROM public.enterprise_opportunities o
      WHERE o.id = opportunity_id AND o.attributed_bdp_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS ent_quotes_write ON public.enterprise_quotes;
CREATE POLICY ent_quotes_write ON public.enterprise_quotes
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS ent_quote_lines_select ON public.enterprise_quote_lines;
CREATE POLICY ent_quote_lines_select ON public.enterprise_quote_lines
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.enterprise_quotes q WHERE q.id = quote_id
    )
  );

DROP POLICY IF EXISTS ent_projects_select ON public.enterprise_projects;
CREATE POLICY ent_projects_select ON public.enterprise_projects
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_enterprise_expert()
    OR public.gce_is_enterprise_client_rep(client_id)
    OR EXISTS (
      SELECT 1 FROM public.enterprise_client_attributions a
      WHERE a.id = attribution_id AND a.bdp_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS ent_projects_write ON public.enterprise_projects;
CREATE POLICY ent_projects_write ON public.enterprise_projects
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_components_select ON public.enterprise_project_components;
CREATE POLICY ent_components_select ON public.enterprise_project_components
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.enterprise_projects p WHERE p.id = project_id)
  );

DROP POLICY IF EXISTS ent_milestones_select ON public.enterprise_milestones;
CREATE POLICY ent_milestones_select ON public.enterprise_milestones
  FOR SELECT TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.enterprise_projects p WHERE p.id = project_id)
  );

DROP POLICY IF EXISTS ent_vendors_staff ON public.enterprise_vendors;
CREATE POLICY ent_vendors_staff ON public.enterprise_vendors
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_vendor_assign_staff ON public.enterprise_vendor_assignments;
CREATE POLICY ent_vendor_assign_staff ON public.enterprise_vendor_assignments
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert())
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_enterprise_expert());

DROP POLICY IF EXISTS ent_change_orders_select ON public.enterprise_change_orders;
CREATE POLICY ent_change_orders_select ON public.enterprise_change_orders
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin() OR public.gce_is_enterprise_expert()
    OR EXISTS (
      SELECT 1 FROM public.enterprise_projects p
      WHERE p.id = project_id AND public.gce_is_enterprise_client_rep(p.client_id)
    )
  );

DROP POLICY IF EXISTS ent_disputes_select ON public.enterprise_disputes;
CREATE POLICY ent_disputes_select ON public.enterprise_disputes
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR owner_user_id = public.gce_current_user_id()
    OR (client_id IS NOT NULL AND public.gce_is_enterprise_client_rep(client_id))
  );

DROP POLICY IF EXISTS ent_handover_admin ON public.enterprise_client_handovers;
CREATE POLICY ent_handover_admin ON public.enterprise_client_handovers
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS ent_ent_select ON public.enterprise_revenue_entitlements;
CREATE POLICY ent_ent_select ON public.enterprise_revenue_entitlements
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
    OR EXISTS (
      SELECT 1 FROM public.enterprise_bdp_packs p
      WHERE p.id = pack_id AND p.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS ent_ent_finance_write ON public.enterprise_revenue_entitlements;
CREATE POLICY ent_ent_finance_write ON public.enterprise_revenue_entitlements
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS gce_commissioned_components_staff ON public.gce_commissioned_revenue_components;
CREATE POLICY gce_commissioned_components_staff ON public.gce_commissioned_revenue_components
  FOR SELECT TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_has_active_assignment('finance_admin', 'platform', NULL));

DROP POLICY IF EXISTS legacy_ent_map_select ON public.legacy_enterprise_migration_map;
CREATE POLICY legacy_ent_map_select ON public.legacy_enterprise_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.enterprise_bdp_packs IS
  'FD-026 Enterprise BDP Franchise Pack; ₹30k/₹36k; 30 clients; client-based attribution';
COMMENT ON TABLE public.enterprise_quotes IS
  'FD-038 Finance co-sign required when total_proposed_minor > 50000000 before issue';
COMMENT ON TABLE public.enterprise_milestones IS
  'Project-specific schedules only — no universal 30/40/30 (FD-038)';
COMMENT ON FUNCTION public.gce_claim_revenue_component(text, text, text, uuid) IS
  'No double commission across verticals on the same revenue_component_key (FD-037/038)';
