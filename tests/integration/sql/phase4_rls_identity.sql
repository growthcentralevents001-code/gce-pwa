-- Phase 4 RLS / SoD / legacy quarantine scenarios
-- Run against isolated local Postgres (not production).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION test_set_user(uid uuid)
RETURNS void LANGUAGE plpgsql AS $$
BEGIN
  PERFORM set_config('request.jwt.claim.sub', uid::text, true);
  EXECUTE format('SET LOCAL ROLE authenticated');
END;
$$;

DO $$
DECLARE
  u1 uuid := 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa';
  u2 uuid := 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb';
  admin uuid := 'cccccccc-cccc-cccc-cccc-cccccccccccc';
  org1 uuid;
  org2 uuid;
  seen int;
BEGIN
  RESET ROLE;

  INSERT INTO public.users (id, email) VALUES
    (u1, 'p4-u1@example.com'),
    (u2, 'p4-u2@example.com'),
    (admin, 'p4-admin@example.com')
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.profiles (user_id, display_name) VALUES
    (u1, 'P4 User One'),
    (u2, 'P4 User Two'),
    (admin, 'P4 Admin')
  ON CONFLICT (user_id) DO UPDATE SET display_name = EXCLUDED.display_name;

  INSERT INTO public.role_assignments (user_id, role_key, status, scope_type, granted_by, approved_by)
  VALUES (admin, 'platform_admin', 'active', 'platform', admin, NULL);

  INSERT INTO public.organisations (legal_name, kind, status)
  VALUES ('Org Alpha', 'venue_partner', 'active')
  RETURNING id INTO org1;

  INSERT INTO public.organisations (legal_name, kind, status)
  VALUES ('Org Beta', 'enterprise_client', 'active')
  RETURNING id INTO org2;

  INSERT INTO public.organisation_memberships (organisation_id, user_id, membership_role, status)
  VALUES
    (org1, u1, 'representative', 'active'),
    (org2, u2, 'representative', 'active');

  -- u1 cannot read u2 profile
  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.profiles WHERE user_id = u2;
  IF seen <> 0 THEN
    RAISE EXCEPTION 'FAIL: cross-profile read allowed';
  END IF;

  -- u1 can read own profile
  SELECT count(*) INTO seen FROM public.profiles WHERE user_id = u1;
  IF seen <> 1 THEN
    RAISE EXCEPTION 'FAIL: own profile not readable';
  END IF;

  -- org isolation: u1 cannot see org2
  SELECT count(*) INTO seen FROM public.organisations WHERE id = org2;
  IF seen <> 0 THEN
    RAISE EXCEPTION 'FAIL: cross-org visibility leak';
  END IF;

  SELECT count(*) INTO seen FROM public.organisations WHERE id = org1;
  IF seen <> 1 THEN
    RAISE EXCEPTION 'FAIL: own org not visible';
  END IF;

  -- workspace prefs ownership
  INSERT INTO public.user_workspace_preferences (user_id, last_workspace_key)
  VALUES (u1, 'personal')
  ON CONFLICT (user_id) DO UPDATE SET last_workspace_key = 'personal';

  SELECT count(*) INTO seen FROM public.user_workspace_preferences WHERE user_id = u2;
  IF seen <> 0 THEN
    RAISE EXCEPTION 'FAIL: can see other workspace prefs';
  END IF;

  -- self-grant privileged role denied when JWT present
  BEGIN
    INSERT INTO public.role_assignments (user_id, role_key, status, scope_type, granted_by)
    VALUES (u1, 'platform_admin', 'pending', 'platform', u1);
    RAISE EXCEPTION 'FAIL: privileged self-grant allowed';
  EXCEPTION WHEN insufficient_privilege OR check_violation OR integrity_constraint_violation THEN
    NULL;
  WHEN OTHERS THEN
    IF SQLERRM LIKE 'SoD:%' THEN
      NULL;
    ELSE
      RAISE;
    END IF;
  END;

  -- role assignment visibility: u1 sees own only
  RESET ROLE;
  INSERT INTO public.role_assignments (user_id, role_key, status, scope_type, granted_by)
  VALUES (u1, 'circle_member', 'active', 'platform', admin);

  PERFORM test_set_user(u1);
  SELECT count(*) INTO seen FROM public.role_assignments WHERE user_id = admin;
  IF seen <> 0 THEN
    RAISE EXCEPTION 'FAIL: can see admin assignments';
  END IF;

  -- Legacy quarantine: new zbp/affiliate/bdm/franchisee insert blocked when table exists (gce-dev).
  -- Clean Phase 2–13 rebuild does not create public.user_roles (legacy compatibility surface).
  RESET ROLE;
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    BEGIN
      INSERT INTO public.user_roles (user_id, role) VALUES (u1, 'zbp');
      RAISE EXCEPTION 'FAIL: legacy zbp insert allowed';
    EXCEPTION WHEN insufficient_privilege OR check_violation OR integrity_constraint_violation THEN
      NULL;
    WHEN OTHERS THEN
      IF SQLERRM ILIKE '%quarantined%' OR SQLERRM ILIKE '%zbp%' THEN
        NULL;
      ELSE
        RAISE;
      END IF;
    END;

    BEGIN
      INSERT INTO public.user_roles (user_id, role) VALUES (u1, 'affiliate');
      RAISE EXCEPTION 'FAIL: legacy affiliate insert allowed';
    EXCEPTION WHEN OTHERS THEN
      IF SQLERRM ILIKE '%FAIL:%' THEN RAISE; END IF;
    END;

    BEGIN
      INSERT INTO public.user_roles (user_id, role) VALUES (u1, 'bdm');
      RAISE EXCEPTION 'FAIL: legacy bdm insert allowed';
    EXCEPTION WHEN OTHERS THEN
      IF SQLERRM ILIKE '%FAIL:%' THEN RAISE; END IF;
    END;

    BEGIN
      INSERT INTO public.user_roles (user_id, role) VALUES (u1, 'franchisee');
      RAISE EXCEPTION 'FAIL: legacy franchisee insert allowed';
    EXCEPTION WHEN OTHERS THEN
      IF SQLERRM ILIKE '%FAIL:%' THEN RAISE; END IF;
    END;
  ELSE
    RAISE NOTICE 'phase4_legacy_user_roles_absent_on_clean_rebuild';
  END IF;

  -- emergency grants not writable by authenticated
  PERFORM test_set_user(admin);
  BEGIN
    INSERT INTO public.emergency_access_grants (grantee_user_id, status, reason, approved_by, effective_from, effective_to)
    VALUES (u1, 'active', 'emergency reason long enough', admin, now(), now() + interval '1 hour');
    RAISE EXCEPTION 'FAIL: authenticated emergency grant insert allowed';
  EXCEPTION WHEN insufficient_privilege THEN
    NULL;
  WHEN OTHERS THEN
    IF SQLERRM ILIKE '%FAIL:%' THEN RAISE; END IF;
  END;

  RESET ROLE;
  PERFORM 1;
END;
$$;

SELECT 'PHASE4_RLS_OK' AS phase4_rls_status;
