-- Phase 4 — Identity, RBAC, Organisation (additive)
-- Authority: FD-023/032/034/035/036/038/039; ADR-001/002/003/005; SM_Role_Assignment
-- Target: gce-dev only from this pass. Does NOT touch production.
-- Does NOT drop legacy tables/enums. Does NOT grant entitlement from user_roles.

-- ---------------------------------------------------------------------------
-- Enum extensions (FD-035 / SM_Role_Assignment)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  ALTER TYPE public.assignment_status ADD VALUE IF NOT EXISTS 'terminated';
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE public.gce_role_key ADD VALUE IF NOT EXISTS 'enterprise_platform_expert';
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TYPE public.gce_role_key ADD VALUE IF NOT EXISTS 'opportunity_desk';
EXCEPTION
  WHEN duplicate_object THEN NULL;
  WHEN undefined_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Role assignment approval / suspension audit columns
-- ---------------------------------------------------------------------------

ALTER TABLE public.role_assignments
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approval_reason text,
  ADD COLUMN IF NOT EXISTS suspended_by uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS suspended_at timestamptz,
  ADD COLUMN IF NOT EXISTS suspend_reason text,
  ADD COLUMN IF NOT EXISTS terminated_by uuid REFERENCES public.users(id),
  ADD COLUMN IF NOT EXISTS terminated_at timestamptz,
  ADD COLUMN IF NOT EXISTS terminate_reason text;

CREATE INDEX IF NOT EXISTS idx_role_assignments_approved_by
  ON public.role_assignments (approved_by)
  WHERE approved_by IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_role_assignments_status_effective
  ON public.role_assignments (status, effective_from, effective_to);

-- ---------------------------------------------------------------------------
-- Platform-wide identity suspension (distinct from role suspension — FD-035)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.identity_suspension_status AS ENUM (
    'active',
    'lifted',
    'expired'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.identity_suspensions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status public.identity_suspension_status NOT NULL DEFAULT 'active',
  reason text NOT NULL,
  suspended_by uuid REFERENCES public.users(id),
  lifted_by uuid REFERENCES public.users(id),
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  lifted_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_identity_suspensions_user_status
  ON public.identity_suspensions (user_id, status);

DROP TRIGGER IF EXISTS trg_identity_suspensions_updated_at ON public.identity_suspensions;
CREATE TRIGGER trg_identity_suspensions_updated_at
  BEFORE UPDATE ON public.identity_suspensions
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Emergency / root break-glass (FD-035 / FD-039 — NOT ordinary Super Admin)
-- Server-path tables; RLS deny for authenticated; service-role managed.
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.emergency_access_status AS ENUM (
    'requested',
    'active',
    'revoked',
    'expired',
    'denied'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.emergency_access_grants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grantee_user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  status public.emergency_access_status NOT NULL DEFAULT 'requested',
  reason text NOT NULL,
  ticket_ref text,
  approved_by uuid REFERENCES public.users(id),
  revoked_by uuid REFERENCES public.users(id),
  effective_from timestamptz,
  effective_to timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT emergency_access_reason_min_len CHECK (char_length(btrim(reason)) >= 12)
);

CREATE INDEX IF NOT EXISTS idx_emergency_access_grantee_status
  ON public.emergency_access_grants (grantee_user_id, status);

DROP TRIGGER IF EXISTS trg_emergency_access_grants_updated_at ON public.emergency_access_grants;
CREATE TRIGGER trg_emergency_access_grants_updated_at
  BEFORE UPDATE ON public.emergency_access_grants
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.emergency_access_uses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  grant_id uuid NOT NULL REFERENCES public.emergency_access_grants(id) ON DELETE CASCADE,
  actor_user_id uuid NOT NULL REFERENCES public.users(id),
  action text NOT NULL,
  resource_type text,
  resource_id text,
  reason text NOT NULL,
  correlation_id text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT emergency_use_reason_min_len CHECK (char_length(btrim(reason)) >= 12)
);

CREATE INDEX IF NOT EXISTS idx_emergency_access_uses_grant
  ON public.emergency_access_uses (grant_id, created_at DESC);

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_is_identity_suspended(p_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.identity_suspensions s
    WHERE s.user_id = COALESCE(p_user_id, public.gce_current_user_id())
      AND s.status = 'active'
      AND (s.effective_to IS NULL OR s.effective_to > now())
  );
$$;

CREATE OR REPLACE FUNCTION public.gce_has_active_emergency_access(p_user_id uuid DEFAULT NULL)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.emergency_access_grants g
    WHERE g.grantee_user_id = COALESCE(p_user_id, public.gce_current_user_id())
      AND g.status = 'active'
      AND g.effective_from IS NOT NULL
      AND g.effective_from <= now()
      AND (g.effective_to IS NULL OR g.effective_to > now())
  );
$$;

-- Preserve prior admin check; identity suspension blocks normal privileged checks.
CREATE OR REPLACE FUNCTION public.gce_is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT NOT public.gce_is_identity_suspended(public.gce_current_user_id())
    AND (
      public.gce_has_active_assignment('platform_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('support_admin', 'platform', NULL)
    );
$$;

CREATE OR REPLACE FUNCTION public.gce_is_org_member(p_organisation_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.organisation_memberships m
    WHERE m.organisation_id = p_organisation_id
      AND m.user_id = public.gce_current_user_id()
      AND m.status = 'active'
      AND (m.effective_to IS NULL OR m.effective_to > now())
  );
$$;

-- ---------------------------------------------------------------------------
-- SoD / self-grant guards on role_assignments (DB backstop)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_role_assignments_sod_guard()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  actor uuid := public.gce_current_user_id();
  privileged boolean;
BEGIN
  -- Service role / no JWT: allow privileged server paths (application SoD still required).
  IF actor IS NULL THEN
    RETURN NEW;
  END IF;

  privileged := NEW.role_key IN (
    'platform_admin',
    'finance_admin',
    'compliance_admin',
    'support_admin',
    'enterprise_platform_expert'
  );

  IF TG_OP = 'INSERT' THEN
    IF NEW.user_id = actor AND privileged THEN
      RAISE EXCEPTION 'SoD: users may not self-grant privileged role assignments'
        USING ERRCODE = '42501';
    END IF;
    IF NEW.approved_by IS NOT NULL AND NEW.approved_by = NEW.user_id THEN
      RAISE EXCEPTION 'SoD: users may not self-approve role assignments'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  IF TG_OP = 'UPDATE' THEN
    IF NEW.status = 'active'
       AND (OLD.status IS DISTINCT FROM 'active')
       AND COALESCE(NEW.approved_by, actor) = NEW.user_id THEN
      RAISE EXCEPTION 'SoD: users may not self-activate role assignments'
        USING ERRCODE = '42501';
    END IF;
    IF NEW.approved_by IS NOT NULL AND NEW.approved_by = NEW.user_id THEN
      RAISE EXCEPTION 'SoD: users may not self-approve role assignments'
        USING ERRCODE = '42501';
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_role_assignments_sod ON public.role_assignments;
CREATE TRIGGER trg_role_assignments_sod
  BEFORE INSERT OR UPDATE ON public.role_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_role_assignments_sod_guard();

-- ---------------------------------------------------------------------------
-- Legacy user_roles quarantine — block NEW inactive commercial roles (FD-039)
-- Historical rows preserved; updates of existing rows allowed for audit cleanup.
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_user_roles_legacy_quarantine()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF NEW.role::text IN ('zbp', 'affiliate', 'franchisee', 'bdm') THEN
    RAISE EXCEPTION
      'Legacy role % is quarantined — do not create new entitlement shortcuts (FD-039). Use role_assignments.',
      NEW.role::text
      USING ERRCODE = '42501';
  END IF;
  RETURN NEW;
END;
$$;

DO $$
BEGIN
  IF to_regclass('public.user_roles') IS NOT NULL THEN
    DROP TRIGGER IF EXISTS trg_user_roles_legacy_quarantine ON public.user_roles;
    CREATE TRIGGER trg_user_roles_legacy_quarantine
      BEFORE INSERT ON public.user_roles
      FOR EACH ROW EXECUTE FUNCTION public.gce_user_roles_legacy_quarantine();
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- Workspace catalogue additions (ops surfaces for new role keys)
-- ---------------------------------------------------------------------------

INSERT INTO public.workspaces (workspace_key, label, role_key) VALUES
  ('personal', 'Personal', 'platform_user')
ON CONFLICT (workspace_key) DO NOTHING;

-- Keep existing workspace keys; new role keys map in app registry to existing shells.

UPDATE public.legacy_role_migration_map
SET
  mapping_status = CASE legacy_role
    WHEN 'zbp' THEN 'obsolete'
    WHEN 'affiliate' THEN 'quarantined'
    WHEN 'bdm' THEN 'unresolved'
    WHEN 'franchisee' THEN 'quarantined'
    ELSE mapping_status
  END,
  grants_entitlement = false,
  notes = CASE legacy_role
    WHEN 'zbp' THEN 'FD-039 inactive — Phase 4 quarantine on new user_roles inserts'
    WHEN 'affiliate' THEN 'FD-039 inactive — Phase 4 quarantine on new user_roles inserts'
    WHEN 'bdm' THEN 'Ambiguous — do not auto-map; Phase 4 quarantine on new inserts'
    WHEN 'franchisee' THEN 'Commercial construct only — not RBAC; Phase 4 quarantine on new inserts'
    ELSE notes
  END
WHERE legacy_role IN ('zbp', 'affiliate', 'bdm', 'franchisee');

INSERT INTO public.legacy_role_migration_map (
  legacy_role, canonical_role_key, mapping_status, grants_entitlement, notes
) VALUES
  ('cbdp', 'connect_bdp', 'mapped', false, 'Maps only with clear provenance; requires explicit assignment'),
  ('mbdp', 'marketplace_bdp', 'mapped', false, 'Maps only with clear provenance; requires explicit assignment'),
  ('super_admin', NULL, 'quarantined', false, 'Not an ordinary product role (FD-035/039)')
ON CONFLICT (legacy_role) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS — Phase 4 resources
-- ---------------------------------------------------------------------------

ALTER TABLE public.identity_suspensions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_access_grants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emergency_access_uses ENABLE ROW LEVEL SECURITY;

-- identity suspensions: subject can read own; admins manage
DROP POLICY IF EXISTS identity_suspensions_select ON public.identity_suspensions;
CREATE POLICY identity_suspensions_select ON public.identity_suspensions
  FOR SELECT TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
  );

DROP POLICY IF EXISTS identity_suspensions_admin_write ON public.identity_suspensions;
CREATE POLICY identity_suspensions_admin_write ON public.identity_suspensions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- Emergency tables: no broad authenticated access (server/service-role path only).
-- Admins may SELECT for investigation; mutations expect privileged client.
DROP POLICY IF EXISTS emergency_grants_admin_select ON public.emergency_access_grants;
CREATE POLICY emergency_grants_admin_select ON public.emergency_access_grants
  FOR SELECT TO authenticated
  USING (public.gce_is_platform_admin() OR grantee_user_id = public.gce_current_user_id());

DROP POLICY IF EXISTS emergency_grants_no_client_write ON public.emergency_access_grants;
-- Intentionally no INSERT/UPDATE/DELETE policies for authenticated → deny by default.

DROP POLICY IF EXISTS emergency_uses_admin_select ON public.emergency_access_uses;
CREATE POLICY emergency_uses_admin_select ON public.emergency_access_uses
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR actor_user_id = public.gce_current_user_id()
  );

-- Strengthen org visibility: members see fellow memberships in same org
DROP POLICY IF EXISTS org_memberships_select ON public.organisation_memberships;
CREATE POLICY org_memberships_select ON public.organisation_memberships
  FOR SELECT TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
    OR public.gce_is_org_member(organisation_id)
  );

-- Organisations: also visible via scoped venue/enterprise role assignments
DROP POLICY IF EXISTS organisations_select_member ON public.organisations;
CREATE POLICY organisations_select_member ON public.organisations
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR public.gce_is_org_member(id)
    OR EXISTS (
      SELECT 1
      FROM public.role_assignments ra
      WHERE ra.user_id = public.gce_current_user_id()
        AND ra.status = 'active'
        AND (ra.effective_to IS NULL OR ra.effective_to > now())
        AND ra.organisation_id = organisations.id
    )
  );

-- Audit remains append-oriented: no UPDATE/DELETE for authenticated
DROP POLICY IF EXISTS audit_events_update_deny ON public.audit_events;
DROP POLICY IF EXISTS audit_events_delete_deny ON public.audit_events;

COMMENT ON TABLE public.identity_suspensions IS
  'Platform-wide identity hold — distinct from role_assignment suspension (FD-035)';
COMMENT ON TABLE public.emergency_access_grants IS
  'Restricted break-glass capability — not Super Admin product role (FD-035/039)';
COMMENT ON TABLE public.emergency_access_uses IS
  'Append-oriented log of emergency capability uses';
COMMENT ON FUNCTION public.gce_role_assignments_sod_guard() IS
  'DB SoD backstop: no privileged self-grant / self-approval when JWT present';
COMMENT ON FUNCTION public.gce_user_roles_legacy_quarantine() IS
  'Blocks new zbp/affiliate/franchisee/bdm user_roles inserts (FD-039)';
