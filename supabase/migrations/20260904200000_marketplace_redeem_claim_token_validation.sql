-- Redemption must verify the customer claim credential (same hash as visit).
-- Mirrors gce_marketplace_confirm_offer_visit / gce_marketplace_ticket_check_in.
-- claim ≠ purchase ≠ revenue; token validation is server-authoritative.

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
  IF v_claim.claim_token_hash IS DISTINCT FROM p_redemption_token_hash THEN
    RAISE EXCEPTION 'Invalid token';
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

-- Defense in depth: reject check-in when parent booking is no longer valid.
CREATE OR REPLACE FUNCTION public.gce_marketplace_ticket_check_in(
  p_ticket_id uuid,
  p_presented_token_hash text,
  p_actor uuid DEFAULT NULL
)
RETURNS public.marketplace_tickets
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_ticket public.marketplace_tickets;
  v_booking public.marketplace_bookings;
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
  SELECT * INTO v_booking FROM public.marketplace_bookings WHERE id = v_ticket.booking_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Booking not found'; END IF;
  IF v_booking.status IN ('refund_pending', 'cancelled', 'refunded', 'voided') THEN
    RAISE EXCEPTION 'Booking not eligible for check-in';
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

COMMENT ON FUNCTION public.gce_marketplace_redeem_claim IS
  'Offer redemption — validates claim_token_hash; claim ≠ revenue (FD-037)';
