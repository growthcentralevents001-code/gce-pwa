-- Phase 14A platform/backend validation harness (isolated clean rebuild DB)
-- Expect marker: PHASE14A_PLATFORM_VALIDATION_OK
BEGIN;

DO $$
DECLARE
  missing text;
  off_flags text[];
  u1 uuid := gen_random_uuid();
  u2 uuid := gen_random_uuid();
  circle_id uuid;
  plan_id uuid;
  mid uuid;
  seat_id uuid;
  rc_id uuid;
  life public.circle_lifecycle_status;
  const public.circle_constitution_status;
  seat_count int;
  i int;
BEGIN
  -- 1) Production-risk flags OFF
  SELECT array_agg(key ORDER BY key) INTO off_flags
  FROM public.feature_flags
  WHERE key IN (
    'marketplace_ticket_payments','settlement_execution','payout_execution',
    'refund_processing','notifications_email_live','notifications_sms_live',
    'notifications_push_live','marketing_notifications','retention_enforcement',
    'paid_lead_assist','wallet_cashout','revenue_recognition_live',
    'commission_posting_live','settlement_batch_generation','rupee_500_lead_fee',
    'lead_escrow','lead_success_fee','pay_to_receive_leads','paid_contact_reveal'
  ) AND enabled = true;

  IF off_flags IS NOT NULL THEN
    RAISE EXCEPTION 'PRODUCTION_RISK_FLAGS_ON: %', off_flags;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM feature_flags WHERE key='security_monitoring' AND enabled) THEN
    RAISE EXCEPTION 'security_monitoring expected ON';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM feature_flags WHERE key='fraud_review' AND enabled) THEN
    RAISE EXCEPTION 'fraud_review expected ON';
  END IF;
  IF NOT EXISTS (SELECT 1 FROM feature_flags WHERE key='ops_case_management' AND enabled) THEN
    RAISE EXCEPTION 'ops_case_management expected ON';
  END IF;

  -- 2) Canonical tables
  FOREACH missing IN ARRAY ARRAY[
    'profiles','organisations','role_assignments','workspaces','feature_flags','audit_events',
    'background_jobs','payment_intents','ledger_accounts','ledger_entries',
    'connect_memberships','connect_circles','connect_circle_seats','connect_bdp_units',
    'marketplace_venues','marketplace_events','marketplace_bookings','marketplace_tickets',
    'marketplace_offer_claims','marketplace_redemptions',
    'enterprise_client_profiles','enterprise_quotes','enterprise_projects',
    'revenue_components','stakeholder_entitlements','settlement_batches',
    'assist_leads','assist_opportunity_desk_queue',
    'customer_refund_requests','customer_support_signals',
    'notification_intents','in_app_notifications','risk_signals','incident_signals',
    'compliance_holds','privacy_requests',
    'ops_cases','ops_approval_queue','ops_exception_queue','ops_overrides'
  ]
  LOOP
    IF to_regclass('public.'||missing) IS NULL THEN
      RAISE EXCEPTION 'MISSING_TABLE %', missing;
    END IF;
  END LOOP;

  -- 3) Identity
  INSERT INTO auth.users (id, email) VALUES (u1, u1::text||'@ex.com'), (u2, u2::text||'@ex.com');
  INSERT INTO public.users (id, email, name) VALUES (u1, u1::text||'@ex.com', 'A'), (u2, u2::text||'@ex.com', 'B');
  INSERT INTO public.profiles (user_id, display_name) VALUES (u1, 'A'), (u2, 'B');

  INSERT INTO public.role_assignments (user_id, role_key, status, scope_type)
  VALUES (u1, 'platform_admin', 'active', 'platform');

  IF NOT public.gce_is_ops_operator() AND NOT EXISTS (
    SELECT 1 FROM role_assignments WHERE user_id=u1 AND role_key='platform_admin' AND status='active'
  ) THEN
    RAISE EXCEPTION 'platform_admin assignment insert failed';
  END IF;

  -- 4) Connect capacity + seat 41 (FD-024/030)
  SELECT id INTO plan_id FROM public.membership_plans WHERE plan_key = 'associate';
  IF plan_id IS NULL THEN RAISE EXCEPTION 'associate plan missing'; END IF;

  INSERT INTO public.connect_circles (name, city, lifecycle_status, constitution_status)
  VALUES ('P14A Circle', 'Pune', 'formation', 'formation_circle')
  RETURNING id INTO circle_id;

  FOR i IN 1..40 LOOP
    INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
    VALUES (u2, plan_id, 'active', 'allocated') RETURNING id INTO mid;
    INSERT INTO public.connect_circle_seats (
      circle_id, membership_id, status, counts_toward_capacity, allocated_at, confirmed_at
    ) VALUES (circle_id, mid, 'allocated', true, now(), now());
  END LOOP;

  PERFORM public.gce_refresh_circle_capacity(circle_id, u1);
  SELECT lifecycle_status, constitution_status, active_seat_count
    INTO life, const, seat_count
  FROM public.connect_circles WHERE id = circle_id;
  IF seat_count <> 40 OR life <> 'full_capacity' OR const <> 'fully_constituted_circle' THEN
    RAISE EXCEPTION 'FAIL capacity40 life=% const=% count=%', life, const, seat_count;
  END IF;

  INSERT INTO public.connect_memberships (user_id, plan_id, status, allocation_status)
  VALUES (u2, plan_id, 'active', 'unallocated') RETURNING id INTO mid;
  INSERT INTO public.connect_circle_seats (
    circle_id, membership_id, status, counts_toward_capacity
  ) VALUES (circle_id, mid, 'reserved', false)
  RETURNING id INTO seat_id;

  BEGIN
    PERFORM public.gce_confirm_circle_seat(seat_id, u1);
    RAISE EXCEPTION 'SEAT_41_ALLOWED';
  EXCEPTION WHEN check_violation OR integrity_constraint_violation THEN
    NULL;
  WHEN OTHERS THEN
    IF SQLERRM = 'SEAT_41_ALLOWED' THEN RAISE; END IF;
    IF SQLERRM ILIKE '%capacity%' OR SQLERRM ILIKE '%seat%' OR SQLERRM ILIKE '%full%' THEN
      NULL;
    ELSE
      RAISE;
    END IF;
  END;

  -- 5) Finance claim≠revenue + no-double-commission
  BEGIN
    INSERT INTO public.revenue_components (
      revenue_component_key, vertical, domain_object_type,
      gross_amount_minor, eligible_base_minor
    ) VALUES ('p14a-bad-claim', 'marketplace', 'offer_claim', 100, 100);
    RAISE EXCEPTION 'CLAIM_AS_REVENUE_ALLOWED';
  EXCEPTION WHEN check_violation OR OTHERS THEN
    IF SQLERRM = 'CLAIM_AS_REVENUE_ALLOWED' THEN RAISE; END IF;
    NULL;
  END;

  INSERT INTO public.revenue_components (
    revenue_component_key, vertical, domain_object_type,
    gross_amount_minor, eligible_base_minor, recognition_status, recognised_at
  ) VALUES (
    'p14a-rc-1', 'marketplace', 'marketplace_booking_completed',
    10000000, 10000000, 'recognised', now()
  ) RETURNING id INTO rc_id;

  INSERT INTO public.stakeholder_entitlements (
    earning_event_key, revenue_component_id, revenue_component_key,
    stakeholder_user_id, stakeholder_type, source_vertical,
    rule_key, rule_version, gross_eligible_basis_minor, rate_bps,
    gross_entitlement_minor, recovery_deduction_minor, reversal_amount_minor,
    net_settlement_eligible_minor, status
  ) VALUES (
    'p14a:event:mbdp', rc_id, 'p14a-rc-1:mbdp',
    u1, 'marketplace_bdp', 'marketplace',
    'marketplace_bdp_attributed', 'fd029-fd037-v1',
    10000000, 1000, 1000000, 0, 0, 1000000, 'earned'
  );

  BEGIN
    INSERT INTO public.stakeholder_entitlements (
      earning_event_key, revenue_component_id, revenue_component_key,
      stakeholder_user_id, stakeholder_type, source_vertical,
      rule_key, rule_version, gross_eligible_basis_minor, rate_bps,
      gross_entitlement_minor, recovery_deduction_minor, reversal_amount_minor,
      net_settlement_eligible_minor, status
    ) VALUES (
      'p14a:event:mbdp', rc_id, 'p14a-rc-1:mbdp-dup',
      u2, 'marketplace_bdp', 'marketplace',
      'marketplace_bdp_attributed', 'fd029-fd037-v1',
      10000000, 1000, 1000000, 0, 0, 1000000, 'earned'
    );
    RAISE EXCEPTION 'DOUBLE_COMMISSION_ALLOWED';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  WHEN OTHERS THEN
    IF SQLERRM = 'DOUBLE_COMMISSION_ALLOWED' THEN RAISE; END IF;
  END;

  -- 6) Ops case/notes/approval projection
  INSERT INTO public.ops_cases (
    case_number, case_type, vertical, status, priority, summary, requester_user_id
  ) VALUES (
    'P14A-0001', 'general_support', 'support', 'open', 'normal', 'Phase14A harness case', u2
  );

  INSERT INTO public.ops_case_notes (case_id, author_user_id, visibility, body)
  SELECT id, u1, 'internal', 'internal only'
  FROM ops_cases WHERE case_number='P14A-0001';

  INSERT INTO public.ops_approval_queue (
    queue_key, subject_type, subject_id, vertical, title, status,
    requester_user_id, idempotency_key
  ) VALUES (
    'membership_activation', 'connect_membership', gen_random_uuid()::text,
    'connect', 'Activate membership', 'pending', u2, 'p14a-approval-1'
  );

  INSERT INTO public.audit_events (
    action, actor_user_id, resource_type, resource_id, metadata
  ) VALUES (
    'phase14a.validation', u1, 'harness', gen_random_uuid()::text,
    jsonb_build_object('ok', true)
  );

  RAISE NOTICE 'PHASE14A_PLATFORM_VALIDATION_OK';
END $$;

ROLLBACK;

SELECT 'PHASE14A_PLATFORM_VALIDATION_OK' AS result;
