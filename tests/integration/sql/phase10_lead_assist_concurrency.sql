-- Phase 10 concurrency / dual-confirmation / assignment uniqueness
-- Run against gce-dev inside a transaction (ROLLBACK).

BEGIN;

DO $$
DECLARE
  v_giver uuid;
  v_recv1 uuid;
  v_recv2 uuid;
  v_lead uuid;
  v_a1 uuid;
  v_out uuid;
  v_flags_on int;
BEGIN
  SELECT id INTO v_giver FROM public.users ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO v_recv1 FROM public.users WHERE id <> v_giver ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO v_recv2 FROM public.users WHERE id NOT IN (v_giver, v_recv1) ORDER BY created_at NULLS LAST LIMIT 1;
  IF v_giver IS NULL OR v_recv1 IS NULL OR v_recv2 IS NULL THEN
    RAISE EXCEPTION 'Need at least 3 users for Phase 10 SQL harness';
  END IF;

  -- Paid flags must be off
  SELECT count(*) INTO v_flags_on
  FROM public.feature_flags
  WHERE key IN (
    'paid_lead_assist','lead_escrow','lead_success_fee',
    'pay_to_receive_leads','paid_contact_reveal','rupee_500_lead_fee'
  ) AND enabled = true;
  IF v_flags_on <> 0 THEN
    RAISE EXCEPTION 'PHASE10_PAID_FLAGS_ON';
  END IF;

  INSERT INTO public.assist_leads (
    id, lead_ref, giver_user_id, title, work_status, quality_status
  ) VALUES (
    gen_random_uuid(), 'AL-P10-TEST-' || substr(gen_random_uuid()::text,1,8),
    v_giver, 'Need CA help', 'offered', 'qualified'
  ) RETURNING id INTO v_lead;

  INSERT INTO public.assist_lead_assignments (
    id, lead_id, receiver_user_id, status, is_active, assignment_source
  ) VALUES (
    gen_random_uuid(), v_lead, v_recv1, 'assigned', true, 'system'
  ) RETURNING id INTO v_a1;

  BEGIN
    INSERT INTO public.assist_lead_assignments (
      lead_id, receiver_user_id, status, is_active, assignment_source
    ) VALUES (
      v_lead, v_recv2, 'assigned', true, 'desk'
    );
    RAISE EXCEPTION 'PHASE10_DUPLICATE_ACTIVE_ASSIGNMENT_ALLOWED';
  EXCEPTION WHEN unique_violation THEN
    NULL; -- expected
  END;

  -- Dual confirmation mismatch → disputed
  INSERT INTO public.assist_lead_outcomes (
    id, lead_id, status, creates_finance_transaction,
    giver_status, receiver_status, giver_amount_minor, receiver_amount_minor
  ) VALUES (
    gen_random_uuid(), v_lead, 'pending', false,
    'submitted', 'submitted', 100000, 200000
  ) RETURNING id INTO v_out;

  PERFORM public.gce_assist_reconcile_outcome(v_out);

  IF (SELECT status FROM public.assist_lead_outcomes WHERE id = v_out) <> 'disputed' THEN
    RAISE EXCEPTION 'PHASE10_MISMATCH_NOT_DISPUTED';
  END IF;

  -- Matching confirmation → confirmed, no finance flag
  UPDATE public.assist_lead_outcomes SET
    status = 'pending',
    giver_status = 'submitted',
    receiver_status = 'submitted',
    giver_amount_minor = 150000,
    receiver_amount_minor = 150000,
    creates_finance_transaction = false
  WHERE id = v_out;

  PERFORM public.gce_assist_reconcile_outcome(v_out);

  IF (SELECT status FROM public.assist_lead_outcomes WHERE id = v_out) <> 'confirmed' THEN
    RAISE EXCEPTION 'PHASE10_MATCH_NOT_CONFIRMED';
  END IF;
  IF (SELECT creates_finance_transaction FROM public.assist_lead_outcomes WHERE id = v_out) IS TRUE THEN
    RAISE EXCEPTION 'PHASE10_FINANCE_FLAG_SET';
  END IF;
  IF (SELECT work_status FROM public.assist_leads WHERE id = v_lead) <> 'closed_dual_confirmed' THEN
    RAISE EXCEPTION 'PHASE10_LEAD_NOT_CLOSED_DUAL';
  END IF;

  -- Block finance path on outcomes
  BEGIN
    UPDATE public.assist_lead_outcomes SET creates_finance_transaction = true WHERE id = v_out;
    RAISE EXCEPTION 'PHASE10_FINANCE_PATH_ALLOWED';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;

  RAISE NOTICE 'PHASE10_LEAD_ASSIST_OK';
END $$;

SELECT 'PHASE10_LEAD_ASSIST_OK' AS phase10_status;

ROLLBACK;
