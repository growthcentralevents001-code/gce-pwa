-- Phase 5 — Membership & GCE Connect (additive)
-- Authority: FD-022/024/027/030/032/035/036/039; SM_Membership / SM_Circle / SM_Circle_Seat / SM_KYC
-- Target: gce-dev only from this pass. Production untouched.
-- Does NOT implement Connect BDP commission (Phase 6).

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.membership_plan_key AS ENUM (
    'associate',
    'core_future_inactive'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_status AS ENUM (
    'draft',
    'applied',
    'pending_payment',
    'pending_verification',
    'pending_approval',
    'active',
    'grace_period',
    'frozen',
    'restricted',
    'suspended',
    'expired',
    'terminated',
    'rejoining_review',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.membership_allocation_status AS ENUM (
    'unallocated',
    'pending_allocation',
    'allocated',
    'waitlisted'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.kyc_case_status AS ENUM (
    'not_started',
    'in_progress',
    'additional_info_required',
    'under_review',
    'conditionally_cleared',
    'cleared',
    'failed',
    'expired',
    'revoked',
    'waived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.kyc_purpose AS ENUM (
    'membership',
    'seat',
    'role_assignment',
    'venue',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.circle_lifecycle_status AS ENUM (
    'draft',
    'formation',
    'pending_activation',
    'active_growth',
    'full_capacity',
    'mature',
    'under_review',
    'suspended',
    'merged',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.circle_constitution_status AS ENUM (
    'formation_circle',
    'provisionally_active_circle',
    'fully_constituted_circle'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.circle_seat_status AS ENUM (
    'available',
    'reserved',
    'waitlisted',
    'pending_verification',
    'allocated',
    'protected_grace',
    'transfer_pending',
    'released',
    'blocked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.allocation_proposal_status AS ENUM (
    'proposed',
    'accepted',
    'rejected',
    'confirmed',
    'expired',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.waitlist_status AS ENUM (
    'active',
    'offered',
    'fulfilled',
    'withdrawn',
    'expired',
    'removed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.circle_transfer_status AS ENUM (
    'requested',
    'under_review',
    'approved',
    'rejected',
    'completed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.legacy_membership_map_status AS ENUM (
    'mapped',
    'historical_only',
    'ambiguous',
    'needs_review'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Plans (Associate active; Core future/inactive purchasability)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.membership_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_key public.membership_plan_key NOT NULL UNIQUE,
  label text NOT NULL,
  billing_cadence text NOT NULL DEFAULT 'quarterly',
  price_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  is_purchasable boolean NOT NULL DEFAULT false,
  is_active boolean NOT NULL DEFAULT true,
  included_tag_slots int NOT NULL DEFAULT 2,
  max_tag_slots int NOT NULL DEFAULT 4,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT membership_plans_price_nonneg CHECK (price_minor >= 0),
  CONSTRAINT membership_plans_tag_slots CHECK (
    included_tag_slots >= 0
    AND max_tag_slots >= included_tag_slots
    AND max_tag_slots <= 4
  )
);

DROP TRIGGER IF EXISTS trg_membership_plans_updated_at ON public.membership_plans;
CREATE TRIGGER trg_membership_plans_updated_at
  BEFORE UPDATE ON public.membership_plans
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

INSERT INTO public.membership_plans (
  plan_key, label, billing_cadence, price_minor, currency, is_purchasable, is_active
) VALUES
  ('associate', 'GCE Connect Circle Membership — Associate Tier', 'quarterly', 600000, 'INR', true, true),
  ('core_future_inactive', 'GCE Connect Circle Membership — Core Tier (future/inactive)', 'quarterly', 900000, 'INR', false, false)
ON CONFLICT (plan_key) DO UPDATE SET
  label = EXCLUDED.label,
  price_minor = EXCLUDED.price_minor,
  is_purchasable = EXCLUDED.is_purchasable,
  is_active = EXCLUDED.is_active,
  updated_at = now();

-- ---------------------------------------------------------------------------
-- Specialisation taxonomy (centrally controlled)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.business_specialisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE,
  label text NOT NULL,
  power_sector text,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_business_specialisations_updated_at ON public.business_specialisations;
CREATE TRIGGER trg_business_specialisations_updated_at
  BEFORE UPDATE ON public.business_specialisations
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

INSERT INTO public.business_specialisations (code, label, power_sector) VALUES
  ('general_business', 'General Business', 'sector_a'),
  ('professional_services', 'Professional Services', 'sector_b'),
  ('trade_retail', 'Trade / Retail', 'sector_c'),
  ('technology', 'Technology', 'sector_d')
ON CONFLICT (code) DO NOTHING;

-- ---------------------------------------------------------------------------
-- KYC / verification cases
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.kyc_verification_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  purpose public.kyc_purpose NOT NULL DEFAULT 'membership',
  status public.kyc_case_status NOT NULL DEFAULT 'not_started',
  aadhaar_used boolean NOT NULL DEFAULT false,
  evidence_refs jsonb NOT NULL DEFAULT '[]'::jsonb,
  reviewer_user_id uuid REFERENCES public.users(id),
  reason text,
  cleared_at timestamptz,
  expires_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_kyc_cases_user_purpose
  ON public.kyc_verification_cases (user_id, purpose, status);

DROP TRIGGER IF EXISTS trg_kyc_cases_updated_at ON public.kyc_verification_cases;
CREATE TRIGGER trg_kyc_cases_updated_at
  BEFORE UPDATE ON public.kyc_verification_cases
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Memberships (separate from User identity)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  plan_id uuid NOT NULL REFERENCES public.membership_plans(id),
  status public.membership_status NOT NULL DEFAULT 'draft',
  allocation_status public.membership_allocation_status NOT NULL DEFAULT 'unallocated',
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  organisation_id uuid REFERENCES public.organisations(id),
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  kyc_case_id uuid REFERENCES public.kyc_verification_cases(id),
  preferred_locality text,
  preferred_city text,
  preferred_district text,
  preferred_state text,
  -- Optional Connect BDP attribution (Phase 6 consumes); never auto-create commission
  connect_bdp_user_id uuid REFERENCES public.users(id),
  connect_bdp_attribution_id uuid,
  attribution_provenance text,
  activated_at timestamptz,
  starts_at timestamptz,
  ends_at timestamptz,
  grace_ends_at timestamptz,
  frozen_until timestamptz,
  suspended_at timestamptz,
  suspended_by uuid REFERENCES public.users(id),
  suspend_reason text,
  terminated_at timestamptz,
  terminate_reason text,
  pricing_rule_version text NOT NULL DEFAULT 'fd027-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connect_memberships_user_status
  ON public.connect_memberships (user_id, status);
CREATE INDEX IF NOT EXISTS idx_connect_memberships_allocation
  ON public.connect_memberships (allocation_status, status);

DROP TRIGGER IF EXISTS trg_connect_memberships_updated_at ON public.connect_memberships;
CREATE TRIGGER trg_connect_memberships_updated_at
  BEFORE UPDATE ON public.connect_memberships
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.connect_membership_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_status public.membership_status,
  to_status public.membership_status,
  from_allocation public.membership_allocation_status,
  to_allocation public.membership_allocation_status,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_connect_membership_events_membership
  ON public.connect_membership_events (membership_id, created_at DESC);

-- Tags (max 4; slots 1–2 included; 3–4 +25% each)
CREATE TABLE IF NOT EXISTS public.membership_tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  tag_slot smallint NOT NULL,
  tag_key text NOT NULL,
  tag_label text NOT NULL,
  is_included boolean NOT NULL DEFAULT false,
  surcharge_bps int NOT NULL DEFAULT 0,
  surcharge_minor bigint NOT NULL DEFAULT 0,
  pricing_rule_version text NOT NULL DEFAULT 'fd027-v1',
  status text NOT NULL DEFAULT 'active',
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT membership_tags_slot_range CHECK (tag_slot BETWEEN 1 AND 4),
  CONSTRAINT membership_tags_unique_slot UNIQUE (membership_id, tag_slot),
  CONSTRAINT membership_tags_surcharge_nonneg CHECK (surcharge_bps >= 0 AND surcharge_minor >= 0)
);

DROP TRIGGER IF EXISTS trg_membership_tags_updated_at ON public.membership_tags;
CREATE TRIGGER trg_membership_tags_updated_at
  BEFORE UPDATE ON public.membership_tags
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Circles (dual status families)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_circles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE,
  name text NOT NULL,
  city text NOT NULL,
  district text,
  state text,
  locality text,
  lifecycle_status public.circle_lifecycle_status NOT NULL DEFAULT 'draft',
  constitution_status public.circle_constitution_status NOT NULL DEFAULT 'formation_circle',
  capacity_max int NOT NULL DEFAULT 40,
  active_seat_count int NOT NULL DEFAULT 0,
  activated_at timestamptz,
  full_capacity_at timestamptz,
  -- One-time BDP target-credit hook at formal 15 activation (Phase 6 consumes)
  bdp_target_credit_issued_at timestamptz,
  bdp_target_credit_event_id uuid,
  platform_activation_granted_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT connect_circles_capacity_max CHECK (capacity_max = 40),
  CONSTRAINT connect_circles_seat_count CHECK (
    active_seat_count >= 0 AND active_seat_count <= capacity_max
  ),
  CONSTRAINT connect_circles_bdp_credit_once CHECK (
    bdp_target_credit_issued_at IS NULL OR bdp_target_credit_event_id IS NOT NULL
  )
);

CREATE INDEX IF NOT EXISTS idx_connect_circles_geo
  ON public.connect_circles (city, state, lifecycle_status);

DROP TRIGGER IF EXISTS trg_connect_circles_updated_at ON public.connect_circles;
CREATE TRIGGER trg_connect_circles_updated_at
  BEFORE UPDATE ON public.connect_circles
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.connect_circle_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_lifecycle public.circle_lifecycle_status,
  to_lifecycle public.circle_lifecycle_status,
  from_constitution public.circle_constitution_status,
  to_constitution public.circle_constitution_status,
  active_seat_count int,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Circle seats
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.connect_circle_seats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  membership_id uuid REFERENCES public.connect_memberships(id),
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  status public.circle_seat_status NOT NULL DEFAULT 'available',
  reserved_until timestamptz,
  allocated_at timestamptz,
  confirmed_at timestamptz,
  released_at timestamptz,
  counts_toward_capacity boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_circle_seats_circle_status
  ON public.connect_circle_seats (circle_id, status);
CREATE INDEX IF NOT EXISTS idx_circle_seats_membership
  ON public.connect_circle_seats (membership_id)
  WHERE membership_id IS NOT NULL;

-- At most one capacity-counting seat per membership
CREATE UNIQUE INDEX IF NOT EXISTS uq_circle_seats_one_active_per_membership
  ON public.connect_circle_seats (membership_id)
  WHERE counts_toward_capacity = true AND membership_id IS NOT NULL;

DROP TRIGGER IF EXISTS trg_circle_seats_updated_at ON public.connect_circle_seats;
CREATE TRIGGER trg_circle_seats_updated_at
  BEFORE UPDATE ON public.connect_circle_seats
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Waitlist / allocation / transfer
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.circle_waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  preferred_city text,
  preferred_district text,
  preferred_state text,
  preferred_circle_id uuid REFERENCES public.connect_circles(id),
  status public.waitlist_status NOT NULL DEFAULT 'active',
  admin_priority int NOT NULL DEFAULT 0,
  offered_at timestamptz,
  fulfilled_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_waitlist_ops_order
  ON public.circle_waitlist_entries (status, admin_priority DESC, created_at ASC);

DROP TRIGGER IF EXISTS trg_waitlist_updated_at ON public.circle_waitlist_entries;
CREATE TRIGGER trg_waitlist_updated_at
  BEFORE UPDATE ON public.circle_waitlist_entries
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.circle_allocation_proposals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id),
  specialisation_id uuid REFERENCES public.business_specialisations(id),
  status public.allocation_proposal_status NOT NULL DEFAULT 'proposed',
  proposed_by uuid REFERENCES public.users(id),
  assisted_by_bdp_user_id uuid REFERENCES public.users(id),
  confirmed_by uuid REFERENCES public.users(id),
  seat_id uuid REFERENCES public.connect_circle_seats(id),
  due_business_days int NOT NULL DEFAULT 7,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_allocation_proposals_updated_at ON public.circle_allocation_proposals;
CREATE TRIGGER trg_allocation_proposals_updated_at
  BEFORE UPDATE ON public.circle_allocation_proposals
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.circle_transfers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  membership_id uuid NOT NULL REFERENCES public.connect_memberships(id) ON DELETE CASCADE,
  source_circle_id uuid NOT NULL REFERENCES public.connect_circles(id),
  target_circle_id uuid NOT NULL REFERENCES public.connect_circles(id),
  source_seat_id uuid REFERENCES public.connect_circle_seats(id),
  target_seat_id uuid REFERENCES public.connect_circle_seats(id),
  status public.circle_transfer_status NOT NULL DEFAULT 'requested',
  -- Attribution does NOT auto-transfer
  preserve_bdp_attribution boolean NOT NULL DEFAULT true,
  admin_fee_minor bigint NOT NULL DEFAULT 0,
  fee_waived boolean NOT NULL DEFAULT false,
  requested_by uuid REFERENCES public.users(id),
  reviewed_by uuid REFERENCES public.users(id),
  completed_at timestamptz,
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT circle_transfers_distinct_circles CHECK (source_circle_id <> target_circle_id)
);

DROP TRIGGER IF EXISTS trg_circle_transfers_updated_at ON public.circle_transfers;
CREATE TRIGGER trg_circle_transfers_updated_at
  BEFORE UPDATE ON public.circle_transfers
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Governance term appointments (links to Phase 4 role_assignments)
CREATE TABLE IF NOT EXISTS public.circle_governance_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  circle_id uuid NOT NULL REFERENCES public.connect_circles(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_key public.gce_role_key NOT NULL,
  role_assignment_id uuid REFERENCES public.role_assignments(id),
  status text NOT NULL DEFAULT 'active',
  term_months int NOT NULL DEFAULT 6,
  starts_at timestamptz NOT NULL DEFAULT now(),
  ends_at timestamptz NOT NULL,
  appointed_by uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT circle_gov_term_six CHECK (term_months = 6),
  CONSTRAINT circle_gov_role_allowed CHECK (
    role_key IN (
      'governing_body_member',
      'circle_finance_coordinator',
      'sergeant_at_arms'
    )
  )
);

DROP TRIGGER IF EXISTS trg_circle_gov_updated_at ON public.circle_governance_appointments;
CREATE TRIGGER trg_circle_gov_updated_at
  BEFORE UPDATE ON public.circle_governance_appointments
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Legacy membership quarantine map
CREATE TABLE IF NOT EXISTS public.legacy_membership_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_plan text NOT NULL UNIQUE,
  canonical_plan_key public.membership_plan_key,
  mapping_status public.legacy_membership_map_status NOT NULL DEFAULT 'needs_review',
  grants_new_purchase boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_membership_migration_map (
  legacy_plan, canonical_plan_key, mapping_status, grants_new_purchase, notes
) VALUES
  ('basic', NULL, 'historical_only', false, 'Obsolete tier — do not map to Associate automatically'),
  ('gold', NULL, 'historical_only', false, 'Obsolete tier — historical only'),
  ('platinum', NULL, 'historical_only', false, 'Obsolete tier — historical only'),
  ('associate', 'associate', 'mapped', true, 'Canonical Associate plan'),
  ('core', 'core_future_inactive', 'mapped', false, 'Core future/inactive — not purchasable at launch')
ON CONFLICT (legacy_plan) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Dual-status + capacity helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_circle_statuses_for_count(p_count int)
RETURNS TABLE (
  lifecycle public.circle_lifecycle_status,
  constitution public.circle_constitution_status
)
LANGUAGE plpgsql
IMMUTABLE
AS $$
BEGIN
  IF p_count < 0 THEN
    RAISE EXCEPTION 'negative seat count';
  ELSIF p_count <= 14 THEN
    lifecycle := 'formation';
    constitution := 'formation_circle';
  ELSIF p_count <= 19 THEN
    lifecycle := 'active_growth';
    constitution := 'formation_circle';
  ELSIF p_count <= 39 THEN
    lifecycle := 'active_growth';
    constitution := 'provisionally_active_circle';
  ELSE
    lifecycle := 'full_capacity';
    constitution := 'fully_constituted_circle';
  END IF;
  RETURN NEXT;
END;
$$;

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

  -- Formal platform activation at 15 once (FD-032)
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
    -- One-time BDP target credit hook placeholder (Phase 6 consumes); no second credit at 20/40
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

  RETURN v_circle;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_confirm_circle_seat(
  p_seat_id uuid,
  p_actor uuid DEFAULT NULL
)
RETURNS public.connect_circle_seats
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_seat public.connect_circle_seats;
  v_count int;
BEGIN
  SELECT * INTO v_seat FROM public.connect_circle_seats WHERE id = p_seat_id FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Seat not found';
  END IF;

  SELECT count(*)::int INTO v_count
  FROM public.connect_circle_seats
  WHERE circle_id = v_seat.circle_id
    AND counts_toward_capacity = true
    AND id <> p_seat_id;

  IF v_count >= 40 THEN
    RAISE EXCEPTION 'Circle at full capacity — seat 41 blocked' USING ERRCODE = '23514';
  END IF;

  UPDATE public.connect_circle_seats SET
    status = 'allocated',
    counts_toward_capacity = true,
    allocated_at = COALESCE(allocated_at, now()),
    confirmed_at = now(),
    updated_at = now()
  WHERE id = p_seat_id
  RETURNING * INTO v_seat;

  IF v_seat.membership_id IS NOT NULL THEN
    UPDATE public.connect_memberships SET
      allocation_status = 'allocated',
      updated_at = now()
    WHERE id = v_seat.membership_id;
  END IF;

  PERFORM public.gce_refresh_circle_capacity(v_seat.circle_id, p_actor);
  RETURN v_seat;
END;
$$;

-- ---------------------------------------------------------------------------
-- Feature flags (money-safe defaults)
-- ---------------------------------------------------------------------------

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('membership_associate_purchase', false, 'Phase 5 Associate purchase — gated until payment validation'),
  ('membership_core_purchase', false, 'FD-039 Core Tier direct purchase inactive'),
  ('membership_offline_bank_payment', false, 'Rare offline bank path — Admin recorded only')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.membership_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_specialisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.kyc_verification_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_membership_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.membership_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_circles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_circle_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.connect_circle_seats ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_allocation_proposals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_transfers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.circle_governance_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_membership_migration_map ENABLE ROW LEVEL SECURITY;

-- Plans / taxonomy readable
DROP POLICY IF EXISTS membership_plans_select ON public.membership_plans;
CREATE POLICY membership_plans_select ON public.membership_plans
  FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS specialisations_select ON public.business_specialisations;
CREATE POLICY specialisations_select ON public.business_specialisations
  FOR SELECT TO authenticated USING (is_active = true OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS specialisations_admin_write ON public.business_specialisations;
CREATE POLICY specialisations_admin_write ON public.business_specialisations
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- Memberships: own or admin
DROP POLICY IF EXISTS connect_memberships_select ON public.connect_memberships;
CREATE POLICY connect_memberships_select ON public.connect_memberships
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS connect_memberships_insert_own ON public.connect_memberships;
CREATE POLICY connect_memberships_insert_own ON public.connect_memberships
  FOR INSERT TO authenticated
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS connect_memberships_update ON public.connect_memberships;
CREATE POLICY connect_memberships_update ON public.connect_memberships
  FOR UPDATE TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS membership_events_select ON public.connect_membership_events;
CREATE POLICY membership_events_select ON public.connect_membership_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS membership_tags_select ON public.membership_tags;
CREATE POLICY membership_tags_select ON public.membership_tags
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS membership_tags_admin_write ON public.membership_tags;
CREATE POLICY membership_tags_admin_write ON public.membership_tags
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- KYC highly restricted
DROP POLICY IF EXISTS kyc_select ON public.kyc_verification_cases;
CREATE POLICY kyc_select ON public.kyc_verification_cases
  FOR SELECT TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
    OR public.gce_has_active_assignment('platform_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS kyc_write ON public.kyc_verification_cases;
CREATE POLICY kyc_write ON public.kyc_verification_cases
  FOR ALL TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
    OR public.gce_has_active_assignment('platform_admin', 'platform', NULL)
  )
  WITH CHECK (
    user_id = public.gce_current_user_id()
    OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
    OR public.gce_has_active_assignment('platform_admin', 'platform', NULL)
  );

-- Circles: authenticated can read limited catalogue; writes admin
DROP POLICY IF EXISTS circles_select ON public.connect_circles;
CREATE POLICY circles_select ON public.connect_circles
  FOR SELECT TO authenticated
  USING (lifecycle_status NOT IN ('draft') OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS circles_admin_write ON public.connect_circles;
CREATE POLICY circles_admin_write ON public.connect_circles
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS circle_seats_select ON public.connect_circle_seats;
CREATE POLICY circle_seats_select ON public.connect_circle_seats
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS circle_seats_admin_write ON public.connect_circle_seats;
CREATE POLICY circle_seats_admin_write ON public.connect_circle_seats
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS waitlist_select ON public.circle_waitlist_entries;
CREATE POLICY waitlist_select ON public.circle_waitlist_entries
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS waitlist_admin_write ON public.circle_waitlist_entries;
CREATE POLICY waitlist_admin_write ON public.circle_waitlist_entries
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS allocation_admin ON public.circle_allocation_proposals;
CREATE POLICY allocation_admin ON public.circle_allocation_proposals
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS transfers_select ON public.circle_transfers;
CREATE POLICY transfers_select ON public.circle_transfers
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.connect_memberships m
      WHERE m.id = membership_id AND m.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS transfers_admin_write ON public.circle_transfers;
CREATE POLICY transfers_admin_write ON public.circle_transfers
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS gov_appointments_select ON public.circle_governance_appointments;
CREATE POLICY gov_appointments_select ON public.circle_governance_appointments
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS gov_appointments_admin ON public.circle_governance_appointments;
CREATE POLICY gov_appointments_admin ON public.circle_governance_appointments
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS legacy_membership_map_select ON public.legacy_membership_migration_map;
CREATE POLICY legacy_membership_map_select ON public.legacy_membership_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.connect_memberships IS
  'FD-022/036 Connect membership; payment≠activation; activation≠allocation';
COMMENT ON TABLE public.connect_circles IS
  'FD-032 dual status: lifecycle + constitutional; max 40 seats';
COMMENT ON FUNCTION public.gce_confirm_circle_seat(uuid, uuid) IS
  'Transaction-safe seat confirmation; blocks seat 41; refreshes dual statuses';
COMMENT ON FUNCTION public.gce_refresh_circle_capacity(uuid, uuid) IS
  'Recomputes active seat count + dual statuses; one-time 15 activation + BDP credit hook';
