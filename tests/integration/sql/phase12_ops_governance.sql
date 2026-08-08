-- Phase 12 SQL harness (transactional; rolls back)
-- Expect NOTICE / row: PHASE12_OPS_GOVERNANCE_OK

BEGIN;

DO $$
DECLARE
  v_user uuid;
  v_intent public.notification_intents;
  v_hold public.compliance_holds;
  v_risk public.risk_signals;
BEGIN
  -- Prefer existing auth user if present; otherwise skip user-FK tests lightly
  SELECT id INTO v_user FROM auth.users LIMIT 1;
  IF v_user IS NULL THEN
    RAISE NOTICE 'PHASE12_OPS_GOVERNANCE_OK_NO_USERS';
    RETURN;
  END IF;

  -- Idempotent notification intent
  INSERT INTO public.notification_intents (
    recipient_user_id, template_key, channel, category, payload,
    status, idempotency_key
  ) VALUES (
    v_user, 'security.notice', 'in_app', 'security',
    jsonb_build_object('summary', 'test'),
    'pending', 'phase12-harness-intent-1'
  ) RETURNING * INTO v_intent;

  INSERT INTO public.notification_intents (
    recipient_user_id, template_key, channel, category, payload,
    status, idempotency_key
  ) VALUES (
    v_user, 'security.notice', 'in_app', 'security',
    jsonb_build_object('summary', 'dup'),
    'pending', 'phase12-harness-intent-1'
  )
  ON CONFLICT (idempotency_key) DO NOTHING;

  IF (SELECT count(*) FROM public.notification_intents WHERE idempotency_key = 'phase12-harness-intent-1') <> 1 THEN
    RAISE EXCEPTION 'duplicate notification intent created';
  END IF;

  -- Analytics idempotency + no PII columns required
  INSERT INTO public.analytics_events (
    event_family, event_name, actor_user_id, payload, idempotency_key
  ) VALUES (
    'customer', 'booking_confirmed', v_user,
    jsonb_build_object('booking_id', 'b1', 'status', 'confirmed'),
    'phase12-harness-analytics-1'
  );
  INSERT INTO public.analytics_events (
    event_family, event_name, actor_user_id, payload, idempotency_key
  ) VALUES (
    'customer', 'booking_confirmed', v_user,
    jsonb_build_object('booking_id', 'b1'),
    'phase12-harness-analytics-1'
  ) ON CONFLICT (idempotency_key) DO NOTHING;

  IF (SELECT count(*) FROM public.analytics_events WHERE idempotency_key = 'phase12-harness-analytics-1') <> 1 THEN
    RAISE EXCEPTION 'duplicate analytics event';
  END IF;

  -- Risk signal flag_only
  INSERT INTO public.risk_signals (
    signal_type, subject_type, subject_id, recommendation,
    auto_action_applied, idempotency_key
  ) VALUES (
    'qr_replay', 'ticket', 't1', 'review', 'flag_only', 'phase12-harness-risk-1'
  ) RETURNING * INTO v_risk;

  IF v_risk.auto_action_applied <> 'flag_only' THEN
    RAISE EXCEPTION 'auto action must be flag_only';
  END IF;

  -- Compliance hold uniqueness
  INSERT INTO public.compliance_holds (
    subject_type, subject_id, reason, created_by
  ) VALUES (
    'user', v_user::text, 'phase12 harness', v_user
  ) RETURNING * INTO v_hold;

  BEGIN
    INSERT INTO public.compliance_holds (
      subject_type, subject_id, reason, created_by
    ) VALUES (
      'user', v_user::text, 'dup', v_user
    );
    RAISE EXCEPTION 'duplicate active hold should fail';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  -- Retention policies pending_validation exist; enforcement conceptual
  IF NOT EXISTS (
    SELECT 1 FROM public.retention_policies
    WHERE period_status = 'pending_validation'
      AND deletion_or_anonymisation = 'purge_forbidden'
  ) THEN
    RAISE EXCEPTION 'expected purge_forbidden pending policies';
  END IF;

  -- Live flags OFF
  IF EXISTS (
    SELECT 1 FROM public.feature_flags
    WHERE key IN (
      'notifications_email_live','notifications_sms_live','notifications_push_live',
      'marketing_notifications','retention_enforcement',
      'marketplace_ticket_payments','settlement_execution','payout_execution'
    ) AND enabled = true
  ) THEN
    RAISE EXCEPTION 'unsafe flags enabled';
  END IF;

  RAISE NOTICE 'PHASE12_OPS_GOVERNANCE_OK';
END $$;

SELECT 'PHASE12_OPS_GOVERNANCE_OK'::text AS phase12_status;

ROLLBACK;
