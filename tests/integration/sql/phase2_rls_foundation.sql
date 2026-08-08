-- Phase 2 foundation RLS scenarios (ADR-005)
-- Run against isolated local Postgres, not production.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

GRANT USAGE ON SCHEMA auth TO authenticated, anon, service_role;
GRANT EXECUTE ON FUNCTION auth.uid() TO authenticated, anon, service_role;

-- helper: set jwt sub for RLS
CREATE OR REPLACE FUNCTION test_set_user(uid uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('request.jwt.claim.sub', uid::text, true);
  EXECUTE format('SET LOCAL ROLE authenticated');
END;
$$;

DO $$
DECLARE
  u1 uuid := '11111111-1111-4111-8111-111111111111';
  u2 uuid := '22222222-2222-4222-8222-222222222222';
  org1 uuid;
  ra1 uuid;
  seen int;
BEGIN
  -- seed as superuser / table owner
  RESET ROLE;
  INSERT INTO public.users (id, email) VALUES
    (u1, 'u1@example.com'),
    (u2, 'u2@example.com')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (user_id, display_name) VALUES
    (u1, 'User One'),
    (u2, 'User Two')
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.organisations (id, kind, status, legal_name)
  VALUES (gen_random_uuid(), 'venue_partner', 'active', 'Venue Org A')
  RETURNING id INTO org1;

  INSERT INTO public.organisation_memberships (organisation_id, user_id, membership_role, status)
  VALUES (org1, u1, 'owner', 'active');

  INSERT INTO public.role_assignments (id, user_id, role_key, status, scope_type)
  VALUES (gen_random_uuid(), u1, 'venue_representative', 'active', 'organisation')
  RETURNING id INTO ra1;

  INSERT INTO public.user_workspace_preferences (user_id, last_workspace_key, default_workspace_key)
  VALUES (u1, 'venue', 'venue')
  ON CONFLICT (user_id) DO UPDATE SET last_workspace_key = 'venue';

  INSERT INTO public.audit_events (actor_user_id, action, resource_type, resource_id)
  VALUES (u1, 'test.action', 'test', '1');

  INSERT INTO public.payment_intents (provider, amount_minor, currency, payer_user_id, status, business_purpose)
  VALUES ('razorpay_candidate', 1000, 'INR', u1, 'created', 'phase2_rls_test');

  -- Grant table privileges expected by Supabase roles
  GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO authenticated;
  GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO authenticated;
  GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon;

  -- PROFILE self-access
  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.profiles WHERE user_id = u1;
  IF seen <> 1 THEN RAISE EXCEPTION 'u1 should read own profile'; END IF;

  SELECT count(*) INTO seen FROM public.profiles WHERE user_id = u2;
  IF seen <> 0 THEN RAISE EXCEPTION 'u1 must not read u2 profile'; END IF;

  -- ORG membership isolation
  SELECT count(*) INTO seen FROM public.organisations;
  IF seen < 1 THEN RAISE EXCEPTION 'u1 should see member org'; END IF;

  PERFORM test_set_user(u2);
  SELECT count(*) INTO seen FROM public.organisations;
  IF seen <> 0 THEN RAISE EXCEPTION 'u2 must not see u1 org'; END IF;

  -- ROLE assignments visibility
  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.role_assignments WHERE user_id = u1;
  IF seen < 1 THEN RAISE EXCEPTION 'u1 should see own assignments'; END IF;

  PERFORM test_set_user(u2);
  SELECT count(*) INTO seen FROM public.role_assignments WHERE user_id = u1;
  IF seen <> 0 THEN RAISE EXCEPTION 'u2 must not see u1 assignments'; END IF;

  -- Workspace prefs ownership
  PERFORM test_set_user(u2);
  SELECT count(*) INTO seen FROM public.user_workspace_preferences WHERE user_id = u1;
  IF seen <> 0 THEN RAISE EXCEPTION 'u2 must not read u1 workspace prefs'; END IF;

  -- Feature flags readable; not writable by normal user
  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.feature_flags;
  IF seen < 1 THEN RAISE EXCEPTION 'authenticated should read feature flags'; END IF;
  UPDATE public.feature_flags SET enabled = true WHERE key = 'wallet_cashout';
  GET DIAGNOSTICS seen = ROW_COUNT;
  IF seen <> 0 THEN
    RAISE EXCEPTION 'non-admin must not update feature flags (rows=%)', seen;
  END IF;
  -- Ensure still false
  RESET ROLE;
  IF EXISTS (SELECT 1 FROM feature_flags WHERE key = 'wallet_cashout' AND enabled) THEN
    RAISE EXCEPTION 'wallet_cashout must remain OFF';
  END IF;

  -- Audit immutability: no update/delete policies for authenticated
  PERFORM test_set_user(u1);
  BEGIN
    DELETE FROM public.audit_events;
    -- if delete succeeds with 0 policies, postgres allows owner-bypass; as SET ROLE authenticated should deny if FORCE ROW LEVEL SECURITY or no privilege
  EXCEPTION WHEN OTHERS THEN
    NULL;
  END;
  SELECT count(*) INTO seen FROM public.audit_events;
  -- After role reset count as owner
  RESET ROLE;
  SELECT count(*) INTO seen FROM public.audit_events;
  IF seen < 1 THEN RAISE EXCEPTION 'audit events must not be deletable by authenticated path'; END IF;

  -- Payment intent isolation
  PERFORM test_set_user(u2);
  SELECT count(*) INTO seen FROM public.payment_intents;
  IF seen <> 0 THEN RAISE EXCEPTION 'u2 must not see u1 payment intents'; END IF;

  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.payment_intents;
  IF seen < 1 THEN RAISE EXCEPTION 'u1 should see own payment intents'; END IF;

  -- Webhook + ledger deny for normal user
  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.payment_webhook_events;
  IF seen <> 0 THEN RAISE EXCEPTION 'normal user must not read webhook events'; END IF;
  SELECT count(*) INTO seen FROM public.ledger_entries;
  IF seen <> 0 THEN RAISE EXCEPTION 'normal user must not read ledger entries'; END IF;

  -- Anonymous deny
  RESET ROLE;
  SET LOCAL ROLE anon;
  SELECT count(*) INTO seen FROM public.profiles;
  IF seen <> 0 THEN RAISE EXCEPTION 'anon must not read profiles'; END IF;

  RESET ROLE;
  RAISE NOTICE 'PHASE2_RLS_OK';
END $$;

SELECT 'PHASE2_RLS_OK' AS phase2_rls_status;
