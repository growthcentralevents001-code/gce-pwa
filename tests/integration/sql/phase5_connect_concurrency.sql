-- Phase 5 concurrency + dual-status + seat-41 (local Postgres)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
DECLARE
  admin uuid := 'dddddddd-dddd-dddd-dddd-dddddddddddd';
  u1 uuid := 'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee';
  plan_id uuid;
  circle_id uuid;
  spec_id uuid;
  mid uuid;
  seat_id uuid;
  i int;
  life public.circle_lifecycle_status;
  const public.circle_constitution_status;
  credit_1 uuid;
  credit_2 uuid;
BEGIN
  RESET ROLE;

  INSERT INTO public.users (id, email) VALUES
    (admin, 'p5-admin@example.com'),
    (u1, 'p5-member@example.com')
  ON CONFLICT (id) DO NOTHING;

  SELECT id INTO plan_id FROM public.membership_plans WHERE plan_key = 'associate';
  SELECT id INTO spec_id FROM public.business_specialisations LIMIT 1;

  INSERT INTO public.connect_circles (name, city, lifecycle_status, constitution_status)
  VALUES ('P5 Test Circle', 'Pune', 'formation', 'formation_circle')
  RETURNING id INTO circle_id;

  -- Fill 14 seats
  FOR i IN 1..14 LOOP
    INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status, specialisation_id)
    VALUES (u1, plan_id, 'active', 'allocated', spec_id)
    RETURNING id INTO mid;
    INSERT INTO public.connect_circle_seats (
      circle_id, membership_id, specialisation_id, status, counts_toward_capacity, allocated_at, confirmed_at
    ) VALUES (
      circle_id, mid, spec_id, 'allocated', true, now(), now()
    );
  END LOOP;

  PERFORM public.gce_refresh_circle_capacity(circle_id, admin);
  SELECT lifecycle_status, constitution_status INTO life, const FROM public.connect_circles WHERE id = circle_id;
  IF life <> 'formation' OR const <> 'formation_circle' THEN
    RAISE EXCEPTION 'FAIL: 14 seats expected formation';
  END IF;

  -- 15th seat → activation once + BDP credit hook
  INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
  VALUES (u1, plan_id, 'active', 'allocated') RETURNING id INTO mid;
  INSERT INTO public.connect_circle_seats (
    circle_id, membership_id, status, counts_toward_capacity, allocated_at, confirmed_at
  ) VALUES (circle_id, mid, 'allocated', true, now(), now())
  RETURNING id INTO seat_id;

  PERFORM public.gce_refresh_circle_capacity(circle_id, admin);
  SELECT lifecycle_status, constitution_status, bdp_target_credit_event_id
    INTO life, const, credit_1
  FROM public.connect_circles WHERE id = circle_id;
  IF life <> 'active_growth' OR const <> 'formation_circle' THEN
    RAISE EXCEPTION 'FAIL: 15 seats mapping';
  END IF;
  IF credit_1 IS NULL THEN
    RAISE EXCEPTION 'FAIL: expected one-time BDP credit event at 15';
  END IF;

  -- Refresh again must not change credit event id
  PERFORM public.gce_refresh_circle_capacity(circle_id, admin);
  SELECT bdp_target_credit_event_id INTO credit_2 FROM public.connect_circles WHERE id = circle_id;
  IF credit_1 IS DISTINCT FROM credit_2 THEN
    RAISE EXCEPTION 'FAIL: duplicate BDP credit event';
  END IF;

  -- Jump to 20
  FOR i IN 1..5 LOOP
    INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
    VALUES (u1, plan_id, 'active', 'allocated') RETURNING id INTO mid;
    INSERT INTO public.connect_circle_seats (
      circle_id, membership_id, status, counts_toward_capacity, allocated_at, confirmed_at
    ) VALUES (circle_id, mid, 'allocated', true, now(), now());
  END LOOP;
  PERFORM public.gce_refresh_circle_capacity(circle_id, admin);
  SELECT lifecycle_status, constitution_status INTO life, const FROM public.connect_circles WHERE id = circle_id;
  IF life <> 'active_growth' OR const <> 'provisionally_active_circle' THEN
    RAISE EXCEPTION 'FAIL: 20 seats constitution';
  END IF;

  -- Fill to 40
  FOR i IN 1..20 LOOP
    INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
    VALUES (u1, plan_id, 'active', 'allocated') RETURNING id INTO mid;
    INSERT INTO public.connect_circle_seats (
      circle_id, membership_id, status, counts_toward_capacity, allocated_at, confirmed_at
    ) VALUES (circle_id, mid, 'allocated', true, now(), now());
  END LOOP;
  PERFORM public.gce_refresh_circle_capacity(circle_id, admin);
  SELECT lifecycle_status, constitution_status, active_seat_count INTO life, const, i
  FROM public.connect_circles WHERE id = circle_id;
  IF i <> 40 OR life <> 'full_capacity' OR const <> 'fully_constituted_circle' THEN
    RAISE EXCEPTION 'FAIL: 40 full capacity mapping count=%', i;
  END IF;

  -- Seat 41 blocked via confirm function
  INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
  VALUES (u1, plan_id, 'active', 'unallocated') RETURNING id INTO mid;
  INSERT INTO public.connect_circle_seats (
    circle_id, membership_id, status, counts_toward_capacity
  ) VALUES (circle_id, mid, 'reserved', false)
  RETURNING id INTO seat_id;

  BEGIN
    PERFORM public.gce_confirm_circle_seat(seat_id, admin);
    RAISE EXCEPTION 'FAIL: seat 41 allowed';
  EXCEPTION WHEN check_violation OR integrity_constraint_violation THEN
    NULL;
  WHEN OTHERS THEN
    IF SQLERRM ILIKE '%FAIL:%' THEN RAISE; END IF;
    IF SQLERRM ILIKE '%capacity%' OR SQLERRM ILIKE '%seat 41%' THEN
      NULL;
    ELSE
      RAISE;
    END IF;
  END;

  -- Payment != active: membership may be active while unallocated
  INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
  VALUES (u1, plan_id, 'active', 'unallocated') RETURNING id INTO mid;
  IF (SELECT allocation_status FROM public.connect_memberships WHERE id = mid) <> 'unallocated' THEN
    RAISE EXCEPTION 'FAIL: active unallocated invariant';
  END IF;

  RAISE NOTICE 'PHASE5_CONNECT_OK';
END;
$$;

SELECT 'PHASE5_CONNECT_OK' AS phase5_status;
