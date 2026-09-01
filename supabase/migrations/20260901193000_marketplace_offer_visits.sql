-- Distinct offer visit / presence confirmation (claim ≠ visit ≠ redemption).
-- FD-037 / Phase 11 — no revenue, no rank side effects.

CREATE TABLE IF NOT EXISTS public.marketplace_offer_visits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  claim_id uuid NOT NULL REFERENCES public.marketplace_offer_claims(id) ON DELETE RESTRICT,
  offer_event_id uuid NOT NULL REFERENCES public.marketplace_offer_events(id) ON DELETE CASCADE,
  venue_id uuid NOT NULL REFERENCES public.marketplace_venues(id) ON DELETE CASCADE,
  customer_user_id uuid NOT NULL REFERENCES public.users(id),
  confirmed_by_staff_user_id uuid REFERENCES public.users(id),
  confirmation_token_hash text NOT NULL,
  status text NOT NULL DEFAULT 'confirmed',
  confirmed_at timestamptz NOT NULL DEFAULT now(),
  metadata jsonb NOT NULL DEFAULT jsonb_build_object('is_revenue', false),
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT mkt_visit_one_per_claim UNIQUE (claim_id)
);

CREATE INDEX IF NOT EXISTS idx_mkt_offer_visits_offer
  ON public.marketplace_offer_visits (offer_event_id, confirmed_at DESC);

CREATE INDEX IF NOT EXISTS idx_mkt_offer_visits_venue
  ON public.marketplace_offer_visits (venue_id, confirmed_at DESC);

CREATE OR REPLACE FUNCTION public.gce_marketplace_confirm_offer_visit(
  p_claim_id uuid,
  p_presented_token_hash text,
  p_actor uuid DEFAULT NULL
)
RETURNS public.marketplace_offer_visits
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_claim public.marketplace_offer_claims;
  v_offer public.marketplace_offer_events;
  v_visit public.marketplace_offer_visits;
BEGIN
  SELECT * INTO v_visit
  FROM public.marketplace_offer_visits
  WHERE claim_id = p_claim_id;
  IF FOUND THEN
    RETURN v_visit;
  END IF;

  SELECT * INTO v_claim
  FROM public.marketplace_offer_claims
  WHERE id = p_claim_id
  FOR UPDATE;
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Claim not found';
  END IF;
  IF v_claim.status <> 'claimed' THEN
    RAISE EXCEPTION 'Claim not visitable';
  END IF;
  IF now() > v_claim.expires_at THEN
    UPDATE public.marketplace_offer_claims
    SET status = 'expired', updated_at = now()
    WHERE id = p_claim_id;
    RAISE EXCEPTION 'Claim expired';
  END IF;
  IF v_claim.claim_token_hash IS DISTINCT FROM p_presented_token_hash THEN
    RAISE EXCEPTION 'Invalid token';
  END IF;

  SELECT * INTO v_offer
  FROM public.marketplace_offer_events
  WHERE id = v_claim.offer_event_id;

  INSERT INTO public.marketplace_offer_visits (
    claim_id,
    offer_event_id,
    venue_id,
    customer_user_id,
    confirmed_by_staff_user_id,
    confirmation_token_hash
  ) VALUES (
    p_claim_id,
    v_claim.offer_event_id,
    v_offer.venue_id,
    v_claim.claimant_user_id,
    p_actor,
    p_presented_token_hash
  )
  RETURNING * INTO v_visit;

  RETURN v_visit;
END;
$$;

ALTER TABLE public.marketplace_offer_visits ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS mkt_visits_select ON public.marketplace_offer_visits;
CREATE POLICY mkt_visits_select ON public.marketplace_offer_visits
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_marketplace_venue_rep(venue_id)
    OR customer_user_id = public.gce_current_user_id()
    OR EXISTS (
      SELECT 1 FROM public.marketplace_offer_claims c
      WHERE c.id = claim_id AND c.claimant_user_id = public.gce_current_user_id()
    )
  );
