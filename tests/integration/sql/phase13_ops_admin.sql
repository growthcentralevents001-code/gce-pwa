-- Phase 13 SQL harness (transactional; rolls back)
BEGIN;

DO $$
DECLARE
  v_user uuid;
  v_case public.ops_cases;
  v_approval public.ops_approval_queue;
  v_override public.ops_overrides;
BEGIN
  SELECT id INTO v_user FROM auth.users LIMIT 1;
  IF v_user IS NULL THEN
    RAISE NOTICE 'PHASE13_OPS_ADMIN_OK_NO_USERS';
    RETURN;
  END IF;

  INSERT INTO public.ops_approval_queue (
    queue_key, subject_type, subject_id, vertical, title,
    requester_user_id, idempotency_key
  ) VALUES (
    'marketplace.event', 'marketplace_events', 'e1', 'marketplace',
    'Approve event e1', v_user, 'phase13-harness-approval-1'
  ) RETURNING * INTO v_approval;

  INSERT INTO public.ops_approval_queue (
    queue_key, subject_type, subject_id, vertical, title,
    requester_user_id, idempotency_key
  ) VALUES (
    'marketplace.event', 'marketplace_events', 'e1', 'marketplace',
    'dup', v_user, 'phase13-harness-approval-1'
  ) ON CONFLICT (idempotency_key) DO NOTHING;

  IF (SELECT count(*) FROM public.ops_approval_queue WHERE idempotency_key = 'phase13-harness-approval-1') <> 1 THEN
    RAISE EXCEPTION 'duplicate approval';
  END IF;

  INSERT INTO public.ops_cases (
    case_number, case_type, vertical, summary, requester_user_id, status
  ) VALUES (
    'OPS-HARNESS-1', 'general_support', 'support', 'Harness case', v_user, 'open'
  ) RETURNING * INTO v_case;

  INSERT INTO public.ops_case_notes (
    case_id, author_user_id, visibility, body
  ) VALUES (
    v_case.id, v_user, 'internal', 'Internal note only'
  );

  INSERT INTO public.ops_overrides (
    override_category, subject_type, subject_id, reason,
    requester_user_id, finance_immutable
  ) VALUES (
    'data_correction', 'membership', 'm1', 'Harness typed override reason',
    v_user, true
  ) RETURNING * INTO v_override;

  IF v_override.finance_immutable IS NOT TRUE THEN
    RAISE EXCEPTION 'override must mark finance immutable';
  END IF;

  -- No live/money flags
  IF EXISTS (
    SELECT 1 FROM public.feature_flags
    WHERE key IN (
      'marketplace_ticket_payments','settlement_execution','payout_execution',
      'notifications_email_live','notifications_sms_live','notifications_push_live',
      'marketing_notifications','retention_enforcement'
    ) AND enabled = true
  ) THEN
    RAISE EXCEPTION 'unsafe flags enabled';
  END IF;

  RAISE NOTICE 'PHASE13_OPS_ADMIN_OK';
END $$;

SELECT 'PHASE13_OPS_ADMIN_OK'::text AS phase13_status;
ROLLBACK;
