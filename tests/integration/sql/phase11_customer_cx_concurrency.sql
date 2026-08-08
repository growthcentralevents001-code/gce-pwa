-- Phase 11 CX concurrency / cancellation / claim / replay proofs
-- Runs in a transaction and ROLLBACKs.

BEGIN;

DO $$
DECLARE
  u1 uuid;
  u2 uuid;
  v_org uuid;
  v_venue uuid;
  v_event uuid;
  v_offer uuid;
  v_b1 uuid;
  v_b2 uuid;
  v_ticket uuid;
  v_claim uuid;
  v_hash text := repeat('a', 64);
  v_flags_on int;
BEGIN
  SELECT id INTO u1 FROM public.users ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO u2 FROM public.users WHERE id <> u1 ORDER BY created_at NULLS LAST LIMIT 1;
  IF u1 IS NULL OR u2 IS NULL THEN
    RAISE EXCEPTION 'Need at least 2 users for Phase 11 SQL harness';
  END IF;

  SELECT count(*) INTO v_flags_on
  FROM public.feature_flags
  WHERE key IN ('marketplace_ticket_payments','settlement_execution','payout_execution','refund_processing')
    AND enabled = true;
  IF v_flags_on <> 0 THEN
    RAISE EXCEPTION 'PHASE11_MONEY_FLAGS_ON';
  END IF;

  INSERT INTO public.organisations (id, kind, status, legal_name)
  VALUES (gen_random_uuid(), 'venue_partner', 'active', 'P11 Venue Org')
  RETURNING id INTO v_org;

  INSERT INTO public.marketplace_venues (
    id, organisation_id, display_name, city, status
  ) VALUES (
    gen_random_uuid(), v_org, 'P11 Test Venue', 'Pune', 'active'
  ) RETURNING id INTO v_venue;

  INSERT INTO public.marketplace_events (
    id, venue_id, title, starts_at, capacity, price_minor, status,
    cancel_cutoff_hours, cancel_policy_version, published_at
  ) VALUES (
    gen_random_uuid(), v_venue, 'P11 Capacity Event',
    now() + interval '10 days', 1, 50000, 'published',
    48, 'fd039-48h-default-v1', now()
  ) RETURNING id INTO v_event;

  -- capacity 1: first booking ok
  v_b1 := (public.gce_marketplace_create_booking(v_event, u1, 1, 'p11-idem-1')).id;

  -- second booking must fail
  BEGIN
    PERFORM public.gce_marketplace_create_booking(v_event, u2, 1, 'p11-idem-2');
    RAISE EXCEPTION 'PHASE11_OVERSELL_ALLOWED';
  EXCEPTION WHEN check_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%sold out%' OR SQLERRM LIKE '%capacity%' THEN NULL; ELSE RAISE; END IF;
  END;

  -- idempotent rebook same key
  IF (public.gce_marketplace_create_booking(v_event, u1, 1, 'p11-idem-1')).id <> v_b1 THEN
    RAISE EXCEPTION 'PHASE11_IDEMPOTENCY_BROKEN';
  END IF;

  -- ticket check-in replay
  INSERT INTO public.marketplace_tickets (
    id, booking_id, event_id, holder_user_id, ticket_ref, qr_token_hash, status
  ) VALUES (
    gen_random_uuid(), v_b1, v_event, u1, 'TCK-P11-1', v_hash, 'issued'
  ) RETURNING id INTO v_ticket;

  PERFORM public.gce_marketplace_ticket_check_in(v_ticket, v_hash, u2);
  BEGIN
    PERFORM public.gce_marketplace_ticket_check_in(v_ticket, v_hash, u2);
    RAISE EXCEPTION 'PHASE11_QR_REPLAY_ALLOWED';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%already checked in%' THEN NULL; ELSE RAISE; END IF;
  END;

  -- Offer claim + cap / duplicate / revenue invariant metadata
  INSERT INTO public.marketplace_offer_events (
    id, venue_id, title, planned_commercial_value_minor,
    campaign_starts_at, campaign_ends_at, customer_cap, status, published_at
  ) VALUES (
    gen_random_uuid(), v_venue, 'P11 Offer',
    5000000, now() - interval '1 hour', now() + interval '5 days',
    1, 'published', now()
  ) RETURNING id INTO v_offer;

  v_claim := (public.gce_marketplace_claim_offer(
    v_offer, u1, repeat('b', 64), now() + interval '72 hours'
  )).id;

  BEGIN
    PERFORM public.gce_marketplace_claim_offer(
      v_offer, u2, repeat('c', 64), now() + interval '72 hours'
    );
    RAISE EXCEPTION 'PHASE11_CLAIM_CAP_BYPASS';
  EXCEPTION WHEN check_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%cap%' THEN NULL; ELSE RAISE; END IF;
  END;

  IF EXISTS (
    SELECT 1 FROM public.revenue_components
    WHERE domain_object_type = 'offer_claim' AND domain_object_id = v_claim
  ) THEN
    RAISE EXCEPTION 'PHASE11_CLAIM_CREATED_REVENUE';
  END IF;

  -- Refund request amount_determination stays manual
  INSERT INTO public.customer_refund_requests (
    booking_id, requester_user_id, reason, policy_version, cutoff_hours,
    eligible_under_cutoff, amount_determination
  ) VALUES (
    v_b1, u1, 'changed plans', 'fd039-48h-default-v1', 48, true, 'manual_review_required'
  );

  RAISE NOTICE 'PHASE11_CUSTOMER_CX_OK';
END $$;

SELECT 'PHASE11_CUSTOMER_CX_OK' AS phase11_status;

ROLLBACK;
