-- Phase 9 Finance concurrency / monetary invariant proofs
-- Expects Phase 9 migration applied. Rolls back all test data.

BEGIN;

DO $$
DECLARE
  u1 uuid;
  u2 uuid;
  rc_id uuid;
  se_id uuid;
  se2_id uuid;
  batch_id uuid;
  hold_id uuid;
BEGIN
  SELECT id INTO u1 FROM public.users ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO u2 FROM public.users WHERE id <> u1 ORDER BY created_at NULLS LAST LIMIT 1;
  IF u1 IS NULL OR u2 IS NULL THEN
    RAISE EXCEPTION 'Need at least 2 users for Phase 9 SQL harness';
  END IF;

  -- Offer claim alone cannot be revenue
  BEGIN
    INSERT INTO public.revenue_components (
      revenue_component_key, vertical, domain_object_type,
      gross_amount_minor, eligible_base_minor
    ) VALUES ('bad-claim', 'marketplace', 'offer_claim', 100, 100);
    RAISE EXCEPTION 'EXPECTED_FAIL_claim_revenue';
  EXCEPTION WHEN check_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%not revenue%' THEN NULL; ELSE RAISE; END IF;
  END;

  INSERT INTO public.revenue_components (
    id, revenue_component_key, vertical, domain_object_type,
    gross_amount_minor, eligible_base_minor, recognition_status, recognised_at
  ) VALUES (
    'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaa1',
    'rc-phase9-mkt-1',
    'marketplace',
    'marketplace_booking_completed',
    10000000,
    10000000,
    'recognised',
    now()
  ) RETURNING id INTO rc_id;

  -- Duplicate revenue component key fails
  BEGIN
    INSERT INTO public.revenue_components (
      revenue_component_key, vertical, domain_object_type,
      gross_amount_minor, eligible_base_minor
    ) VALUES ('rc-phase9-mkt-1', 'marketplace', 'marketplace_booking_completed', 1, 1);
    RAISE EXCEPTION 'EXPECTED_FAIL_dup_component';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  INSERT INTO public.stakeholder_entitlements (
    id, earning_event_key, revenue_component_id, revenue_component_key,
    stakeholder_user_id, stakeholder_type, source_vertical,
    rule_key, rule_version, gross_eligible_basis_minor, rate_bps,
    gross_entitlement_minor, recovery_deduction_minor, reversal_amount_minor,
    net_settlement_eligible_minor, status
  ) VALUES (
    'bbbbbbbb-bbbb-4bbb-8bbb-bbbbbbbbbbb1',
    'mkt:rc-phase9-mkt-1:mbdp',
    rc_id,
    'rc-phase9-mkt-1:mbdp',
    u1,
    'marketplace_bdp',
    'marketplace',
    'marketplace_bdp_attributed',
    'fd029-fd037-v1',
    10000000,
    1000,
    1000000,
    0,
    0,
    1000000,
    'earned'
  ) RETURNING id INTO se_id;

  -- Gross immutable
  BEGIN
    UPDATE public.stakeholder_entitlements
    SET gross_entitlement_minor = 1
    WHERE id = se_id;
    RAISE EXCEPTION 'EXPECTED_FAIL_gross_mutate';
  EXCEPTION WHEN check_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%immutable%' THEN NULL; ELSE RAISE; END IF;
  END;

  -- Duplicate stakeholder entitlement on same component+type fails
  BEGIN
    INSERT INTO public.stakeholder_entitlements (
      earning_event_key, revenue_component_id, revenue_component_key,
      stakeholder_type, source_vertical, rule_key, rule_version,
      gross_entitlement_minor, net_settlement_eligible_minor, status
    ) VALUES (
      'dup',
      rc_id,
      'rc-phase9-mkt-1:mbdp',
      'marketplace_bdp',
      'marketplace',
      'marketplace_bdp_attributed',
      'v1',
      1,
      1,
      'earned'
    );
    RAISE EXCEPTION 'EXPECTED_FAIL_dup_entitlement';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  -- Recovery application
  INSERT INTO public.recovery_applications (
    entitlement_id, vertical, cycle_key,
    remaining_before_minor, applied_minor, remaining_after_minor, cap_minor, created_by
  ) VALUES (
    se_id, 'marketplace', '2026-08',
    5500000, 500000, 5000000, 500000, u2
  );

  UPDATE public.stakeholder_entitlements SET
    recovery_deduction_minor = 500000,
    net_settlement_eligible_minor = 500000
  WHERE id = se_id;

  -- Cross-vertical double commission claim
  PERFORM public.gce_claim_revenue_component('rc-phase9-unique', 'marketplace', 'marketplace_bdp', NULL);
  BEGIN
    PERFORM public.gce_claim_revenue_component('rc-phase9-unique', 'enterprise', 'enterprise_bdp', NULL);
    RAISE EXCEPTION 'EXPECTED_FAIL_double_commission';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%double commission%' THEN NULL; ELSE RAISE; END IF;
  END;

  -- Hold blocks path
  INSERT INTO public.financial_holds (scope_type, scope_id, reason, actor_user_id, status)
  VALUES ('entitlement', se_id, 'test hold', u2, 'active')
  RETURNING id INTO hold_id;

  UPDATE public.stakeholder_entitlements SET status = 'on_hold' WHERE id = se_id;

  -- Settlement batch + execution blocked
  INSERT INTO public.settlement_batches (
    id, batch_ref, period_start, period_end, status, item_count,
    gross_total_minor, recovery_total_minor, net_total_minor
  ) VALUES (
    'cccccccc-cccc-4ccc-8ccc-ccccccccccc1',
    'SB-TEST-P9',
    current_date - 30,
    current_date,
    'payout_ready',
    0, 0, 0, 0
  ) RETURNING id INTO batch_id;

  UPDATE public.settlement_batches SET status = 'executed' WHERE id = batch_id;
  IF (SELECT status FROM public.settlement_batches WHERE id = batch_id) <> 'execution_blocked' THEN
    RAISE EXCEPTION 'EXPECTED_execution_blocked when flag OFF';
  END IF;

  -- Offline cash rejected
  BEGIN
    INSERT INTO public.offline_payment_records (
      source_domain, amount_minor, method, bank_reference, received_on, recorded_by
    ) VALUES ('connect_bdp_pack', 500000, 'cash', 'X', current_date, u2);
    RAISE EXCEPTION 'EXPECTED_FAIL_cash';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;

  -- Self-approve entitlement rejected
  BEGIN
    UPDATE public.stakeholder_entitlements
    SET approved_by = u1, status = 'approved'
    WHERE id = se_id;
    RAISE EXCEPTION 'EXPECTED_FAIL_self_approve';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;

  -- Money flags OFF
  IF EXISTS (
    SELECT 1 FROM public.feature_flags
    WHERE key IN ('settlement_execution','payout_execution','wallet_cashout','marketplace_ticket_payments')
      AND enabled = true
  ) THEN
    RAISE EXCEPTION 'Money flags must remain OFF';
  END IF;

  -- Function exists
  IF to_regprocedure('public.gce_assert_txn_balanced(uuid)') IS NULL THEN
    RAISE EXCEPTION 'gce_assert_txn_balanced missing';
  END IF;
END $$;

SELECT 'PHASE9_FINANCE_OK' AS result;

ROLLBACK;
