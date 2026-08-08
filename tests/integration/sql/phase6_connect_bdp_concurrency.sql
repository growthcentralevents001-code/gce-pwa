-- Phase 6 Connect BDP concurrency / invariants (local Postgres)
BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Minimal users (auth.users may already exist via Phase 2–5 seed)
DO $$
DECLARE
  u_bdp uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  u_admin uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
  u_member uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3';
BEGIN
  INSERT INTO public.users (id, email)
  VALUES
    (u_bdp, 'p6-bdp@example.com'),
    (u_admin, 'p6-admin@example.com'),
    (u_member, 'p6-member@example.com')
  ON CONFLICT (id) DO NOTHING;
EXCEPTION WHEN undefined_table THEN
  NULL;
WHEN others THEN
  NULL;
END $$;

-- Ensure phase 6 objects applied
SELECT to_regclass('public.connect_bdp_units') AS units_table;

-- City caps: Tier-3 max 2 (FD-025)
INSERT INTO public.connect_bdp_city_configs (city, state, tier, max_units)
VALUES ('P6 Cap City T3', 'Test', 'tier_3', 2)
ON CONFLICT (city) DO UPDATE SET tier = 'tier_3', max_units = 2;

DO $$
DECLARE
  v_city uuid;
  u1 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  u2 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2';
  u3 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3';
  unit1 uuid;
  unit2 uuid;
  unit3 uuid;
  ok boolean := false;
BEGIN
  SELECT id INTO v_city FROM public.connect_bdp_city_configs WHERE city = 'P6 Cap City T3';

  INSERT INTO public.connect_bdp_units (
    user_id, application_status, package_option,
    package_total_minor, initial_payment_minor,
    recoverable_balance_minor, recovered_to_date_minor, remaining_recoverable_minor,
    terms_accepted_at
  ) VALUES (
    u1, 'active', 'finance_recovery_60000',
    6000000, 500000, 5500000, 0, 5500000,
    now()
  ) RETURNING id INTO unit1;

  INSERT INTO public.connect_bdp_city_assignments (unit_id, city_config_id, status)
  VALUES (unit1, v_city, 'active');

  INSERT INTO public.connect_bdp_units (
    user_id, application_status, package_option,
    package_total_minor, initial_payment_minor,
    recoverable_balance_minor, recovered_to_date_minor, remaining_recoverable_minor,
    terms_accepted_at
  ) VALUES (
    u2, 'active', 'direct_50000',
    5000000, 5000000, 0, 0, 0,
    now()
  ) RETURNING id INTO unit2;

  INSERT INTO public.connect_bdp_city_assignments (unit_id, city_config_id, status)
  VALUES (unit2, v_city, 'active');

  INSERT INTO public.connect_bdp_units (
    user_id, application_status, package_option,
    package_total_minor, initial_payment_minor,
    recoverable_balance_minor, recovered_to_date_minor, remaining_recoverable_minor,
    terms_accepted_at,
    metadata
  ) VALUES (
    u3, 'active', 'direct_50000',
    5000000, 5000000, 0, 0, 0,
    now(),
    jsonb_build_object('special_unit_approval', true)
  ) RETURNING id INTO unit3;

  BEGIN
    INSERT INTO public.connect_bdp_city_assignments (unit_id, city_config_id, status)
    VALUES (unit3, v_city, 'active');
    RAISE EXCEPTION 'EXPECTED_CITY_CAP_FAIL';
  EXCEPTION WHEN others THEN
    IF SQLERRM LIKE '%EXPECTED_CITY_CAP_FAIL%' THEN
      RAISE;
    END IF;
    ok := true;
  END;

  IF NOT ok THEN
    RAISE EXCEPTION 'Tier-3 city cap (max 2) did not block third BDP';
  END IF;
END $$;

-- Recovery calculation invariant
DO $$
DECLARE
  u1 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  unit_id uuid;
  ent_id uuid;
  entry public.connect_bdp_recovery_entries;
  remaining bigint;
BEGIN
  SELECT id INTO unit_id FROM public.connect_bdp_units
  WHERE user_id = u1 AND application_status = 'active'
  ORDER BY created_at DESC LIMIT 1;

  INSERT INTO public.connect_bdp_commission_entitlements (
    unit_id, earning_event_key, gross_eligible_revenue_minor,
    commission_bps, gross_commission_minor, state
  ) VALUES (
    unit_id, 'p6-test-earn-1', 600000, 2000, 120000, 'earned'
  ) RETURNING id INTO ent_id;

  entry := public.gce_connect_bdp_apply_recovery(unit_id, ent_id, 'cycle-p6-1', u1);
  IF entry.recovered_minor <> 120000 THEN
    RAISE EXCEPTION 'Expected recovery = min(5k, remaining, commission)=120000 got %', entry.recovered_minor;
  END IF;

  SELECT remaining_recoverable_minor INTO remaining FROM public.connect_bdp_units WHERE id = unit_id;
  IF remaining <> 5500000 - 120000 THEN
    RAISE EXCEPTION 'Remaining recoverable mismatch %', remaining;
  END IF;

  -- Second entitlement with large commission — recovery capped at 500000
  INSERT INTO public.connect_bdp_commission_entitlements (
    unit_id, earning_event_key, gross_eligible_revenue_minor,
    commission_bps, gross_commission_minor, state
  ) VALUES (
    unit_id, 'p6-test-earn-2', 5000000, 2000, 1000000, 'settlement_eligible'
  ) RETURNING id INTO ent_id;

  entry := public.gce_connect_bdp_apply_recovery(unit_id, ent_id, 'cycle-p6-2', u1);
  IF entry.recovered_minor <> 500000 THEN
    RAISE EXCEPTION 'Expected cycle cap 500000 got %', entry.recovered_minor;
  END IF;
END $$;

-- Target credit once: simulate circle with activation event
DO $$
DECLARE
  u1 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1';
  v_unit_id uuid;
  v_circle_id uuid;
  credit1 public.connect_bdp_target_credits;
  credit2 public.connect_bdp_target_credits;
  evt uuid := gen_random_uuid();
BEGIN
  SELECT id INTO v_unit_id FROM public.connect_bdp_units
  WHERE user_id = u1 AND application_status = 'active'
  ORDER BY created_at DESC LIMIT 1;

  INSERT INTO public.connect_circles (
    name, city, lifecycle_status, constitution_status,
    platform_activation_granted_at, bdp_target_credit_event_id, bdp_target_credit_issued_at
  ) VALUES (
    'P6 Credit Circle', 'P6 Cap City T3', 'active_growth', 'formation_circle',
    now(), evt, now()
  ) RETURNING id INTO v_circle_id;

  INSERT INTO public.connect_bdp_circle_assignments (unit_id, circle_id, status)
  VALUES (v_unit_id, v_circle_id, 'active');

  credit1 := public.gce_connect_bdp_credit_circle_activation(v_circle_id, u1);
  credit2 := public.gce_connect_bdp_credit_circle_activation(v_circle_id, u1);

  IF credit1.id IS DISTINCT FROM credit2.id THEN
    RAISE EXCEPTION 'Duplicate target credit created';
  END IF;

  IF (SELECT count(*) FROM public.connect_bdp_target_credits t WHERE t.circle_id = v_circle_id) <> 1 THEN
    RAISE EXCEPTION 'Expected exactly one target credit row';
  END IF;
END $$;

SELECT 'PHASE6_CONNECT_BDP_OK' AS result;

ROLLBACK;
