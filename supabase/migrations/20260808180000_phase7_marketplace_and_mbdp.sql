-- Phase 7 — Marketplace & Marketplace BDP (additive)
-- Authority: FD-029/033/034/035/037/039; SM_Marketplace_*; commercial constants
-- Target: gce-dev only. Production untouched. No Enterprise (Phase 8).
-- Legacy venues/events/bookings stay as prototype surface; canonical tables are marketplace_*.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.marketplace_bdp_application_status AS ENUM (
    'draft','submitted','pending_verification','pending_payment','pending_approval',
    'active','rejected','suspended','terminated','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_bdp_package_option AS ENUM (
    'direct_50000','finance_recovery_60000'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_attribution_status AS ENUM (
    'unattributed','proposed','pending_evidence','active','disputed',
    'suspended','reassigned_closed','voided'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_venue_status AS ENUM (
    'draft','submitted','pending_mbdp_recommendation','pending_platform_approval',
    'active','temporarily_inactive','review_required','suspended','terminated','archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_event_status AS ENUM (
    'draft','submitted','under_review','changes_requested','approved',
    'published','suspended','closed','cancelled','rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_offer_status AS ENUM (
    'draft','submitted','under_review','changes_requested','approved',
    'published','suspended','closed','expired','rejected'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_booking_status AS ENUM (
    'draft','pending_payment','paid','confirmed','cancelled','refund_pending','refunded','failed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_ticket_status AS ENUM (
    'issued','cancelled','checked_in','voided','expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_claim_status AS ENUM (
    'claimed','expired','redeemed','cancelled','voided','no_purchase'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.marketplace_entitlement_state AS ENUM (
    'estimated','provisional','earned','on_hold','settlement_eligible','paid','reversed'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.legacy_marketplace_map_status AS ENUM (
    'mapped','historical_only','ambiguous','needs_review','reusable_shell'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Marketplace BDP Franchise Units (FD-033: 20 venues/unit, max 2 units, 40 std)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_bdp_units (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_assignment_id uuid REFERENCES public.role_assignments(id),
  application_status public.marketplace_bdp_application_status NOT NULL DEFAULT 'draft',
  package_option public.marketplace_bdp_package_option NOT NULL DEFAULT 'finance_recovery_60000',
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
  venues_capacity_max int NOT NULL DEFAULT 20,
  active_venue_count int NOT NULL DEFAULT 0,
  pricing_rule_version text NOT NULL DEFAULT 'fd029-fd033-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mbdp_units_venues_cap CHECK (venues_capacity_max = 20),
  CONSTRAINT mbdp_units_recovery_nonneg CHECK (
    recovered_to_date_minor >= 0
    AND remaining_recoverable_minor >= 0
    AND recovered_to_date_minor + remaining_recoverable_minor = recoverable_balance_minor
  ),
  CONSTRAINT mbdp_units_package_amounts CHECK (
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

CREATE INDEX IF NOT EXISTS idx_mbdp_units_user_status
  ON public.marketplace_bdp_units (user_id, application_status);

DROP TRIGGER IF EXISTS trg_mbdp_units_updated_at ON public.marketplace_bdp_units;
CREATE TRIGGER trg_mbdp_units_updated_at
  BEFORE UPDATE ON public.marketplace_bdp_units
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE OR REPLACE FUNCTION public.gce_mbdp_person_unit_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_count int;
BEGIN
  IF NEW.application_status = 'active' THEN
    SELECT count(*)::int INTO v_count
    FROM public.marketplace_bdp_units u
    WHERE u.user_id = NEW.user_id
      AND u.application_status = 'active'
      AND u.id IS DISTINCT FROM NEW.id;
    IF v_count >= 2 AND COALESCE((NEW.metadata->>'second_unit_approved')::boolean, false) IS NOT TRUE THEN
      RAISE EXCEPTION 'Marketplace BDP max 2 active units; second unit requires platform approval (FD-033)'
        USING ERRCODE = '23514';
    END IF;
    IF v_count >= 1 AND COALESCE((NEW.metadata->>'second_unit_approved')::boolean, false) IS NOT TRUE THEN
      RAISE EXCEPTION 'Second Marketplace BDP unit requires explicit platform approval (FD-033)'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mbdp_person_unit_cap ON public.marketplace_bdp_units;
CREATE TRIGGER trg_mbdp_person_unit_cap
  BEFORE INSERT OR UPDATE OF application_status ON public.marketplace_bdp_units
  FOR EACH ROW EXECUTE FUNCTION public.gce_mbdp_person_unit_cap();

-- ---------------------------------------------------------------------------
-- Venue Partner canonical records (org-linked; optional bridge to legacy venues)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_venues (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  legacy_venue_id uuid, -- bridge only; do not assume prototype semantics
  display_name text NOT NULL,
  legal_name text,
  city text NOT NULL,
  state text,
  address text,
  category text,
  status public.marketplace_venue_status NOT NULL DEFAULT 'draft',
  verification_status text NOT NULL DEFAULT 'not_started',
  kyc_case_id uuid REFERENCES public.kyc_verification_cases(id),
  payout_details_ref text,
  submitted_by uuid REFERENCES public.users(id),
  recommended_by_unit_id uuid REFERENCES public.marketplace_bdp_units(id),
  recommended_by_user_id uuid REFERENCES public.users(id),
  recommended_at timestamptz,
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamptz,
  rejected_by uuid REFERENCES public.users(id),
  rejection_reason text,
  inactive_reason text,
  performance_score numeric(8,2),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_venues_org_unique UNIQUE (organisation_id)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_venues_city_status
  ON public.marketplace_venues (city, status);

DROP TRIGGER IF EXISTS trg_marketplace_venues_updated_at ON public.marketplace_venues;
CREATE TRIGGER trg_marketplace_venues_updated_at
  BEFORE UPDATE ON public.marketplace_venues
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Venue ↔ MBDP attribution (venue-based; not city ownership)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_venue_attributions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id) ON DELETE CASCADE,
  unit_id uuid REFERENCES public.marketplace_bdp_units(id),
  bdp_user_id uuid REFERENCES public.users(id),
  status public.marketplace_attribution_status NOT NULL DEFAULT 'proposed',
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
  CONSTRAINT mbdp_attr_no_self_approve CHECK (
    approved_by IS NULL OR created_by IS DISTINCT FROM approved_by OR is_correction = true
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_mbdp_attr_one_active_per_venue
  ON public.marketplace_venue_attributions (venue_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_mbdp_attr_unit_status
  ON public.marketplace_venue_attributions (unit_id, status);

DROP TRIGGER IF EXISTS trg_mbdp_attr_updated_at ON public.marketplace_venue_attributions;
CREATE TRIGGER trg_mbdp_attr_updated_at
  BEFORE UPDATE ON public.marketplace_venue_attributions
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE OR REPLACE FUNCTION public.gce_mbdp_venue_unit_cap()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE
  v_count int;
  v_max int;
BEGIN
  IF NEW.status <> 'active' OR NEW.unit_id IS NULL THEN
    RETURN NEW;
  END IF;
  SELECT venues_capacity_max INTO v_max FROM public.marketplace_bdp_units WHERE id = NEW.unit_id;
  SELECT count(*)::int INTO v_count
  FROM public.marketplace_venue_attributions
  WHERE unit_id = NEW.unit_id AND status = 'active' AND id IS DISTINCT FROM NEW.id;
  IF v_count >= COALESCE(v_max, 20) THEN
    RAISE EXCEPTION 'Marketplace BDP unit Venue capacity exceeded (max 20 per unit, FD-033)'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_mbdp_venue_unit_cap ON public.marketplace_venue_attributions;
CREATE TRIGGER trg_mbdp_venue_unit_cap
  BEFORE INSERT OR UPDATE OF status ON public.marketplace_venue_attributions
  FOR EACH ROW EXECUTE FUNCTION public.gce_mbdp_venue_unit_cap();

CREATE OR REPLACE FUNCTION public.gce_mbdp_refresh_venue_counts(p_unit_id uuid)
RETURNS public.marketplace_bdp_units
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_unit public.marketplace_bdp_units; v_active int;
BEGIN
  SELECT count(*)::int INTO v_active
  FROM public.marketplace_venue_attributions
  WHERE unit_id = p_unit_id AND status = 'active';
  UPDATE public.marketplace_bdp_units SET
    active_venue_count = v_active, updated_at = now()
  WHERE id = p_unit_id RETURNING * INTO v_unit;
  RETURN v_unit;
END;
$$;

-- ---------------------------------------------------------------------------
-- Ticketed Marketplace Events
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  category text,
  starts_at timestamptz NOT NULL,
  ends_at timestamptz,
  capacity int NOT NULL DEFAULT 0,
  price_minor bigint NOT NULL DEFAULT 0,
  currency text NOT NULL DEFAULT 'INR',
  status public.marketplace_event_status NOT NULL DEFAULT 'draft',
  cancel_cutoff_hours int NOT NULL DEFAULT 48,
  cancel_policy_version text NOT NULL DEFAULT 'fd039-48h-default-v1',
  attribution_id uuid REFERENCES public.marketplace_venue_attributions(id),
  legacy_event_id uuid,
  submitted_by uuid REFERENCES public.users(id),
  recommended_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamptz,
  published_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_events_capacity_nonneg CHECK (capacity >= 0),
  CONSTRAINT marketplace_events_price_nonneg CHECK (price_minor >= 0),
  CONSTRAINT marketplace_events_cancel_hours CHECK (cancel_cutoff_hours >= 0)
);

CREATE INDEX IF NOT EXISTS idx_marketplace_events_venue_status
  ON public.marketplace_events (venue_id, status);

DROP TRIGGER IF EXISTS trg_marketplace_events_updated_at ON public.marketplace_events;
CREATE TRIGGER trg_marketplace_events_updated_at
  BEFORE UPDATE ON public.marketplace_events
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Offer Events (distinct from ticketed events)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_offer_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  planned_commercial_value_minor bigint NOT NULL,
  campaign_starts_at timestamptz NOT NULL,
  campaign_ends_at timestamptz NOT NULL,
  customer_cap int NOT NULL DEFAULT 100,
  claim_validity_hours int NOT NULL DEFAULT 72,
  status public.marketplace_offer_status NOT NULL DEFAULT 'draft',
  claims_count int NOT NULL DEFAULT 0,
  version int NOT NULL DEFAULT 1,
  attribution_id uuid REFERENCES public.marketplace_venue_attributions(id),
  submitted_by uuid REFERENCES public.users(id),
  recommended_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  approved_at timestamptz,
  published_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mkt_offer_min_planned_value CHECK (planned_commercial_value_minor >= 5000000),
  CONSTRAINT mkt_offer_customer_cap CHECK (customer_cap > 0 AND customer_cap <= 100),
  CONSTRAINT mkt_offer_claim_hours CHECK (claim_validity_hours = 72),
  CONSTRAINT mkt_offer_window CHECK (campaign_ends_at > campaign_starts_at),
  CONSTRAINT mkt_offer_max_days CHECK (
    (campaign_ends_at - campaign_starts_at) <= interval '15 days'
  )
);

CREATE INDEX IF NOT EXISTS idx_marketplace_offers_venue_status
  ON public.marketplace_offer_events (venue_id, status);

DROP TRIGGER IF EXISTS trg_marketplace_offers_updated_at ON public.marketplace_offer_events;
CREATE TRIGGER trg_marketplace_offers_updated_at
  BEFORE UPDATE ON public.marketplace_offer_events
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Bookings / tickets (replaces dirty legacy bookings as SoT)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id uuid NOT NULL REFERENCES public.marketplace_events(id) ON DELETE RESTRICT,
  buyer_user_id uuid NOT NULL REFERENCES public.users(id),
  quantity int NOT NULL DEFAULT 1,
  unit_price_minor bigint NOT NULL,
  total_minor bigint NOT NULL,
  currency text NOT NULL DEFAULT 'INR',
  status public.marketplace_booking_status NOT NULL DEFAULT 'draft',
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  cancel_policy_version text NOT NULL DEFAULT 'fd039-48h-default-v1',
  cancel_cutoff_hours int NOT NULL DEFAULT 48,
  attribution_id uuid REFERENCES public.marketplace_venue_attributions(id),
  idempotency_key text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT marketplace_bookings_qty CHECK (quantity > 0),
  CONSTRAINT marketplace_bookings_amounts CHECK (
    unit_price_minor >= 0 AND total_minor = unit_price_minor * quantity
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_marketplace_bookings_idempotency
  ON public.marketplace_bookings (idempotency_key)
  WHERE idempotency_key IS NOT NULL;

DROP TRIGGER IF EXISTS trg_marketplace_bookings_updated_at ON public.marketplace_bookings;
CREATE TRIGGER trg_marketplace_bookings_updated_at
  BEFORE UPDATE ON public.marketplace_bookings
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.marketplace_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.marketplace_bookings(id) ON DELETE CASCADE,
  event_id uuid NOT NULL REFERENCES public.marketplace_events(id) ON DELETE RESTRICT,
  holder_user_id uuid NOT NULL REFERENCES public.users(id),
  ticket_ref text NOT NULL UNIQUE,
  qr_token_hash text NOT NULL UNIQUE,
  status public.marketplace_ticket_status NOT NULL DEFAULT 'issued',
  issued_at timestamptz NOT NULL DEFAULT now(),
  checked_in_at timestamptz,
  checked_in_by uuid REFERENCES public.users(id),
  voided_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_marketplace_tickets_event_status
  ON public.marketplace_tickets (event_id, status);

DROP TRIGGER IF EXISTS trg_marketplace_tickets_updated_at ON public.marketplace_tickets;
CREATE TRIGGER trg_marketplace_tickets_updated_at
  BEFORE UPDATE ON public.marketplace_tickets
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Offer claims / redemptions / non-purchase
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_offer_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  offer_event_id uuid NOT NULL REFERENCES public.marketplace_offer_events(id) ON DELETE CASCADE,
  claimant_user_id uuid NOT NULL REFERENCES public.users(id),
  claim_token_hash text NOT NULL UNIQUE,
  status public.marketplace_claim_status NOT NULL DEFAULT 'claimed',
  claimed_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  redeemed_at timestamptz,
  non_purchase_reason text,
  non_purchase_notes text,
  venue_response text,
  penalty_exempt boolean NOT NULL DEFAULT false,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mkt_claim_expiry CHECK (expires_at > claimed_at)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_mkt_active_claim_per_user_offer
  ON public.marketplace_offer_claims (offer_event_id, claimant_user_id)
  WHERE status IN ('claimed', 'redeemed', 'no_purchase');

DROP TRIGGER IF EXISTS trg_marketplace_claims_updated_at ON public.marketplace_offer_claims;
CREATE TRIGGER trg_marketplace_claims_updated_at
  BEFORE UPDATE ON public.marketplace_offer_claims
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.marketplace_redemptions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.marketplace_offer_claims(id) ON DELETE RESTRICT,
  offer_event_id uuid NOT NULL REFERENCES public.marketplace_offer_events(id),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id),
  redeemed_by_staff_user_id uuid REFERENCES public.users(id),
  redemption_token_hash text NOT NULL UNIQUE,
  sale_confirmed boolean NOT NULL DEFAULT false,
  sale_reference text,
  status text NOT NULL DEFAULT 'completed',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mkt_redemption_one_claim UNIQUE (claim_id)
);

-- ---------------------------------------------------------------------------
-- Revenue entitlement split records (boundary; not full Phase 9 settlement)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_revenue_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  earning_event_key text NOT NULL,
  source_type text NOT NULL, -- booking | offer_conversion | other
  source_id uuid,
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id),
  attribution_id uuid REFERENCES public.marketplace_venue_attributions(id),
  unit_id uuid REFERENCES public.marketplace_bdp_units(id),
  eligible_revenue_minor bigint NOT NULL DEFAULT 0,
  venue_share_minor bigint NOT NULL DEFAULT 0,
  mbdp_share_minor bigint NOT NULL DEFAULT 0,
  gce_share_minor bigint NOT NULL DEFAULT 0,
  mbdp_commission_bps int NOT NULL DEFAULT 0,
  has_valid_attribution boolean NOT NULL DEFAULT false,
  state public.marketplace_entitlement_state NOT NULL DEFAULT 'estimated',
  rule_version text NOT NULL DEFAULT 'fd029-fd037-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mkt_ent_unique_event UNIQUE (earning_event_key),
  CONSTRAINT mkt_ent_nonneg CHECK (
    eligible_revenue_minor >= 0
    AND venue_share_minor >= 0
    AND mbdp_share_minor >= 0
    AND gce_share_minor >= 0
  ),
  CONSTRAINT mkt_ent_split_sum CHECK (
    venue_share_minor + mbdp_share_minor + gce_share_minor = eligible_revenue_minor
  )
);

DROP TRIGGER IF EXISTS trg_mkt_ent_updated_at ON public.marketplace_revenue_entitlements;
CREATE TRIGGER trg_mkt_ent_updated_at
  BEFORE UPDATE ON public.marketplace_revenue_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.marketplace_bdp_recovery_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id uuid NOT NULL REFERENCES public.marketplace_bdp_units(id) ON DELETE CASCADE,
  entitlement_id uuid REFERENCES public.marketplace_revenue_entitlements(id),
  cycle_key text NOT NULL,
  recovered_minor bigint NOT NULL,
  remaining_after_minor bigint NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mbdp_recovery_positive CHECK (recovered_minor > 0),
  CONSTRAINT mbdp_recovery_cycle_cap CHECK (recovered_minor <= 500000),
  CONSTRAINT mbdp_recovery_unique_cycle UNIQUE (unit_id, cycle_key, entitlement_id)
);

-- ---------------------------------------------------------------------------
-- Handover / reassignment + rank event foundations
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.marketplace_venue_handovers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id),
  source_unit_id uuid REFERENCES public.marketplace_bdp_units(id),
  target_unit_id uuid REFERENCES public.marketplace_bdp_units(id),
  status text NOT NULL DEFAULT 'requested',
  effective_from timestamptz,
  notes text,
  requested_by uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  completed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_mkt_handovers_updated_at ON public.marketplace_venue_handovers;
CREATE TRIGGER trg_mkt_handovers_updated_at
  BEFORE UPDATE ON public.marketplace_venue_handovers
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.customer_trust_rank_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  event_type text NOT NULL,
  delta int NOT NULL,
  resulting_score int,
  rule_version text NOT NULL DEFAULT 'phase7-foundation-v1',
  source_type text,
  source_id uuid,
  actor_user_id uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_rank_score_bounds CHECK (
    resulting_score IS NULL OR (resulting_score >= 0 AND resulting_score <= 100)
  )
);

CREATE TABLE IF NOT EXISTS public.venue_performance_rank_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id),
  event_type text NOT NULL,
  delta numeric(10,2) NOT NULL DEFAULT 0,
  resulting_score numeric(10,2),
  rule_version text NOT NULL DEFAULT 'phase7-foundation-v1',
  source_type text,
  source_id uuid,
  actor_user_id uuid REFERENCES public.users(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.legacy_marketplace_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_object text NOT NULL UNIQUE,
  mapping_status public.legacy_marketplace_map_status NOT NULL DEFAULT 'needs_review',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_marketplace_migration_map (legacy_object, mapping_status, notes) VALUES
  ('venues', 'reusable_shell', 'Display/place shell; Phase 7 marketplace_venues is canonical'),
  ('events', 'reusable_shell', 'Discovery shell; ticketed/offer families are marketplace_*'),
  ('bookings', 'historical_only', 'Schema drift; replaced by marketplace_bookings'),
  ('offers', 'historical_only', 'Coupon catalog; not FD-037 Offer Event'),
  ('offer_claims', 'historical_only', 'Prototype; replaced by marketplace_offer_claims'),
  ('zbp_partners', 'historical_only', 'Inactive; not Marketplace BDP'),
  ('marketplace_affiliates', 'historical_only', 'Affiliate commercial inactive'),
  ('mbdp', 'mapped', 'Legacy abbreviation maps to marketplace_bdp role with explicit assignment')
ON CONFLICT (legacy_object) DO NOTHING;

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('marketplace_bdp_pack_payments', false, 'Money gate — Marketplace BDP pack production collection'),
  ('marketplace_offer_campaigns', true, 'Offer Event campaigns (non-money)'),
  ('marketplace_rank_events', true, 'Customer/Venue rank event foundation')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Split + recovery helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_marketplace_split(
  p_eligible_minor bigint,
  p_has_attribution boolean
)
RETURNS TABLE (
  venue_share_minor bigint,
  mbdp_share_minor bigint,
  gce_share_minor bigint,
  mbdp_commission_bps int
)
LANGUAGE plpgsql IMMUTABLE AS $$
BEGIN
  IF p_eligible_minor < 0 THEN
    RAISE EXCEPTION 'Eligible revenue cannot be negative';
  END IF;
  IF p_has_attribution THEN
    -- Attributed 80/10/10 (FD-029/037)
    RETURN QUERY SELECT
      (p_eligible_minor * 80 / 100)::bigint,
      (p_eligible_minor * 10 / 100)::bigint,
      (p_eligible_minor - (p_eligible_minor * 80 / 100) - (p_eligible_minor * 10 / 100))::bigint,
      1000;
  ELSE
    -- Unattributed 80/0/20 — missing 10% is NOT pending MBDP (FD-037)
    RETURN QUERY SELECT
      (p_eligible_minor * 80 / 100)::bigint,
      0::bigint,
      (p_eligible_minor - (p_eligible_minor * 80 / 100))::bigint,
      0;
  END IF;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_mbdp_apply_recovery(
  p_unit_id uuid,
  p_entitlement_id uuid,
  p_cycle_key text,
  p_actor uuid DEFAULT NULL
)
RETURNS public.marketplace_bdp_recovery_entries
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_unit public.marketplace_bdp_units;
  v_ent public.marketplace_revenue_entitlements;
  v_amount bigint;
  v_entry public.marketplace_bdp_recovery_entries;
BEGIN
  SELECT * INTO v_unit FROM public.marketplace_bdp_units WHERE id = p_unit_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Unit not found'; END IF;
  SELECT * INTO v_ent FROM public.marketplace_revenue_entitlements WHERE id = p_entitlement_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Entitlement not found'; END IF;
  IF v_ent.unit_id IS DISTINCT FROM p_unit_id THEN RAISE EXCEPTION 'Entitlement/unit mismatch'; END IF;
  IF v_ent.state NOT IN ('earned', 'settlement_eligible') THEN
    RAISE EXCEPTION 'Recovery only from earned/settlement-eligible MBDP commission';
  END IF;
  IF NOT v_ent.has_valid_attribution OR v_ent.mbdp_share_minor <= 0 THEN
    RAISE EXCEPTION 'No MBDP commission available for recovery';
  END IF;
  IF v_unit.remaining_recoverable_minor <= 0 THEN
    RAISE EXCEPTION 'No remaining recoverable balance';
  END IF;

  v_amount := LEAST(500000, v_unit.remaining_recoverable_minor, v_ent.mbdp_share_minor);
  IF v_amount <= 0 THEN RAISE EXCEPTION 'No recoverable amount'; END IF;

  UPDATE public.marketplace_bdp_units SET
    recovered_to_date_minor = recovered_to_date_minor + v_amount,
    remaining_recoverable_minor = remaining_recoverable_minor - v_amount,
    updated_at = now()
  WHERE id = p_unit_id RETURNING * INTO v_unit;

  IF v_unit.remaining_recoverable_minor < 0
     OR v_unit.recovered_to_date_minor > v_unit.recoverable_balance_minor THEN
    RAISE EXCEPTION 'Recovery balance invariant violated';
  END IF;

  INSERT INTO public.marketplace_bdp_recovery_entries (
    unit_id, entitlement_id, cycle_key, recovered_minor, remaining_after_minor, actor_user_id, reason
  ) VALUES (
    p_unit_id, p_entitlement_id, p_cycle_key, v_amount, v_unit.remaining_recoverable_minor, p_actor,
    'Package recovery from eligible Marketplace BDP commission (FD-029)'
  ) RETURNING * INTO v_entry;

  RETURN v_entry;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_marketplace_ticket_check_in(
  p_ticket_id uuid,
  p_presented_token_hash text,
  p_actor uuid DEFAULT NULL
)
RETURNS public.marketplace_tickets
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE v_ticket public.marketplace_tickets;
BEGIN
  SELECT * INTO v_ticket FROM public.marketplace_tickets WHERE id = p_ticket_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Ticket not found'; END IF;
  IF v_ticket.qr_token_hash IS DISTINCT FROM p_presented_token_hash THEN
    RAISE EXCEPTION 'QR token mismatch';
  END IF;
  IF v_ticket.status = 'checked_in' THEN
    RAISE EXCEPTION 'Ticket already checked in (replay blocked)';
  END IF;
  IF v_ticket.status <> 'issued' THEN
    RAISE EXCEPTION 'Ticket not eligible for check-in';
  END IF;
  UPDATE public.marketplace_tickets SET
    status = 'checked_in',
    checked_in_at = now(),
    checked_in_by = p_actor,
    updated_at = now()
  WHERE id = p_ticket_id
  RETURNING * INTO v_ticket;
  RETURN v_ticket;
END;
$$;

CREATE OR REPLACE FUNCTION public.gce_marketplace_redeem_claim(
  p_claim_id uuid,
  p_redemption_token_hash text,
  p_actor uuid DEFAULT NULL,
  p_sale_confirmed boolean DEFAULT false,
  p_sale_reference text DEFAULT NULL
)
RETURNS public.marketplace_redemptions
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_claim public.marketplace_offer_claims;
  v_offer public.marketplace_offer_events;
  v_red public.marketplace_redemptions;
BEGIN
  SELECT * INTO v_claim FROM public.marketplace_offer_claims WHERE id = p_claim_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Claim not found'; END IF;
  IF v_claim.status <> 'claimed' THEN RAISE EXCEPTION 'Claim not redeemable'; END IF;
  IF now() > v_claim.expires_at THEN
    UPDATE public.marketplace_offer_claims SET status = 'expired', updated_at = now() WHERE id = p_claim_id;
    RAISE EXCEPTION 'Claim expired';
  END IF;
  SELECT * INTO v_offer FROM public.marketplace_offer_events WHERE id = v_claim.offer_event_id;
  INSERT INTO public.marketplace_redemptions (
    claim_id, offer_event_id, venue_id, redeemed_by_staff_user_id,
    redemption_token_hash, sale_confirmed, sale_reference
  ) VALUES (
    p_claim_id, v_claim.offer_event_id, v_offer.venue_id, p_actor,
    p_redemption_token_hash, COALESCE(p_sale_confirmed, false), p_sale_reference
  ) RETURNING * INTO v_red;
  UPDATE public.marketplace_offer_claims SET
    status = 'redeemed', redeemed_at = now(), updated_at = now()
  WHERE id = p_claim_id;
  RETURN v_red;
END;
$$;

-- ---------------------------------------------------------------------------
-- Legacy RLS hardening for Marketplace-adjacent prototype tables
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  IF to_regclass('public.venues') IS NOT NULL THEN
    ALTER TABLE public.venues ENABLE ROW LEVEL SECURITY;
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

DO $$ BEGIN
  IF to_regclass('public.events') IS NOT NULL THEN
    DROP POLICY IF EXISTS allow_all_delete ON public.events;
  END IF;
EXCEPTION WHEN others THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- RLS — Phase 7 canonical tables
-- ---------------------------------------------------------------------------

ALTER TABLE public.marketplace_bdp_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_venue_attributions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_offer_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_offer_claims ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_redemptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_revenue_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_bdp_recovery_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_venue_handovers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_trust_rank_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_performance_rank_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_marketplace_migration_map ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.gce_is_mbdp_unit_owner(p_unit_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.marketplace_bdp_units u
    WHERE u.id = p_unit_id AND u.user_id = public.gce_current_user_id()
  );
$$;

CREATE OR REPLACE FUNCTION public.gce_is_marketplace_venue_rep(p_venue_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.marketplace_venues v
    JOIN public.organisation_memberships om ON om.organisation_id = v.organisation_id
    WHERE v.id = p_venue_id
      AND om.user_id = public.gce_current_user_id()
      AND om.status = 'active'
  ) OR public.gce_has_active_assignment('venue_representative', 'organisation',
      (SELECT organisation_id FROM public.marketplace_venues WHERE id = p_venue_id));
$$;

-- Units
DROP POLICY IF EXISTS mbdp_units_select ON public.marketplace_bdp_units;
CREATE POLICY mbdp_units_select ON public.marketplace_bdp_units
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS mbdp_units_insert_own ON public.marketplace_bdp_units;
CREATE POLICY mbdp_units_insert_own ON public.marketplace_bdp_units
  FOR INSERT TO authenticated
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS mbdp_units_update ON public.marketplace_bdp_units;
CREATE POLICY mbdp_units_update ON public.marketplace_bdp_units
  FOR UPDATE TO authenticated
  USING (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id())
  WITH CHECK (public.gce_is_platform_admin() OR user_id = public.gce_current_user_id());

-- Venues
DROP POLICY IF EXISTS mkt_venues_select ON public.marketplace_venues;
CREATE POLICY mkt_venues_select ON public.marketplace_venues
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(id)
    OR EXISTS (
      SELECT 1 FROM public.marketplace_venue_attributions a
      WHERE a.venue_id = id AND a.status = 'active'
        AND a.bdp_user_id = public.gce_current_user_id()
    )
    OR status IN ('active', 'temporarily_inactive')
  );

DROP POLICY IF EXISTS mkt_venues_write ON public.marketplace_venues;
CREATE POLICY mkt_venues_write ON public.marketplace_venues
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(id)
    OR submitted_by = public.gce_current_user_id()
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(id)
    OR submitted_by = public.gce_current_user_id()
  );

-- Attributions
DROP POLICY IF EXISTS mkt_attr_select ON public.marketplace_venue_attributions;
CREATE POLICY mkt_attr_select ON public.marketplace_venue_attributions
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR bdp_user_id = public.gce_current_user_id()
    OR public.gce_is_marketplace_venue_rep(venue_id)
  );

DROP POLICY IF EXISTS mkt_attr_admin_write ON public.marketplace_venue_attributions;
CREATE POLICY mkt_attr_admin_write ON public.marketplace_venue_attributions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS mkt_attr_propose ON public.marketplace_venue_attributions;
CREATE POLICY mkt_attr_propose ON public.marketplace_venue_attributions
  FOR INSERT TO authenticated
  WITH CHECK (
    status = 'proposed'
    AND bdp_user_id = public.gce_current_user_id()
    AND created_by = public.gce_current_user_id()
    AND public.gce_is_mbdp_unit_owner(unit_id)
  );

-- Events / offers
DROP POLICY IF EXISTS mkt_events_select ON public.marketplace_events;
CREATE POLICY mkt_events_select ON public.marketplace_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(venue_id)
    OR status IN ('published', 'closed')
    OR EXISTS (
      SELECT 1 FROM public.marketplace_venue_attributions a
      WHERE a.venue_id = marketplace_events.venue_id AND a.status = 'active'
        AND a.bdp_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS mkt_events_write ON public.marketplace_events;
CREATE POLICY mkt_events_write ON public.marketplace_events
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_marketplace_venue_rep(venue_id))
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_marketplace_venue_rep(venue_id));

DROP POLICY IF EXISTS mkt_offers_select ON public.marketplace_offer_events;
CREATE POLICY mkt_offers_select ON public.marketplace_offer_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(venue_id)
    OR status IN ('published', 'closed', 'expired')
    OR EXISTS (
      SELECT 1 FROM public.marketplace_venue_attributions a
      WHERE a.venue_id = marketplace_offer_events.venue_id AND a.status = 'active'
        AND a.bdp_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS mkt_offers_write ON public.marketplace_offer_events;
CREATE POLICY mkt_offers_write ON public.marketplace_offer_events
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin() OR public.gce_is_marketplace_venue_rep(venue_id))
  WITH CHECK (public.gce_is_platform_admin() OR public.gce_is_marketplace_venue_rep(venue_id));

-- Bookings / tickets / claims
DROP POLICY IF EXISTS mkt_bookings_select ON public.marketplace_bookings;
CREATE POLICY mkt_bookings_select ON public.marketplace_bookings
  FOR SELECT TO authenticated
  USING (
    buyer_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.marketplace_events e
      WHERE e.id = event_id AND public.gce_is_marketplace_venue_rep(e.venue_id)
    )
  );

DROP POLICY IF EXISTS mkt_bookings_insert ON public.marketplace_bookings;
CREATE POLICY mkt_bookings_insert ON public.marketplace_bookings
  FOR INSERT TO authenticated
  WITH CHECK (buyer_user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS mkt_tickets_select ON public.marketplace_tickets;
CREATE POLICY mkt_tickets_select ON public.marketplace_tickets
  FOR SELECT TO authenticated
  USING (
    holder_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.marketplace_events e
      WHERE e.id = event_id AND public.gce_is_marketplace_venue_rep(e.venue_id)
    )
  );

DROP POLICY IF EXISTS mkt_claims_select ON public.marketplace_offer_claims;
CREATE POLICY mkt_claims_select ON public.marketplace_offer_claims
  FOR SELECT TO authenticated
  USING (
    claimant_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.marketplace_offer_events o
      WHERE o.id = offer_event_id AND public.gce_is_marketplace_venue_rep(o.venue_id)
    )
  );

DROP POLICY IF EXISTS mkt_claims_insert ON public.marketplace_offer_claims;
CREATE POLICY mkt_claims_insert ON public.marketplace_offer_claims
  FOR INSERT TO authenticated
  WITH CHECK (claimant_user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS mkt_redemptions_select ON public.marketplace_redemptions;
CREATE POLICY mkt_redemptions_select ON public.marketplace_redemptions
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(venue_id)
    OR EXISTS (
      SELECT 1 FROM public.marketplace_offer_claims c
      WHERE c.id = claim_id AND c.claimant_user_id = public.gce_current_user_id()
    )
  );

-- Entitlements / recovery / handovers / ranks
DROP POLICY IF EXISTS mkt_ent_select ON public.marketplace_revenue_entitlements;
CREATE POLICY mkt_ent_select ON public.marketplace_revenue_entitlements
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
    OR public.gce_is_marketplace_venue_rep(venue_id)
    OR (unit_id IS NOT NULL AND public.gce_is_mbdp_unit_owner(unit_id))
  );

DROP POLICY IF EXISTS mkt_ent_finance_write ON public.marketplace_revenue_entitlements;
CREATE POLICY mkt_ent_finance_write ON public.marketplace_revenue_entitlements
  FOR ALL TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  )
  WITH CHECK (
    public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS mkt_recovery_select ON public.marketplace_bdp_recovery_entries;
CREATE POLICY mkt_recovery_select ON public.marketplace_bdp_recovery_entries
  FOR SELECT TO authenticated
  USING (
    public.gce_is_mbdp_unit_owner(unit_id)
    OR public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
  );

DROP POLICY IF EXISTS mkt_handover_admin ON public.marketplace_venue_handovers;
CREATE POLICY mkt_handover_admin ON public.marketplace_venue_handovers
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS customer_rank_select ON public.customer_trust_rank_events;
CREATE POLICY customer_rank_select ON public.customer_trust_rank_events
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS venue_rank_select ON public.venue_performance_rank_events;
CREATE POLICY venue_rank_select ON public.venue_performance_rank_events
  FOR SELECT TO authenticated
  USING (public.gce_is_marketplace_venue_rep(venue_id) OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS legacy_mkt_map_select ON public.legacy_marketplace_migration_map;
CREATE POLICY legacy_mkt_map_select ON public.legacy_marketplace_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.marketplace_bdp_units IS
  'FD-033 Marketplace BDP Franchise Unit; 20 venues/unit; max 2 units; venue-attribution based';
COMMENT ON TABLE public.marketplace_revenue_entitlements IS
  'FD-029/037 split boundary: attributed 80/10/10 or unattributed 80/0/20; claim≠revenue';
COMMENT ON FUNCTION public.gce_marketplace_split(bigint, boolean) IS
  'Attributed 80/10/10; unattributed 80/0/20 with zero MBDP (not pending)';
