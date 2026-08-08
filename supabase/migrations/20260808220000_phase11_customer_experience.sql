-- Phase 11 — Events, Offers, Booking & Customer Experience (additive CX layer)
-- Authority: FD-033/037/039; SM_Marketplace_*; Phase 7/9 reuse
-- Target: gce-dev only. Production untouched.
-- Does NOT duplicate marketplace_events/bookings/tickets/claims.
-- Money flags: marketplace_ticket_payments / settlement / payout remain OFF.

-- ---------------------------------------------------------------------------
-- Search / discovery indexes on Phase 7 canonical tables
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_mkt_events_published_starts
  ON public.marketplace_events (status, starts_at)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_mkt_events_category
  ON public.marketplace_events (category)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_mkt_events_title_trgm
  ON public.marketplace_events USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_mkt_offers_published_window
  ON public.marketplace_offer_events (status, campaign_starts_at, campaign_ends_at)
  WHERE status = 'published';

CREATE INDEX IF NOT EXISTS idx_mkt_offers_title_trgm
  ON public.marketplace_offer_events USING gin (title gin_trgm_ops);

-- ---------------------------------------------------------------------------
-- Capacity-safe booking reservation (concurrency)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_marketplace_create_booking(
  p_event_id uuid,
  p_buyer uuid,
  p_quantity int,
  p_idempotency_key text DEFAULT NULL
)
RETURNS public.marketplace_bookings
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_event public.marketplace_events;
  v_sold int;
  v_booking public.marketplace_bookings;
BEGIN
  IF p_quantity IS NULL OR p_quantity < 1 THEN
    RAISE EXCEPTION 'Quantity must be ≥ 1' USING ERRCODE = '23514';
  END IF;

  IF p_idempotency_key IS NOT NULL THEN
    SELECT * INTO v_booking FROM public.marketplace_bookings
    WHERE idempotency_key = p_idempotency_key LIMIT 1;
    IF FOUND THEN RETURN v_booking; END IF;
  END IF;

  SELECT * INTO v_event FROM public.marketplace_events
  WHERE id = p_event_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Event not found'; END IF;
  IF v_event.status <> 'published' THEN
    RAISE EXCEPTION 'Event is not published' USING ERRCODE = '23514';
  END IF;

  SELECT COALESCE(SUM(quantity), 0) INTO v_sold
  FROM public.marketplace_bookings
  WHERE event_id = p_event_id
    AND status IN ('pending_payment', 'paid', 'confirmed', 'refund_pending');

  IF v_event.capacity > 0 AND (v_sold + p_quantity) > v_event.capacity THEN
    RAISE EXCEPTION 'Event sold out or insufficient capacity' USING ERRCODE = '23514';
  END IF;

  INSERT INTO public.marketplace_bookings (
    event_id, buyer_user_id, quantity,
    unit_price_minor, total_minor, currency, status,
    cancel_cutoff_hours, cancel_policy_version, attribution_id, idempotency_key
  ) VALUES (
    p_event_id, p_buyer, p_quantity,
    v_event.price_minor, v_event.price_minor * p_quantity, v_event.currency,
    'pending_payment',
    v_event.cancel_cutoff_hours, v_event.cancel_policy_version,
    v_event.attribution_id, p_idempotency_key
  ) RETURNING * INTO v_booking;

  RETURN v_booking;
END;
$$;

-- Atomic claim with cap + single active claim (reuse Phase 7 table)
CREATE OR REPLACE FUNCTION public.gce_marketplace_claim_offer(
  p_offer_id uuid,
  p_claimant uuid,
  p_token_hash text,
  p_expires_at timestamptz
)
RETURNS public.marketplace_offer_claims
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_offer public.marketplace_offer_events;
  v_claim public.marketplace_offer_claims;
BEGIN
  SELECT * INTO v_offer FROM public.marketplace_offer_events
  WHERE id = p_offer_id FOR UPDATE;
  IF NOT FOUND THEN RAISE EXCEPTION 'Offer not found'; END IF;
  IF v_offer.status <> 'published' THEN
    RAISE EXCEPTION 'Offer is not published' USING ERRCODE = '23514';
  END IF;
  IF now() < v_offer.campaign_starts_at OR now() > v_offer.campaign_ends_at THEN
    RAISE EXCEPTION 'Offer campaign not active' USING ERRCODE = '23514';
  END IF;
  IF v_offer.claims_count >= v_offer.customer_cap THEN
    RAISE EXCEPTION 'Offer customer cap reached' USING ERRCODE = '23514';
  END IF;

  IF EXISTS (
    SELECT 1 FROM public.marketplace_offer_claims
    WHERE offer_event_id = p_offer_id
      AND claimant_user_id = p_claimant
      AND status = 'claimed'
  ) THEN
    RAISE EXCEPTION 'Active claim already exists' USING ERRCODE = '23505';
  END IF;

  INSERT INTO public.marketplace_offer_claims (
    offer_event_id, claimant_user_id, claim_token_hash, status,
    claimed_at, expires_at, metadata
  ) VALUES (
    p_offer_id, p_claimant, p_token_hash, 'claimed',
    now(), p_expires_at, jsonb_build_object('is_revenue', false)
  ) RETURNING * INTO v_claim;

  UPDATE public.marketplace_offer_events SET
    claims_count = claims_count + 1,
    updated_at = now()
  WHERE id = p_offer_id;

  RETURN v_claim;
END;
$$;

-- ---------------------------------------------------------------------------
-- Customer CX additive tables
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.customer_cx_preferences (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  preferred_city text,
  preferred_categories text[] NOT NULL DEFAULT '{}',
  location_label text,
  notification_opt_in_placeholder boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_customer_cx_prefs_updated_at ON public.customer_cx_preferences;
CREATE TRIGGER trg_customer_cx_prefs_updated_at
  BEFORE UPDATE ON public.customer_cx_preferences
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.customer_refund_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES public.marketplace_bookings(id) ON DELETE CASCADE,
  requester_user_id uuid NOT NULL REFERENCES public.users(id),
  reason text NOT NULL,
  status text NOT NULL DEFAULT 'requested', -- requested|under_review|approved|rejected|withdrawn
  policy_version text NOT NULL,
  cutoff_hours int NOT NULL,
  eligible_under_cutoff boolean NOT NULL,
  requested_amount_minor bigint, -- NULL when OD-006 unresolved
  amount_determination text NOT NULL DEFAULT 'manual_review_required',
  finance_reversal_ref uuid,
  review_notes text,
  reviewed_by uuid REFERENCES public.users(id),
  reviewed_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_refund_no_invented_pct CHECK (
    amount_determination IN (
      'manual_review_required',
      'policy_pending',
      'full_under_cutoff_pending_validation',
      'denied_after_cutoff'
    )
  )
);

DROP TRIGGER IF EXISTS trg_customer_refund_requests_updated_at ON public.customer_refund_requests;
CREATE TRIGGER trg_customer_refund_requests_updated_at
  BEFORE UPDATE ON public.customer_refund_requests
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_refund_open_per_booking
  ON public.customer_refund_requests (booking_id)
  WHERE status IN ('requested', 'under_review');

CREATE TABLE IF NOT EXISTS public.customer_feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  subject_type text NOT NULL, -- marketplace_event|marketplace_offer_event|venue
  subject_id uuid NOT NULL,
  booking_id uuid REFERENCES public.marketplace_bookings(id),
  claim_id uuid REFERENCES public.marketplace_offer_claims(id),
  rating smallint CHECK (rating IS NULL OR (rating BETWEEN 1 AND 5)),
  dimensions jsonb NOT NULL DEFAULT '{}'::jsonb,
  free_text text,
  moderation_status text NOT NULL DEFAULT 'pending',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_feedback_once
  ON public.customer_feedback (user_id, subject_type, subject_id);

CREATE TABLE IF NOT EXISTS public.customer_non_purchase_reasons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  context_type text NOT NULL, -- offer_visit|booking_abandon|event_browse
  context_id uuid,
  offer_event_id uuid REFERENCES public.marketplace_offer_events(id),
  event_id uuid REFERENCES public.marketplace_events(id),
  reason_code text NOT NULL,
  note text,
  penalty_exempt boolean NOT NULL DEFAULT true,
  review_status text NOT NULL DEFAULT 'recorded',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT customer_npr_reason_known CHECK (
    reason_code IN (
      'out_of_stock',
      'price_too_high',
      'quality_issue',
      'changed_mind',
      'timing',
      'other'
    )
  )
);

CREATE TABLE IF NOT EXISTS public.customer_domain_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  event_type text NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  subject_type text,
  subject_id uuid,
  payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_customer_domain_events_type
  ON public.customer_domain_events (event_type, created_at DESC);

-- Rank aggregates (display foundation — formula Unresolved / OD)
CREATE TABLE IF NOT EXISTS public.customer_trust_rank_snapshots (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 50 CHECK (score BETWEEN 0 AND 100),
  level_label text NOT NULL DEFAULT 'unresolved', -- do NOT invent Starter/Elite mapping as Founder law
  event_count int NOT NULL DEFAULT 0,
  formula_status text NOT NULL DEFAULT 'unresolved',
  rule_version text NOT NULL DEFAULT 'phase11-display-foundation-v1',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.venue_performance_rank_snapshots (
  venue_id uuid PRIMARY KEY REFERENCES public.marketplace_venues(id) ON DELETE CASCADE,
  score numeric(10,2) NOT NULL DEFAULT 0,
  public_display_allowed boolean NOT NULL DEFAULT false,
  event_count int NOT NULL DEFAULT 0,
  formula_status text NOT NULL DEFAULT 'unresolved',
  rule_version text NOT NULL DEFAULT 'phase11-display-foundation-v1',
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Prevent duplicate rank postings for same source
CREATE UNIQUE INDEX IF NOT EXISTS uq_customer_rank_source
  ON public.customer_trust_rank_events (user_id, event_type, source_id)
  WHERE source_id IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS uq_venue_rank_source
  ON public.venue_performance_rank_events (venue_id, event_type, source_id)
  WHERE source_id IS NOT NULL;

CREATE TABLE IF NOT EXISTS public.customer_support_signals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id),
  booking_id uuid REFERENCES public.marketplace_bookings(id),
  claim_id uuid REFERENCES public.marketplace_offer_claims(id),
  event_id uuid REFERENCES public.marketplace_events(id),
  message text NOT NULL,
  status text NOT NULL DEFAULT 'queued_for_phase13',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Feature flags (customer CX on; money stays OFF)
INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('customer_booking', true, 'Phase 11 customer booking CX (money capture still gated)'),
  ('offer_claims', true, 'Phase 11 Offer claim CX'),
  ('customer_rank_display', true, 'Display Trust Rank foundation (formula unresolved)'),
  ('venue_rank_display', false, 'Public Venue Performance Rank display gated until weights approved'),
  ('refund_processing', false, 'Automated refund processing OFF until OD-006 resolved')
ON CONFLICT (key) DO UPDATE SET
  enabled = CASE
    WHEN feature_flags.key IN ('refund_processing') THEN false
    ELSE EXCLUDED.enabled
  END;

UPDATE public.feature_flags SET enabled = false
WHERE key IN (
  'marketplace_ticket_payments',
  'settlement_execution',
  'payout_execution',
  'refund_processing'
);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.customer_cx_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_refund_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_non_purchase_reasons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_domain_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_trust_rank_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.venue_performance_rank_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customer_support_signals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS cx_prefs_own ON public.customer_cx_preferences;
CREATE POLICY cx_prefs_own ON public.customer_cx_preferences
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS cx_refund_select ON public.customer_refund_requests;
CREATE POLICY cx_refund_select ON public.customer_refund_requests
  FOR SELECT TO authenticated
  USING (
    requester_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('finance_admin', NULL, NULL)
  );

DROP POLICY IF EXISTS cx_refund_insert ON public.customer_refund_requests;
CREATE POLICY cx_refund_insert ON public.customer_refund_requests
  FOR INSERT TO authenticated
  WITH CHECK (requester_user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS cx_feedback_own ON public.customer_feedback;
CREATE POLICY cx_feedback_own ON public.customer_feedback
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS cx_npr_own ON public.customer_non_purchase_reasons;
CREATE POLICY cx_npr_own ON public.customer_non_purchase_reasons
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS cx_events_select ON public.customer_domain_events;
CREATE POLICY cx_events_select ON public.customer_domain_events
  FOR SELECT TO authenticated
  USING (
    actor_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
  );

DROP POLICY IF EXISTS cx_trust_snap_select ON public.customer_trust_rank_snapshots;
CREATE POLICY cx_trust_snap_select ON public.customer_trust_rank_snapshots
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS cx_venue_rank_select ON public.venue_performance_rank_snapshots;
CREATE POLICY cx_venue_rank_select ON public.venue_performance_rank_snapshots
  FOR SELECT TO authenticated
  USING (
    public_display_allowed = true
    OR public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(venue_id)
  );

DROP POLICY IF EXISTS cx_support_own ON public.customer_support_signals;
CREATE POLICY cx_support_own ON public.customer_support_signals
  FOR ALL TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR public.gce_has_active_assignment('support_admin', NULL, NULL)
  )
  WITH CHECK (user_id = public.gce_current_user_id());

COMMENT ON TABLE public.customer_refund_requests IS
  'OD-006: refund economics unresolved — amount_determination defaults to manual_review_required';
COMMENT ON TABLE public.customer_trust_rank_snapshots IS
  'Display foundation only; level_label stays unresolved until Founder formula approval';
COMMENT ON FUNCTION public.gce_marketplace_create_booking IS
  'Concurrency-safe booking with capacity lock; reuses marketplace_bookings';
