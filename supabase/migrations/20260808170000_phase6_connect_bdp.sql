-- Phase 6 — Connect BDP (additive)
-- Authority: FD-025/029/032/034/035/036/039; SM_Connect_BDP_Attribution
-- Commercial constants from docs/core/36_Commercial_Constants.md (FD wins over draft prompts)
-- Target: gce-dev only. Production untouched. No Marketplace BDP (Phase 7).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.connect_bdp_application_status AS ENUM (
    'draft',
    'submitted',
    'pending_verification',
    'pending_payment',
    'pending_approval',
    'active',
    'rejected',
    'suspended',
    'terminated',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.connect_bdp_package_option AS ENUM (
    'direct_50000',
    'finance_recovery_60000'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.connect_bdp_city_tier AS ENUM (
    'tier_1',
    'tier_2',
    'tier_3'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.connect_attribution_status AS ENUM (
    'unattributed',
    'proposed',
    'pending_evidence',
    'active',
    'disputed',
    'suspended',
    'reassigned_closed',
    'voided'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.connect_bdp_dispute_status AS ENUM (
    'open',
    'bdp_first_level',
    'escalated_prm',
    'under_review',
    'resolved',
    'closed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.connect_bdp_entitlement_state AS ENUM (
    'estimated',
    'provisional',
    'earned',
    'on_hold',
    'settlement_eligible',
    'paid',
    'reversed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.legacy_connect_bdp_map_status AS ENUM (
    'mapped',
    'historical_only',
    'ambiguous',
    'needs_review'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- City deployment config (Performance-Protected Assigned Territory)
-- FD-025 maxima: T1=10, T2=5, T3=2 franchise units
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_city_configs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  city text NOT NULL UNIQUE,
  state text,
  tier public.connect_bdp_city_tier NOT NULL,
  max_units int NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_city_max_by_tier CHECK (
    (tier = 'tier_1' AND max_units = 10)
    OR (tier = 'tier_2' AND max_units = 5)
    OR (tier = 'tier_3' AND max_units = 2)
  )
);

DROP TRIGGER IF EXISTS trg_connect_bdp_city_configs_updated_at ON public.connect_bdp_city_configs;
CREATE TRIGGER trg_connect_bdp_city_configs_updated_at
  BEFORE UPDATE ON public.connect_bdp_city_configs
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Franchise Unit / commercial package
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_assignment_id uuid REFERENCES public.role_assignments(id),
  application_status public.connect_bdp_application_status NOT NULL DEFAULT 'draft',
  package_option public.connect_bdp_package_option NOT NULL DEFAULT 'finance_recovery_60000',
  package_total_minor bigint NOT NULL,
  initial_payment_minor bigint NOT NULL DEFAULT 0,
  recoverable_balance_minor bigint NOT NULL DEFAULT 0,
  recovered_to_date_minor bigint NOT NULL DEFAULT 0,
  remaining_recoverable_minor bigint NOT NULL DEFAULT 0,
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  offline_payment_ref text,
  offline_recorded_by uuid REFERENCES public.users(id),
  offline_approved_by uuid REFERENCES public.users(id),
  terms_accepted_at timestamptz,
  kyc_case_id uuid REFERENCES public.kyc_verification_cases(id),
  activated_at timestamptz,
  suspended_at timestamptz,
  terminated_at timestamptz,
  target_window_months int NOT NULL DEFAULT 10,
  target_circles int NOT NULL DEFAULT 5,
  circles_capacity_max int NOT NULL DEFAULT 5,
  target_start_at timestamptz,
  target_achieved_at timestamptz,
  credited_circles_count int NOT NULL DEFAULT 0,
  active_portfolio_count int NOT NULL DEFAULT 0,
  maintenance_compliant boolean NOT NULL DEFAULT true,
  pricing_rule_version text NOT NULL DEFAULT 'fd025-fd029-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_units_circles_cap CHECK (circles_capacity_max = 5 AND target_circles = 5),
  CONSTRAINT connect_bdp_units_recovery_nonneg CHECK (
    recovered_to_date_minor >= 0
    AND remaining_recoverable_minor >= 0
    AND recovered_to_date_minor + remaining_recoverable_minor = recoverable_balance_minor
  ),
  CONSTRAINT connect_bdp_units_package_amounts CHECK (
    (package_option = 'direct_50000'
      AND package_total_minor = 5000000
      AND initial_payment_minor = 5000000
      AND recoverable_balance_minor = 0)
    OR (package_option = 'finance_recovery_60000'
      AND package_total_minor = 6000000
      AND initial_payment_minor = 500000
      AND recoverable_balance_minor = 5500000)
  )
);

CREATE INDEX IF NOT EXISTS idx_connect_bdp_units_user_status
  ON public.connect_bdp_units (user_id, application_status);

DROP TRIGGER IF EXISTS trg_connect_bdp_units_updated_at ON public.connect_bdp_units;
CREATE TRIGGER trg_connect_bdp_units_updated_at
  BEFORE UPDATE ON public.connect_bdp_units
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Person / controlled-entity standard max 2 active units (FD-025)
CREATE OR REPLACE FUNCTION public.gce_connect_bdp_person_unit_cap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_count int;
BEGIN
  IF NEW.application_status = 'active' THEN
    SELECT count(*)::int INTO v_count
    FROM public.connect_bdp_units u
    WHERE u.user_id = NEW.user_id
      AND u.application_status = 'active'
      AND u.id IS DISTINCT FROM NEW.id;
    IF v_count >= 2 AND COALESCE((NEW.metadata->>'special_unit_approval')::boolean, false) IS NOT TRUE THEN
      RAISE EXCEPTION 'Connect BDP standard max 2 active Franchise Units (FD-025)'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_connect_bdp_person_unit_cap ON public.connect_bdp_units;
CREATE TRIGGER trg_connect_bdp_person_unit_cap
  BEFORE INSERT OR UPDATE OF application_status ON public.connect_bdp_units
  FOR EACH ROW EXECUTE FUNCTION public.gce_connect_bdp_person_unit_cap();

-- ---------------------------------------------------------------------------
-- City / zone assignment
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_city_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  city_config_id uuid NOT NULL REFERENCES public.connect_bdp_city_configs(id),
  zone_code text,
  status text NOT NULL DEFAULT 'active',
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  assigned_by uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connect_bdp_city_assign_active
  ON public.connect_bdp_city_assignments (city_config_id, status)
  WHERE status = 'active';

DROP TRIGGER IF EXISTS trg_connect_bdp_city_assignments_updated_at ON public.connect_bdp_city_assignments;
CREATE TRIGGER trg_connect_bdp_city_assignments_updated_at
  BEFORE UPDATE ON public.connect_bdp_city_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE OR REPLACE FUNCTION public.gce_connect_bdp_city_cap_guard()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_max int;
  v_count int;
BEGIN
  IF NEW.status <> 'active' THEN
    RETURN NEW;
  END IF;

  SELECT max_units INTO v_max
  FROM public.connect_bdp_city_configs
  WHERE id = NEW.city_config_id;

  SELECT count(*)::int INTO v_count
  FROM public.connect_bdp_city_assignments a
  JOIN public.connect_bdp_units u ON u.id = a.unit_id
  WHERE a.city_config_id = NEW.city_config_id
    AND a.status = 'active'
    AND u.application_status = 'active'
    AND a.id IS DISTINCT FROM NEW.id;

  IF v_count >= v_max THEN
    RAISE EXCEPTION 'Connect BDP city unit capacity exceeded (max %)', v_max
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_connect_bdp_city_cap ON public.connect_bdp_city_assignments;
CREATE TRIGGER trg_connect_bdp_city_cap
  BEFORE INSERT OR UPDATE OF status ON public.connect_bdp_city_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_connect_bdp_city_cap_guard();

-- ---------------------------------------------------------------------------
-- Member attribution (FD-036 / SM_Connect_BDP_Attribution)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_member_attributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES public.connect_bdp_units(id),
  bdp_user_id uuid REFERENCES public.users(id),
  status public.connect_attribution_status NOT NULL DEFAULT 'proposed',
  provenance text NOT NULL DEFAULT 'sourced', -- sourced | referred | platform_assigned | organic
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
  CONSTRAINT connect_attr_no_self_approve CHECK (
    approved_by IS NULL OR created_by IS DISTINCT FROM approved_by OR is_correction = true
  )
);

CREATE INDEX IF NOT EXISTS idx_connect_attr_membership_status
  ON public.connect_bdp_member_attributions (membership_id, status);
CREATE INDEX IF NOT EXISTS idx_connect_attr_unit_status
  ON public.connect_bdp_member_attributions (unit_id, status);

-- At most one active attribution per membership
CREATE UNIQUE INDEX IF NOT EXISTS uq_connect_attr_one_active_per_membership
  ON public.connect_bdp_member_attributions (membership_id)
  WHERE status = 'active';

DROP TRIGGER IF EXISTS trg_connect_attr_updated_at ON public.connect_bdp_member_attributions;
CREATE TRIGGER trg_connect_attr_updated_at
  BEFORE UPDATE ON public.connect_bdp_member_attributions
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Circle portfolio / assignment
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_circle_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'active',
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  assigned_by uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connect_bdp_circle_assign
  ON public.connect_bdp_circle_assignments (unit_id, status);

CREATE UNIQUE INDEX IF NOT EXISTS uq_connect_bdp_circle_one_active
  ON public.connect_bdp_circle_assignments (circle_id)
  WHERE status = 'active';

DROP TRIGGER IF EXISTS trg_connect_bdp_circle_assign_updated_at ON public.connect_bdp_circle_assignments;
CREATE TRIGGER trg_connect_bdp_circle_assign_updated_at
  BEFORE UPDATE ON public.connect_bdp_circle_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Cap 5 active Circles per unit
CREATE OR REPLACE FUNCTION public.gce_connect_bdp_circle_portfolio_cap()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  v_count int;
  v_max int;
BEGIN
  IF NEW.status <> 'active' THEN
    RETURN NEW;
  END IF;
  SELECT circles_capacity_max INTO v_max FROM public.connect_bdp_units WHERE id = NEW.unit_id;
  SELECT count(*)::int INTO v_count
  FROM public.connect_bdp_circle_assignments
  WHERE unit_id = NEW.unit_id AND status = 'active' AND id IS DISTINCT FROM NEW.id;
  IF v_count >= COALESCE(v_max, 5) THEN
    RAISE EXCEPTION 'Connect BDP Franchise Unit Circle capacity exceeded (max 5)'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_connect_bdp_circle_portfolio_cap ON public.connect_bdp_circle_assignments;
CREATE TRIGGER trg_connect_bdp_circle_portfolio_cap
  BEFORE INSERT OR UPDATE OF status ON public.connect_bdp_circle_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_connect_bdp_circle_portfolio_cap();

-- ---------------------------------------------------------------------------
-- Target credits (once at formal 15-member Circle activation — FD-032)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_target_credits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  circle_activation_event_id uuid NOT NULL,
  credited_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_target_credit_unique_circle UNIQUE (circle_id),
  CONSTRAINT connect_bdp_target_credit_unique_event UNIQUE (circle_activation_event_id)
);

CREATE INDEX IF NOT EXISTS idx_connect_bdp_target_credits_unit
  ON public.connect_bdp_target_credits (unit_id, credited_at);

-- ---------------------------------------------------------------------------
-- Commission entitlement boundary + recovery ledger
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_commission_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  membership_id uuid REFERENCES public.connect_memberships(id),
  attribution_id uuid REFERENCES public.connect_bdp_member_attributions(id),
  earning_event_key text NOT NULL,
  gross_eligible_revenue_minor bigint NOT NULL DEFAULT 0,
  commission_bps int NOT NULL DEFAULT 2000, -- 20%
  gross_commission_minor bigint NOT NULL DEFAULT 0,
  state public.connect_bdp_entitlement_state NOT NULL DEFAULT 'estimated',
  earning_at timestamptz NOT NULL DEFAULT now(),
  rule_version text NOT NULL DEFAULT 'fd025-fd029-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_comm_unique_event UNIQUE (unit_id, earning_event_key),
  CONSTRAINT connect_bdp_comm_nonneg CHECK (
    gross_eligible_revenue_minor >= 0 AND gross_commission_minor >= 0
  )
);

DROP TRIGGER IF EXISTS trg_connect_bdp_comm_updated_at ON public.connect_bdp_commission_entitlements;
CREATE TRIGGER trg_connect_bdp_comm_updated_at
  BEFORE UPDATE ON public.connect_bdp_commission_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.connect_bdp_recovery_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  entitlement_id uuid REFERENCES public.connect_bdp_commission_entitlements(id),
  cycle_key text NOT NULL,
  recovered_minor bigint NOT NULL,
  remaining_after_minor bigint NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_recovery_positive CHECK (recovered_minor > 0),
  CONSTRAINT connect_bdp_recovery_cycle_cap CHECK (recovered_minor <= 500000),
  CONSTRAINT connect_bdp_recovery_unique_cycle UNIQUE (unit_id, cycle_key, entitlement_id)
);

-- ---------------------------------------------------------------------------
-- Disputes / handover
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_bdp_disputes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id) ON DELETE CASCADE,
  circle_id uuid REFERENCES public.connect_circles(id),
  membership_id uuid REFERENCES public.connect_memberships(id),
  status public.connect_bdp_dispute_status NOT NULL DEFAULT 'open',
  subject text NOT NULL,
  details text,
  opened_by uuid REFERENCES public.users(id),
  prm_user_id uuid REFERENCES public.users(id),
  resolved_by uuid REFERENCES public.users(id),
  resolution text,
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_connect_bdp_disputes_updated_at ON public.connect_bdp_disputes;
CREATE TRIGGER trg_connect_bdp_disputes_updated_at
  BEFORE UPDATE ON public.connect_bdp_disputes
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.connect_bdp_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id),
  target_unit_id uuid NOT NULL REFERENCES public.connect_bdp_units(id),
  status text NOT NULL DEFAULT 'requested',
  effective_from timestamptz,
  notes text,
  requested_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  completed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_bdp_handover_distinct CHECK (source_unit_id <> target_unit_id)
);

DROP TRIGGER IF EXISTS trg_connect_bdp_handovers_updated_at ON public.connect_bdp_handovers;
CREATE TRIGGER trg_connect_bdp_handovers_updated_at
  BEFORE UPDATE ON public.connect_bdp_handovers
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Legacy map
CREATE TABLE IF NOT EXISTS public.legacy_connect_bdp_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_role text NOT NULL UNIQUE,
  canonical_role_key public.gce_role_key,
  mapping_status public.legacy_connect_bdp_map_status NOT NULL DEFAULT 'needs_review',
  grants_entitlement boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_connect_bdp_migration_map (
  legacy_role, canonical_role_key, mapping_status, grants_entitlement, notes
) VALUES
  ('cbdp', 'connect_bdp', 'mapped', false, 'Maps only with clear provenance; requires explicit role_assignment'),
  ('bdm', NULL, 'ambiguous', false, 'Do not auto-map BDM to Connect BDP'),
  ('zbp', NULL, 'historical_only', false, 'ZBP commercial inactive (FD-039)'),
  ('franchisee', NULL, 'historical_only', false, 'Franchise Unit is commercial construct, not RBAC role')
ON CONFLICT (legacy_role) DO NOTHING;

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('connect_bdp_pack_payments', false, 'Money gate — Connect BDP pack production collection'),
  ('connect_bdp_offline_bank_payment', false, 'Rare offline bank path for Connect BDP pack')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Functions: target credit + recovery + progress refresh
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_connect_bdp_credit_circle_activation(
  p_circle_id uuid,
  p_actor uuid DEFAULT NULL
)
RETURNS public.connect_bdp_target_credits
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_circle public.connect_circles;
  v_assign public.connect_bdp_circle_assignments;
  v_credit public.connect_bdp_target_credits;
  v_event uuid;
BEGIN
  SELECT * INTO v_circle FROM public.connect_circles WHERE id = p_circle_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Circle not found';
  END IF;

  -- Only formal 15+ platform activation creates credit (already stamped once on circle)
  IF v_circle.platform_activation_granted_at IS NULL OR v_circle.bdp_target_credit_event_id IS NULL THEN
    RAISE EXCEPTION 'Circle has no formal platform activation credit event';
  END IF;

  v_event := v_circle.bdp_target_credit_event_id;

  -- Idempotent: existing credit for circle/event wins
  SELECT * INTO v_credit FROM public.connect_bdp_target_credits WHERE circle_id = p_circle_id;
  IF FOUND THEN
    RETURN v_credit;
  END IF;

  SELECT * INTO v_assign
  FROM public.connect_bdp_circle_assignments
  WHERE circle_id = p_circle_id AND status = 'active'
  LIMIT 1;

  IF NOT FOUND THEN
    -- No active BDP portfolio assignment → no BDP target credit row (organic circle)
    RETURN NULL;
  END IF;

  INSERT INTO public.connect_bdp_target_credits (
    unit_id, circle_id, circle_activation_event_id, metadata
  ) VALUES (
    v_assign.unit_id, p_circle_id, v_event,
    jsonb_build_object('actor', p_actor, 'source', 'circle.activation_granted')
  )
  ON CONFLICT (circle_id) DO UPDATE SET circle_id = EXCLUDED.circle_id
  RETURNING * INTO v_credit;

  UPDATE public.connect_bdp_units u SET
    credited_circles_count = (
      SELECT count(*)::int FROM public.connect_bdp_target_credits t WHERE t.unit_id = u.id
    ),
    target_achieved_at = CASE
      WHEN (
        SELECT count(*) FROM public.connect_bdp_target_credits t WHERE t.unit_id = u.id
      ) >= u.target_circles THEN COALESCE(u.target_achieved_at, now())
      ELSE u.target_achieved_at
    END,
    updated_at = now()
  WHERE u.id = v_assign.unit_id;

  RETURN v_credit;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_connect_bdp_apply_recovery(
  p_unit_id uuid,
  p_entitlement_id uuid,
  p_cycle_key text,
  p_actor uuid DEFAULT NULL
)
RETURNS public.connect_bdp_recovery_entries
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit public.connect_bdp_units;
  v_ent public.connect_bdp_commission_entitlements;
  v_amount bigint;
  v_entry public.connect_bdp_recovery_entries;
BEGIN
  SELECT * INTO v_unit FROM public.connect_bdp_units WHERE id = p_unit_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unit not found'; END IF;

  SELECT * INTO v_ent FROM public.connect_bdp_commission_entitlements WHERE id = p_entitlement_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Entitlement not found'; END IF;
  IF v_ent.unit_id <> p_unit_id THEN RAISE EXCEPTION 'Entitlement/unit mismatch'; END IF;
  IF v_ent.state NOT IN ('earned', 'settlement_eligible') THEN
    RAISE EXCEPTION 'Recovery only from earned/settlement-eligible commission';
  END IF;

  IF v_unit.remaining_recoverable_minor <= 0 THEN
    RAISE EXCEPTION 'No remaining recoverable balance';
  END IF;

  v_amount := LEAST(500000, v_unit.remaining_recoverable_minor, v_ent.gross_commission_minor);
  IF v_amount <= 0 THEN
    RAISE EXCEPTION 'No recoverable amount available in this cycle';
  END IF;

  UPDATE public.connect_bdp_units SET
    recovered_to_date_minor = recovered_to_date_minor + v_amount,
    remaining_recoverable_minor = remaining_recoverable_minor - v_amount,
    updated_at = now()
  WHERE id = p_unit_id
  RETURNING * INTO v_unit;

  IF v_unit.remaining_recoverable_minor < 0
     OR v_unit.recovered_to_date_minor > v_unit.recoverable_balance_minor THEN
    RAISE EXCEPTION 'Recovery balance invariant violated';
  END IF;

  INSERT INTO public.connect_bdp_recovery_entries (
    unit_id, entitlement_id, cycle_key, recovered_minor, remaining_after_minor, actor_user_id, reason
  ) VALUES (
    p_unit_id, p_entitlement_id, p_cycle_key, v_amount, v_unit.remaining_recoverable_minor, p_actor,
    'Package recovery from eligible Connect BDP commission (FD-029)'
  )
  RETURNING * INTO v_entry;

  RETURN v_entry;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_connect_bdp_refresh_portfolio_counts(p_unit_id uuid)
RETURNS public.connect_bdp_units
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_unit public.connect_bdp_units;
  v_active int;
  v_credited int;
BEGIN
  SELECT count(*)::int INTO v_active
  FROM public.connect_bdp_circle_assignments
  WHERE unit_id = p_unit_id AND status = 'active';

  SELECT count(*)::int INTO v_credited
  FROM public.connect_bdp_target_credits
  WHERE unit_id = p_unit_id;

  UPDATE public.connect_bdp_units SET
    active_portfolio_count = v_active,
    credited_circles_count = v_credited,
    maintenance_compliant = CASE
      WHEN target_achieved_at IS NULL THEN true
      ELSE v_active >= target_circles
    END,
    updated_at = now()
  WHERE id = p_unit_id
  RETURNING * INTO v_unit;

  RETURN v_unit;
END;
$$;

-- Bridge: when Phase 5 refreshes circle capacity and issues activation, credit BDP if assigned
CREATE OR REPLACE FUNCTION public.gce_refresh_circle_capacity(p_circle_id uuid, p_actor uuid DEFAULT NULL)
RETURNS public.connect_circles
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_count int;
  v_circle public.connect_circles;
  v_life public.circle_lifecycle_status;
  v_const public.circle_constitution_status;
  v_prev_life public.circle_lifecycle_status;
  v_prev_const public.circle_constitution_status;
  v_should_activate boolean := false;
BEGIN
  SELECT count(*)::int INTO v_count
  FROM public.connect_circle_seats s
  WHERE s.circle_id = p_circle_id
    AND s.counts_toward_capacity = true
    AND s.status IN ('allocated', 'protected_grace');

  IF v_count > 40 THEN
    RAISE EXCEPTION 'Circle capacity exceeded (max 40)' USING ERRCODE = '23514';
  END IF;

  SELECT * INTO v_circle FROM public.connect_circles WHERE id = p_circle_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Circle not found';
  END IF;

  v_prev_life := v_circle.lifecycle_status;
  v_prev_const := v_circle.constitution_status;

  SELECT g.lifecycle, g.constitution INTO v_life, v_const
  FROM public.gce_circle_statuses_for_count(v_count) g;

  IF v_count >= 15 AND v_circle.platform_activation_granted_at IS NULL THEN
    v_should_activate := true;
  END IF;

  UPDATE public.connect_circles c SET
    active_seat_count = v_count,
    lifecycle_status = CASE
      WHEN c.lifecycle_status IN ('suspended', 'merged', 'archived', 'under_review') THEN c.lifecycle_status
      ELSE v_life
    END,
    constitution_status = v_const,
    platform_activation_granted_at = CASE
      WHEN v_should_activate THEN now()
      ELSE c.platform_activation_granted_at
    END,
    activated_at = CASE
      WHEN v_should_activate THEN COALESCE(c.activated_at, now())
      ELSE c.activated_at
    END,
    full_capacity_at = CASE
      WHEN v_count = 40 THEN COALESCE(c.full_capacity_at, now())
      ELSE c.full_capacity_at
    END,
    bdp_target_credit_issued_at = CASE
      WHEN v_should_activate AND c.bdp_target_credit_issued_at IS NULL THEN now()
      ELSE c.bdp_target_credit_issued_at
    END,
    bdp_target_credit_event_id = CASE
      WHEN v_should_activate AND c.bdp_target_credit_event_id IS NULL THEN gen_random_uuid()
      ELSE c.bdp_target_credit_event_id
    END,
    updated_at = now()
  WHERE c.id = p_circle_id
  RETURNING * INTO v_circle;

  IF v_prev_life IS DISTINCT FROM v_circle.lifecycle_status
     OR v_prev_const IS DISTINCT FROM v_circle.constitution_status
     OR v_should_activate THEN
    INSERT INTO public.connect_circle_events (
      circle_id, event_type, from_lifecycle, to_lifecycle,
      from_constitution, to_constitution, active_seat_count, actor_user_id, reason, metadata
    ) VALUES (
      p_circle_id,
      CASE WHEN v_should_activate THEN 'circle.activation_granted' ELSE 'circle.status_recomputed' END,
      v_prev_life, v_circle.lifecycle_status,
      v_prev_const, v_circle.constitution_status,
      v_count, p_actor,
      CASE WHEN v_should_activate THEN 'Formal activation at >=15 approved paid seats' ELSE 'Capacity refresh' END,
      jsonb_build_object(
        'bdp_target_credit_event_id', v_circle.bdp_target_credit_event_id,
        'activation_once', v_should_activate
      )
    );
  END IF;

  -- Phase 6: idempotent target credit for assigned Connect BDP unit
  IF v_should_activate OR v_circle.bdp_target_credit_event_id IS NOT NULL THEN
    BEGIN
      PERFORM public.gce_connect_bdp_credit_circle_activation(p_circle_id, p_actor);
    EXCEPTION WHEN OTHERS THEN
      -- Do not fail Circle refresh if no BDP assignment
      NULL;
    END;
  END IF;

  RETURN v_circle;
END;
$$;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.connect_bdp_city_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_city_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_member_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_circle_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_target_credits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_commission_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_recovery_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_disputes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_bdp_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_connect_bdp_migration_map ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.gce_is_connect_bdp_owner(p_unit_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.connect_bdp_units u
    WHERE u.id = p_unit_id AND u.user_id = public.gce_current_user_id()
  );
$$;

DROP POLICY IF EXISTS bdp_city_configs_select ON public.connect_bdp_city_configs;
CREATE POLICY bdp_city_configs_select ON public.connect_bdp_city_configs
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS bdp_city_configs_admin ON public.connect_bdp_city_configs;
CREATE POLICY bdp_city_configs_admin ON public.connect_bdp_city_configs
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_units_select ON public.connect_bdp_units;
CREATE POLICY bdp_units_select ON public.connect_bdp_units
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_units_insert_own ON public.connect_bdp_units;
CREATE POLICY bdp_units_insert_own ON public.connect_bdp_units
  FOR INSERT TO authenticated
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_units_admin_update ON public.connect_bdp_units;
CREATE POLICY bdp_units_admin_update ON public.connect_bdp_units
  FOR UPDATE TO authenticated
  USING (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id())
  WITH CHECK (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS bdp_city_assign_select ON public.connect_bdp_city_assignments;
CREATE POLICY bdp_city_assign_select ON public.connect_bdp_city_assignments
  FOR SELECT TO authenticated
  USING (public.gce_is_connect_bdp_owner(unit_id) OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_city_assign_admin ON public.connect_bdp_city_assignments;
CREATE POLICY bdp_city_assign_admin ON public.connect_bdp_city_assignments
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_attr_select ON public.connect_bdp_member_attributions;
CREATE POLICY bdp_attr_select ON public.connect_bdp_member_attributions
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR bdp_user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS bdp_attr_admin_write ON public.connect_bdp_member_attributions;
CREATE POLICY bdp_attr_admin_write ON public.connect_bdp_member_attributions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- Connect BDP may propose attributions for their own unit (cannot activate/self-approve)
DROP POLICY IF EXISTS bdp_attr_propose_own ON public.connect_bdp_member_attributions;
CREATE POLICY bdp_attr_propose_own ON public.connect_bdp_member_attributions
  FOR INSERT TO authenticated
  WITH CHECK (
    status = 'proposed'
    AND bdp_user_id = public.gce_current_user_id()
    AND created_by = public.gce_current_user_id()
    AND public.gce_is_connect_bdp_owner(unit_id)
  );

DROP POLICY IF EXISTS bdp_circle_assign_select ON public.connect_bdp_circle_assignments;
CREATE POLICY bdp_circle_assign_select ON public.connect_bdp_circle_assignments
  FOR SELECT TO authenticated
  USING (public.gce_is_connect_bdp_owner(unit_id) OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_circle_assign_admin ON public.connect_bdp_circle_assignments;
CREATE POLICY bdp_circle_assign_admin ON public.connect_bdp_circle_assignments
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS bdp_target_select ON public.connect_bdp_target_credits;
CREATE POLICY bdp_target_select ON public.connect_bdp_target_credits
  FOR SELECT TO authenticated
  USING (public.gce_is_connect_bdp_owner(unit_id) OR public.gce_is_platform_admin());

-- No authenticated INSERT on target credits — function/service role only
DROP POLICY IF EXISTS bdp_comm_select ON public.connect_bdp_commission_entitlements;
CREATE POLICY bdp_comm_select ON public.connect_bdp_commission_entitlements
  FOR SELECT TO authenticated
  USING (
    public.gce_is_connect_bdp_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS bdp_comm_admin_write ON public.connect_bdp_commission_entitlements;
CREATE POLICY bdp_comm_admin_write ON public.connect_bdp_commission_entitlements
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS bdp_recovery_select ON public.connect_bdp_recovery_entries;
CREATE POLICY bdp_recovery_select ON public.connect_bdp_recovery_entries
  FOR SELECT TO authenticated
  USING (
    public.gce_is_connect_bdp_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS bdp_disputes_select ON public.connect_bdp_disputes;
CREATE POLICY bdp_disputes_select ON public.connect_bdp_disputes
  FOR SELECT TO authenticated
  USING (
    public.gce_is_connect_bdp_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR prm_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS bdp_disputes_write ON public.connect_bdp_disputes;
CREATE POLICY bdp_disputes_write ON public.connect_bdp_disputes
  FOR ALL TO authenticated
  USING (
    public.gce_is_connect_bdp_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR prm_user_id = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_connect_bdp_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR prm_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS bdp_handover_admin ON public.connect_bdp_handovers;
CREATE POLICY bdp_handover_admin ON public.connect_bdp_handovers
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS legacy_connect_bdp_map_select ON public.legacy_connect_bdp_migration_map;
CREATE POLICY legacy_connect_bdp_map_select ON public.legacy_connect_bdp_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.connect_bdp_units IS
  'FD-025/029 Connect BDP Franchise Unit; direct ₹50k or financed ₹60k (₹5k+₹55k recoverable)';
COMMENT ON TABLE public.connect_bdp_target_credits IS
  'One credit per Circle at formal 15-member activation; never at 20/40';
COMMENT ON FUNCTION public.gce_connect_bdp_apply_recovery(uuid, uuid, text, uuid) IS
  'FD-029 recovery: max ₹5k/cycle from earned commission; no over-recovery';
