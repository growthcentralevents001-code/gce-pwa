-- Phase 2 architecture foundation (additive)
-- Authority: ADR-004/005/002/003/007/010/013; FD-023/035/039
-- Does NOT drop or rename legacy tables/enums.
-- Does NOT grant automatic commercial entitlement from legacy user_role values.

-- ---------------------------------------------------------------------------
-- Helpers
-- ---------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE OR REPLACE FUNCTION public.gce_set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Legacy GCE convention: public.users.id matches auth.users.id (no separate auth_user_id column).
CREATE OR REPLACE FUNCTION public.gce_current_user_id()
RETURNS uuid
LANGUAGE sql
STABLE
AS $$
  SELECT auth.uid();
$$;

-- ---------------------------------------------------------------------------
-- Profiles (extends permanent User identity; does not encode roles)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.profiles (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  display_name text,
  legal_name text,
  phone text,
  avatar_url text,
  locale text DEFAULT 'en-IN',
  timezone text DEFAULT 'Asia/Kolkata',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_profiles_updated_at ON public.profiles;
CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Organisations
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.organisation_kind AS ENUM (
    'platform_legal_entity',
    'venue_partner',
    'enterprise_client',
    'business_professional',
    'vendor',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.organisation_status AS ENUM (
    'draft',
    'active',
    'suspended',
    'archived'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.organisations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.organisation_kind NOT NULL DEFAULT 'other',
  status public.organisation_status NOT NULL DEFAULT 'draft',
  legal_name text NOT NULL,
  trading_name text,
  registration_number text,
  gstin text,
  country_code text NOT NULL DEFAULT 'IN',
  primary_city text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_by uuid REFERENCES public.users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_organisations_updated_at ON public.organisations;
CREATE TRIGGER trg_organisations_updated_at
  BEFORE UPDATE ON public.organisations
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

DO $$ BEGIN
  CREATE TYPE public.org_membership_role AS ENUM (
    'owner',
    'admin',
    'representative',
    'member',
    'billing_contact',
    'viewer'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.org_membership_status AS ENUM (
    'invited',
    'active',
    'suspended',
    'revoked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.organisation_memberships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid NOT NULL REFERENCES public.organisations(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  membership_role public.org_membership_role NOT NULL DEFAULT 'member',
  status public.org_membership_status NOT NULL DEFAULT 'invited',
  is_primary boolean NOT NULL DEFAULT false,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (organisation_id, user_id, membership_role)
);

DROP TRIGGER IF EXISTS trg_organisation_memberships_updated_at ON public.organisation_memberships;
CREATE TRIGGER trg_organisation_memberships_updated_at
  BEFORE UPDATE ON public.organisation_memberships
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- ---------------------------------------------------------------------------
-- Canonical role keys + assignments (FD-035)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.gce_role_key AS ENUM (
    'platform_user',
    'circle_member',
    'connect_bdp',
    'marketplace_bdp',
    'enterprise_bdp',
    'enterprise_client_representative',
    'venue_representative',
    'governing_body_member',
    'circle_finance_coordinator',
    'sergeant_at_arms',
    'relationship_manager',
    'platform_relationship_manager',
    'platform_admin',
    'finance_admin',
    'compliance_admin',
    'support_admin'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assignment_status AS ENUM (
    'pending',
    'active',
    'suspended',
    'expired',
    'revoked'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.assignment_scope_type AS ENUM (
    'platform',
    'legal_entity',
    'vertical',
    'city',
    'circle',
    'unit',
    'venue',
    'organisation',
    'client',
    'project',
    'department',
    'case',
    'lead',
    'temporary_ops'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.role_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_key public.gce_role_key NOT NULL,
  status public.assignment_status NOT NULL DEFAULT 'pending',
  scope_type public.assignment_scope_type NOT NULL DEFAULT 'platform',
  scope_id uuid,
  organisation_id uuid REFERENCES public.organisations(id),
  title text,
  granted_by uuid REFERENCES public.users(id),
  revoked_by uuid REFERENCES public.users(id),
  revoke_reason text,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_role_assignments_user_status
  ON public.role_assignments (user_id, status);
CREATE INDEX IF NOT EXISTS idx_role_assignments_role_scope
  ON public.role_assignments (role_key, scope_type, scope_id);
CREATE INDEX IF NOT EXISTS idx_role_assignments_org
  ON public.role_assignments (organisation_id);

DROP TRIGGER IF EXISTS trg_role_assignments_updated_at ON public.role_assignments;
CREATE TRIGGER trg_role_assignments_updated_at
  BEFORE UPDATE ON public.role_assignments
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Historical assignment events (append-oriented)
CREATE TABLE IF NOT EXISTS public.role_assignment_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  assignment_id uuid NOT NULL REFERENCES public.role_assignments(id) ON DELETE CASCADE,
  event_type text NOT NULL,
  from_status public.assignment_status,
  to_status public.assignment_status,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Workspaces (operational contexts — not accounts)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.workspaces (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_key text NOT NULL UNIQUE,
  label text NOT NULL,
  role_key public.gce_role_key,
  is_active boolean NOT NULL DEFAULT true,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_workspaces_updated_at ON public.workspaces;
CREATE TRIGGER trg_workspaces_updated_at
  BEFORE UPDATE ON public.workspaces
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

INSERT INTO public.workspaces (workspace_key, label, role_key) VALUES
  ('personal', 'Personal', 'platform_user'),
  ('connect-member', 'Connect Member', 'circle_member'),
  ('connect-bdp', 'Connect BDP', 'connect_bdp'),
  ('marketplace-bdp', 'Marketplace BDP', 'marketplace_bdp'),
  ('venue', 'Venue Partner', 'venue_representative'),
  ('enterprise-bdp', 'Enterprise BDP', 'enterprise_bdp'),
  ('enterprise-client', 'Enterprise Client', 'enterprise_client_representative'),
  ('platform-ops', 'Platform Operations', 'platform_admin'),
  ('finance', 'Finance', 'finance_admin'),
  ('compliance', 'Compliance', 'compliance_admin'),
  ('support', 'Support', 'support_admin')
ON CONFLICT (workspace_key) DO NOTHING;

CREATE TABLE IF NOT EXISTS public.user_workspace_preferences (
  user_id uuid PRIMARY KEY REFERENCES public.users(id) ON DELETE CASCADE,
  last_workspace_key text REFERENCES public.workspaces(workspace_key),
  preferences jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Feature flags (inactive by default for Part J / money gates)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.feature_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  description text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_by uuid REFERENCES public.users(id),
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('marketplace_affiliate', false, 'FD-039 inactive — Marketplace Affiliate commercial activation'),
  ('zbp_commercial', false, 'FD-039 inactive — ZBP commercial model'),
  ('core_direct_purchase', false, 'FD-039 inactive — Core Tier direct purchase'),
  ('paid_lead_assist', false, 'FD-039 inactive — paid Lead Assist / escrow / success-fee'),
  ('wallet_cashout', false, 'FD-039 inactive — wallet cash-out / consumer withdrawals'),
  ('vendor_self_service', false, 'FD-039 inactive — Vendor self-serve login'),
  ('native_apps', false, 'FD-039 inactive — native iOS/Android'),
  ('international', false, 'FD-039 inactive — international expansion'),
  ('multi_currency', false, 'FD-039 inactive — multi-currency go-live'),
  ('partner_lead_api', false, 'FD-039 inactive — partner lead-ingest API'),
  ('premium_listings', false, 'FD-039 inactive — advertising/premium listings SKUs'),
  ('referral_rewards', false, 'FD-039 inactive — referral reward programmes with rates'),
  ('marketplace_ticket_payments', false, 'Money gate — Marketplace ticket collection until MoR validation'),
  ('settlement_execution', false, 'Money gate — settlement execution until compliance ready'),
  ('bdp_pack_payments', false, 'Money gate — BDP pack production collection'),
  ('offline_bdp_pack_payments', false, 'Controlled Admin offline bank path — production gated')
ON CONFLICT (key) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Audit events (append-only for app roles)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.audit_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  occurred_at timestamptz NOT NULL DEFAULT now(),
  actor_user_id uuid REFERENCES public.users(id),
  actor_assignment_id uuid REFERENCES public.role_assignments(id),
  workspace_key text,
  action text NOT NULL,
  resource_type text NOT NULL,
  resource_id text,
  before_data jsonb,
  after_data jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  reason text,
  source text NOT NULL DEFAULT 'app',
  correlation_id text,
  request_id text,
  is_manual_override boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_audit_events_actor ON public.audit_events (actor_user_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_events_resource ON public.audit_events (resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_events_correlation ON public.audit_events (correlation_id);

-- ---------------------------------------------------------------------------
-- Payment webhook / intent skeleton (no production money)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.payment_provider AS ENUM ('razorpay_candidate', 'manual_admin', 'other');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.payment_intent_status AS ENUM (
    'created',
    'requires_action',
    'processing',
    'succeeded',
    'failed',
    'cancelled',
    'refund_pending',
    'refunded',
    'partially_refunded'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.payment_intents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider public.payment_provider NOT NULL DEFAULT 'razorpay_candidate',
  status public.payment_intent_status NOT NULL DEFAULT 'created',
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency text NOT NULL DEFAULT 'INR',
  business_purpose text NOT NULL,
  vertical text,
  payer_user_id uuid REFERENCES public.users(id),
  organisation_id uuid REFERENCES public.organisations(id),
  external_reference text,
  idempotency_key text UNIQUE,
  feature_gate_key text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_payment_intents_updated_at ON public.payment_intents;
CREATE TRIGGER trg_payment_intents_updated_at
  BEFORE UPDATE ON public.payment_intents
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.payment_webhook_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider public.payment_provider NOT NULL,
  provider_event_id text,
  idempotency_key text NOT NULL UNIQUE,
  signature_valid boolean,
  payload jsonb NOT NULL,
  processing_status text NOT NULL DEFAULT 'received',
  error_message text,
  correlation_id text,
  received_at timestamptz NOT NULL DEFAULT now(),
  processed_at timestamptz
);

CREATE INDEX IF NOT EXISTS idx_payment_webhook_events_provider_event
  ON public.payment_webhook_events (provider, provider_event_id);

-- ---------------------------------------------------------------------------
-- Financial ledger foundation (FD-020 principles; no tax rates)
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.ledger_account_kind AS ENUM (
    'customer_wallet',
    'escrow',
    'settlement_payable',
    'commission_payable',
    'platform_revenue',
    'tax_payable',
    'refund_liability',
    'franchise_recovery',
    'clearing',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS public.ledger_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  kind public.ledger_account_kind NOT NULL,
  owner_user_id uuid REFERENCES public.users(id),
  organisation_id uuid REFERENCES public.organisations(id),
  currency text NOT NULL DEFAULT 'INR',
  label text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.financial_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_key text NOT NULL UNIQUE,
  business_source text NOT NULL,
  vertical text,
  currency text NOT NULL DEFAULT 'INR',
  external_reference text,
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  rule_version text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.users(id)
);

CREATE TABLE IF NOT EXISTS public.ledger_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  financial_transaction_id uuid NOT NULL REFERENCES public.financial_transactions(id) ON DELETE CASCADE,
  ledger_account_id uuid NOT NULL REFERENCES public.ledger_accounts(id),
  direction text NOT NULL CHECK (direction IN ('debit', 'credit')),
  amount_minor bigint NOT NULL CHECK (amount_minor >= 0),
  currency text NOT NULL DEFAULT 'INR',
  entitlement_ref text,
  settlement_ref text,
  reversal_of_entry_id uuid REFERENCES public.ledger_entries(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_ledger_entries_txn ON public.ledger_entries (financial_transaction_id);
CREATE INDEX IF NOT EXISTS idx_ledger_entries_account ON public.ledger_entries (ledger_account_id);

-- ---------------------------------------------------------------------------
-- Legacy role quarantine map (no automatic entitlement)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.legacy_role_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_role text NOT NULL,
  canonical_role_key public.gce_role_key,
  mapping_status text NOT NULL DEFAULT 'unresolved'
    CHECK (mapping_status IN ('mapped', 'quarantined', 'unresolved', 'obsolete')),
  grants_entitlement boolean NOT NULL DEFAULT false,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (legacy_role)
);

INSERT INTO public.legacy_role_migration_map (legacy_role, canonical_role_key, mapping_status, grants_entitlement, notes) VALUES
  ('admin', 'platform_admin', 'mapped', false, 'Map only after explicit admin re-grant under assignments; no auto entitlement'),
  ('member', 'circle_member', 'mapped', false, 'Requires verified membership assignment; enum alone insufficient'),
  ('venue', 'venue_representative', 'mapped', false, 'Requires organisation/venue scope assignment'),
  ('enterprise', NULL, 'unresolved', false, 'Ambiguous: Enterprise BDP vs Client — do not auto-map'),
  ('zbp', NULL, 'obsolete', false, 'FD-039 ZBP commercial inactive'),
  ('affiliate', NULL, 'quarantined', false, 'FD-039 Marketplace Affiliate inactive'),
  ('bdm', NULL, 'unresolved', false, 'Ambiguous legacy; do not auto-map to Marketplace BDP'),
  ('franchisee', NULL, 'quarantined', false, 'Franchise Unit is commercial construct not automatic RBAC role')
ON CONFLICT (legacy_role) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS helpers + policies (deny-by-default)
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_has_active_assignment(
  p_role public.gce_role_key DEFAULT NULL,
  p_scope_type public.assignment_scope_type DEFAULT NULL,
  p_scope_id uuid DEFAULT NULL
)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.role_assignments ra
    WHERE ra.user_id = public.gce_current_user_id()
      AND ra.status = 'active'
      AND (ra.effective_to IS NULL OR ra.effective_to > now())
      AND (p_role IS NULL OR ra.role_key = p_role)
      AND (p_scope_type IS NULL OR ra.scope_type = p_scope_type)
      AND (p_scope_id IS NULL OR ra.scope_id = p_scope_id)
  );
$$;

CREATE OR REPLACE FUNCTION public.gce_is_platform_admin()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.gce_has_active_assignment('platform_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('finance_admin', 'platform', NULL)
      OR public.gce_has_active_assignment('compliance_admin', 'platform', NULL);
$$;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.organisation_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_assignment_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_workspace_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feature_flags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_intents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_webhook_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ledger_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_role_migration_map ENABLE ROW LEVEL SECURITY;

-- profiles
DROP POLICY IF EXISTS profiles_select_own ON public.profiles;
CREATE POLICY profiles_select_own ON public.profiles
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS profiles_update_own ON public.profiles;
CREATE POLICY profiles_update_own ON public.profiles
  FOR UPDATE TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS profiles_insert_own ON public.profiles;
CREATE POLICY profiles_insert_own ON public.profiles
  FOR INSERT TO authenticated
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

-- organisations / memberships
DROP POLICY IF EXISTS organisations_select_member ON public.organisations;
CREATE POLICY organisations_select_member ON public.organisations
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.organisation_memberships m
      WHERE m.organisation_id = organisations.id
        AND m.user_id = public.gce_current_user_id()
        AND m.status = 'active'
    )
  );

DROP POLICY IF EXISTS organisations_write_admin ON public.organisations;
CREATE POLICY organisations_write_admin ON public.organisations
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS org_memberships_select ON public.organisation_memberships;
CREATE POLICY org_memberships_select ON public.organisation_memberships
  FOR SELECT TO authenticated
  USING (
    user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
  );

DROP POLICY IF EXISTS org_memberships_admin_write ON public.organisation_memberships;
CREATE POLICY org_memberships_admin_write ON public.organisation_memberships
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- role assignments
DROP POLICY IF EXISTS role_assignments_select_own ON public.role_assignments;
CREATE POLICY role_assignments_select_own ON public.role_assignments
  FOR SELECT TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS role_assignments_admin_write ON public.role_assignments;
CREATE POLICY role_assignments_admin_write ON public.role_assignments
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS role_assignment_events_select ON public.role_assignment_events;
CREATE POLICY role_assignment_events_select ON public.role_assignment_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_platform_admin()
    OR EXISTS (
      SELECT 1 FROM public.role_assignments ra
      WHERE ra.id = role_assignment_events.assignment_id
        AND ra.user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS role_assignment_events_insert_admin ON public.role_assignment_events;
CREATE POLICY role_assignment_events_insert_admin ON public.role_assignment_events
  FOR INSERT TO authenticated
  WITH CHECK (public.gce_is_platform_admin());

-- workspaces catalogue readable; preferences own-only
DROP POLICY IF EXISTS workspaces_select_all_auth ON public.workspaces;
CREATE POLICY workspaces_select_all_auth ON public.workspaces
  FOR SELECT TO authenticated
  USING (is_active = true OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS workspace_prefs_own ON public.user_workspace_preferences;
CREATE POLICY workspace_prefs_own ON public.user_workspace_preferences
  FOR ALL TO authenticated
  USING (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin())
  WITH CHECK (user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

-- feature flags: read all authenticated; write platform admin
DROP POLICY IF EXISTS feature_flags_select ON public.feature_flags;
CREATE POLICY feature_flags_select ON public.feature_flags
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS feature_flags_admin_write ON public.feature_flags;
CREATE POLICY feature_flags_admin_write ON public.feature_flags
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

-- audit: insert via trusted paths; select own or admin; no update/delete for authenticated
DROP POLICY IF EXISTS audit_events_select ON public.audit_events;
CREATE POLICY audit_events_select ON public.audit_events
  FOR SELECT TO authenticated
  USING (actor_user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS audit_events_insert ON public.audit_events;
CREATE POLICY audit_events_insert ON public.audit_events
  FOR INSERT TO authenticated
  WITH CHECK (
    actor_user_id = public.gce_current_user_id()
    OR public.gce_is_platform_admin()
  );

-- payments / ledger: highly restricted
DROP POLICY IF EXISTS payment_intents_select ON public.payment_intents;
CREATE POLICY payment_intents_select ON public.payment_intents
  FOR SELECT TO authenticated
  USING (payer_user_id = public.gce_current_user_id() OR public.gce_is_platform_admin());

DROP POLICY IF EXISTS payment_intents_admin_write ON public.payment_intents;
CREATE POLICY payment_intents_admin_write ON public.payment_intents
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS payment_webhooks_admin ON public.payment_webhook_events;
CREATE POLICY payment_webhooks_admin ON public.payment_webhook_events
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS ledger_accounts_admin ON public.ledger_accounts;
CREATE POLICY ledger_accounts_admin ON public.ledger_accounts
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS financial_transactions_admin ON public.financial_transactions;
CREATE POLICY financial_transactions_admin ON public.financial_transactions
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS ledger_entries_admin ON public.ledger_entries;
CREATE POLICY ledger_entries_admin ON public.ledger_entries
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

DROP POLICY IF EXISTS legacy_map_select ON public.legacy_role_migration_map;
CREATE POLICY legacy_map_select ON public.legacy_role_migration_map
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS legacy_map_admin_write ON public.legacy_role_migration_map;
CREATE POLICY legacy_map_admin_write ON public.legacy_role_migration_map
  FOR ALL TO authenticated
  USING (public.gce_is_platform_admin())
  WITH CHECK (public.gce_is_platform_admin());

COMMENT ON TABLE public.role_assignments IS 'FD-035 canonical assignments; legacy user_roles/enum alone must not grant entitlement';
COMMENT ON TABLE public.feature_flags IS 'FD-039 inactive and money gates default OFF';
COMMENT ON TABLE public.audit_events IS 'Append-oriented audit; authenticated users cannot update/delete';
COMMENT ON TABLE public.legacy_role_migration_map IS 'Quarantine map; grants_entitlement defaults false';
