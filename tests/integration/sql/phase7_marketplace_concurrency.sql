-- Phase 7 Marketplace concurrency / commercial invariants
BEGIN;
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  INSERT INTO public.users (id, email) VALUES
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1', 'p7-mbdp@example.com'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', 'p7-ops@example.com'),
    ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3', 'p7-buyer@example.com')
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN others THEN NULL;
END $$;

-- Split helper
DO $$
DECLARE
  r record;
BEGIN
  SELECT * INTO r FROM public.gce_marketplace_split(10000000, true);
  IF r.venue_share_minor <> 8000000 OR r.mbdp_share_minor <> 1000000 OR r.gce_share_minor <> 1000000 THEN
    RAISE EXCEPTION 'Attributed split mismatch';
  END IF;
  SELECT * INTO r FROM public.gce_marketplace_split(10000000, false);
  IF r.venue_share_minor <> 8000000 OR r.mbdp_share_minor <> 0 OR r.gce_share_minor <> 2000000 THEN
    RAISE EXCEPTION 'Unattributed split mismatch';
  END IF;
END $$;

-- Unit venue cap 20
DO $$
DECLARE
  u1 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  unit_id uuid;
  org_id uuid;
  venue_id uuid;
  i int;
  ok boolean := false;
BEGIN
  INSERT INTO public.marketplace_bdp_units (
    user_id, application_status, package_option,
    package_total_minor, initial_payment_minor,
    recoverable_balance_minor, recovered_to_date_minor, remaining_recoverable_minor,
    terms_accepted_at
  ) VALUES (
    u1, 'active', 'finance_recovery_60000',
    6000000, 500000, 5500000, 0, 5500000, now()
  ) RETURNING id INTO unit_id;

  FOR i IN 1..20 LOOP
    INSERT INTO public.organisations (id, legal_name, kind, status)
    VALUES (gen_random_uuid(), 'P7 Venue Org '||i, 'venue_partner', 'active')
    RETURNING id INTO org_id;

    INSERT INTO public.marketplace_venues (
      organisation_id, display_name, city, status, submitted_by, approved_by, approved_at
    ) VALUES (
      org_id, 'P7 Venue '||i, 'TestCity', 'active', u1, u1, now()
    ) RETURNING id INTO venue_id;

    INSERT INTO public.marketplace_venue_attributions (
      venue_id, unit_id, bdp_user_id, status, created_by, approved_by, effective_from, is_correction
    ) VALUES (
      venue_id, unit_id, u1, 'active', u1, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', now(), true
    );
  END LOOP;

  INSERT INTO public.organisations (id, legal_name, kind, status)
  VALUES (gen_random_uuid(), 'P7 Overflow Org', 'venue_partner', 'active')
  RETURNING id INTO org_id;
  INSERT INTO public.marketplace_venues (
    organisation_id, display_name, city, status, submitted_by
  ) VALUES (org_id, 'Overflow Venue', 'TestCity', 'active', u1)
  RETURNING id INTO venue_id;

  BEGIN
    INSERT INTO public.marketplace_venue_attributions (
      venue_id, unit_id, bdp_user_id, status, created_by, approved_by, effective_from, is_correction
    ) VALUES (
      venue_id, unit_id, u1, 'active', u1, 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2', now(), true
    );
    RAISE EXCEPTION 'EXPECTED_VENUE_CAP_FAIL';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%EXPECTED_VENUE_CAP_FAIL%' THEN RAISE; END IF;
    ok := true;
  END;
  IF NOT ok THEN RAISE EXCEPTION 'Unit venue cap 20 not enforced'; END IF;
END $$;

-- Offer planned value gate + claim expiry + redemption replay
DO $$
DECLARE
  u1 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  buyer uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3';
  org_id uuid;
  venue_id uuid;
  offer_id uuid;
  claim_id uuid;
  tok text := encode(gen_random_bytes(16), 'hex');
  red public.marketplace_redemptions;
BEGIN
  INSERT INTO public.organisations (id, legal_name, kind, status)
  VALUES (gen_random_uuid(), 'P7 Offer Org', 'venue_partner', 'active')
  RETURNING id INTO org_id;
  INSERT INTO public.marketplace_venues (
    organisation_id, display_name, city, status, submitted_by, approved_by, approved_at
  ) VALUES (org_id, 'Offer Venue', 'TestCity', 'active', u1, u1, now())
  RETURNING id INTO venue_id;

  BEGIN
    INSERT INTO public.marketplace_offer_events (
      venue_id, title, planned_commercial_value_minor,
      campaign_starts_at, campaign_ends_at, status, submitted_by
    ) VALUES (
      venue_id, 'Bad Offer', 4999999, now(), now() + interval '5 days', 'draft', u1
    );
    RAISE EXCEPTION 'EXPECTED_MIN_VALUE_FAIL';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%EXPECTED_MIN_VALUE_FAIL%' THEN RAISE; END IF;
  END;

  INSERT INTO public.marketplace_offer_events (
    venue_id, title, planned_commercial_value_minor,
    campaign_starts_at, campaign_ends_at, status, submitted_by, approved_by, published_at
  ) VALUES (
    venue_id, 'Good Offer', 5000000, now(), now() + interval '5 days',
    'published', u1, u1, now()
  ) RETURNING id INTO offer_id;

  INSERT INTO public.marketplace_offer_claims (
    offer_event_id, claimant_user_id, claim_token_hash, status, claimed_at, expires_at
  ) VALUES (
    offer_id, buyer, encode(digest(tok, 'sha256'), 'hex'), 'claimed', now(), now() + interval '72 hours'
  ) RETURNING id INTO claim_id;

  red := public.gce_marketplace_redeem_claim(claim_id, encode(digest(tok||'-red', 'sha256'), 'hex'), u1, false, null);

  BEGIN
    PERFORM public.gce_marketplace_redeem_claim(claim_id, encode(digest(tok||'-red2', 'sha256'), 'hex'), u1, false, null);
    RAISE EXCEPTION 'EXPECTED_REDEMPTION_REPLAY_FAIL';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%EXPECTED_REDEMPTION_REPLAY_FAIL%' THEN RAISE; END IF;
  END;
END $$;

-- Ticket QR replay
DO $$
DECLARE
  u1 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1';
  buyer uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb3';
  org_id uuid;
  venue_id uuid;
  event_id uuid;
  booking_id uuid;
  ticket_id uuid;
  hash text := encode(digest('qr-token-1', 'sha256'), 'hex');
BEGIN
  SELECT organisation_id, id INTO org_id, venue_id
  FROM public.marketplace_venues WHERE display_name = 'Offer Venue' LIMIT 1;

  INSERT INTO public.marketplace_events (
    venue_id, title, starts_at, capacity, price_minor, status, submitted_by, approved_by, published_at,
    cancel_cutoff_hours
  ) VALUES (
    venue_id, 'Ticket Event', now() + interval '3 days', 100, 100000, 'published', u1, u1, now(), 48
  ) RETURNING id INTO event_id;

  INSERT INTO public.marketplace_bookings (
    event_id, buyer_user_id, quantity, unit_price_minor, total_minor, status
  ) VALUES (event_id, buyer, 1, 100000, 100000, 'confirmed')
  RETURNING id INTO booking_id;

  INSERT INTO public.marketplace_tickets (
    booking_id, event_id, holder_user_id, ticket_ref, qr_token_hash, status
  ) VALUES (booking_id, event_id, buyer, 'TCK-P7-1', hash, 'issued')
  RETURNING id INTO ticket_id;

  PERFORM public.gce_marketplace_ticket_check_in(ticket_id, hash, u1);

  BEGIN
    PERFORM public.gce_marketplace_ticket_check_in(ticket_id, hash, u1);
    RAISE EXCEPTION 'EXPECTED_QR_REPLAY_FAIL';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%EXPECTED_QR_REPLAY_FAIL%' THEN RAISE; END IF;
  END;
END $$;

SELECT 'PHASE7_MARKETPLACE_OK' AS result;
ROLLBACK;
