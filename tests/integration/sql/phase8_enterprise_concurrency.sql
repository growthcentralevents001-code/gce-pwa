-- Phase 8 Enterprise concurrency / invariant proofs
-- Uses existing users/orgs when present; rolls back all test data.

BEGIN;

DO $$
DECLARE
  u_bdp uuid;
  u_admin uuid;
  u_bdp2 uuid;
  org_id uuid;
BEGIN
  SELECT id INTO u_bdp FROM public.users ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO u_admin FROM public.users WHERE id <> u_bdp ORDER BY created_at NULLS LAST LIMIT 1;
  SELECT id INTO u_bdp2 FROM public.users WHERE id NOT IN (u_bdp, u_admin) ORDER BY created_at NULLS LAST LIMIT 1;
  IF u_bdp IS NULL OR u_admin IS NULL OR u_bdp2 IS NULL THEN
    RAISE EXCEPTION 'Need at least 3 users in DB for Phase 8 SQL harness';
  END IF;

  SELECT id INTO org_id FROM public.organisations ORDER BY created_at NULLS LAST LIMIT 1;
  IF org_id IS NULL THEN
    INSERT INTO public.organisations (id, legal_name)
    VALUES ('dddddddd-dddd-dddd-dddd-dddddddddddd', 'Phase8 Test Org')
    RETURNING id INTO org_id;
  END IF;

  INSERT INTO public.enterprise_bdp_packs (
    id, user_id, application_status, package_option,
    package_total_minor, initial_payment_minor, recoverable_balance_minor,
    remaining_recoverable_minor, recovered_to_date_minor, terms_accepted_at, activated_at,
    metadata
  ) VALUES (
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    u_bdp,
    'active',
    'finance_recovery_36000',
    3600000, 500000, 3100000, 3100000, 0,
    now(), now(),
    '{"second_pack_approved": true}'::jsonb
  );

  INSERT INTO public.enterprise_client_profiles (
    id, organisation_id, display_name, status
  ) VALUES (
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    org_id,
    'Phase8 Acme Enterprise',
    'active'
  );

  INSERT INTO public.enterprise_client_attributions (
    id, client_id, pack_id, bdp_user_id, status, approved_by, created_by, effective_from
  ) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    u_bdp,
    'active',
    u_admin,
    u_bdp2,
    now()
  );

  BEGIN
    INSERT INTO public.enterprise_client_attributions (
      client_id, pack_id, bdp_user_id, status, approved_by, created_by
    ) VALUES (
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
      u_bdp2,
      'active',
      u_admin,
      u_bdp
    );
    RAISE EXCEPTION 'EXPECTED_FAIL_overlapping_attribution';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  INSERT INTO public.enterprise_opportunities (
    id, client_id, title, status
  ) VALUES (
    '22222222-2222-2222-2222-222222222222',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'Annual conference',
    'quoting'
  );

  INSERT INTO public.enterprise_quotes (
    id, opportunity_id, client_id, quote_ref, total_proposed_minor,
    status, finance_cosign_required
  ) VALUES (
    '33333333-3333-3333-3333-333333333333',
    '22222222-2222-2222-2222-222222222222',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'EQ-TEST-5L-' || substr(gen_random_uuid()::text, 1, 8),
    50000001,
    'pending_finance_cosign',
    true
  );

  BEGIN
    UPDATE public.enterprise_quotes
    SET status = 'issued'
    WHERE id = '33333333-3333-3333-3333-333333333333';
    RAISE EXCEPTION 'EXPECTED_FAIL_issue_without_cosign';
  EXCEPTION WHEN check_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%Finance co-sign%' THEN
      NULL;
    ELSE
      RAISE;
    END IF;
  END;

  UPDATE public.enterprise_quotes SET
    finance_cosigned_by = u_admin,
    finance_cosigned_at = now(),
    status = 'finance_cosigned'
  WHERE id = '33333333-3333-3333-3333-333333333333';

  UPDATE public.enterprise_quotes SET
    status = 'issued',
    issued_by = u_admin,
    issued_at = now()
  WHERE id = '33333333-3333-3333-3333-333333333333';

  UPDATE public.enterprise_quotes SET
    status = 'accepted',
    accepted_by = u_admin,
    accepted_at = now()
  WHERE id = '33333333-3333-3333-3333-333333333333';

  INSERT INTO public.enterprise_projects (
    id, client_id, opportunity_id, accepted_quote_id, project_ref, title, status, commercial_total_minor
  ) VALUES (
    '44444444-4444-4444-4444-444444444444',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '22222222-2222-2222-2222-222222222222',
    '33333333-3333-3333-3333-333333333333',
    'EP-TEST-' || substr(gen_random_uuid()::text, 1, 8),
    'Acme Conference',
    'setup',
    50000001
  );

  BEGIN
    INSERT INTO public.enterprise_projects (
      client_id, accepted_quote_id, project_ref, title, commercial_total_minor
    ) VALUES (
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '33333333-3333-3333-3333-333333333333',
      'EP-TEST-DUP',
      'Dup',
      1
    );
    RAISE EXCEPTION 'EXPECTED_FAIL_duplicate_project';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  INSERT INTO public.enterprise_quotes (
    id, opportunity_id, client_id, quote_ref, total_proposed_minor,
    status, finance_cosign_required, finance_cosigned_by, finance_cosigned_at,
    issued_by, issued_at, accepted_by, accepted_at
  ) VALUES (
    '55555555-5555-5555-5555-555555555555',
    '22222222-2222-2222-2222-222222222222',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    'EQ-TEST-5L-' || substr(gen_random_uuid()::text, 1, 8),
    50000001,
    'accepted',
    true,
    u_admin,
    now(),
    u_admin,
    now(),
    u_admin,
    now()
  );

  BEGIN
    INSERT INTO public.enterprise_projects (
      client_id, opportunity_id, accepted_quote_id, project_ref, title, status, commercial_total_minor
    ) VALUES (
      'ffffffff-ffff-ffff-ffff-ffffffffffff',
      '22222222-2222-2222-2222-222222222222',
      '55555555-5555-5555-5555-555555555555',
      'EP-TEST-DUP-OPP',
      'Dup Opp Active',
      'setup',
      1
    );
    RAISE EXCEPTION 'EXPECTED_FAIL_duplicate_active_opportunity_project';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  END;

  INSERT INTO public.enterprise_milestones (project_id, name, percentage_bps, sort_order)
  VALUES
    ('44444444-4444-4444-4444-444444444444', 'Kickoff', 1000, 1),
    ('44444444-4444-4444-4444-444444444444', 'Delivery', 7000, 2),
    ('44444444-4444-4444-4444-444444444444', 'Close', 2000, 3);

  PERFORM public.gce_claim_revenue_component('rc-ent-1-phase8', 'enterprise', 'enterprise_bdp', NULL);

  BEGIN
    PERFORM public.gce_claim_revenue_component('rc-ent-1-phase8', 'marketplace', 'marketplace_bdp', NULL);
    RAISE EXCEPTION 'EXPECTED_FAIL_double_commission';
  EXCEPTION WHEN unique_violation THEN
    NULL;
  WHEN others THEN
    IF SQLERRM LIKE '%double commission%' THEN
      NULL;
    ELSE
      RAISE;
    END IF;
  END;

  INSERT INTO public.enterprise_vendors (business_name, login_enabled)
  VALUES ('Managed Vendor Co Phase8', false);

  BEGIN
    INSERT INTO public.enterprise_vendors (business_name, login_enabled)
    VALUES ('Bad Portal Vendor Phase8', true);
    RAISE EXCEPTION 'EXPECTED_FAIL_vendor_login';
  EXCEPTION WHEN check_violation THEN
    NULL;
  END;
END $$;

SELECT 'PHASE8_ENTERPRISE_OK' AS result;

ROLLBACK;
