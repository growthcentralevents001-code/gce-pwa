-- Phase 9 — Finance, Revenue, Commission & Settlement (additive)
-- Authority: FD-020/021/025/028/029/033/034/037/038/039
-- Target: gce-dev only. Production untouched.
-- Production money/settlement execution remains feature-flagged OFF.
-- Does NOT invent GST/TDS rates, refund %, or wallet cash-out.

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

DO $$ BEGIN
  CREATE TYPE public.revenue_recognition_status AS ENUM (
    'payment_received',
    'revenue_eligible',
    'recognised',
    'held',
    'partially_reversed',
    'reversed',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.stakeholder_entitlement_status AS ENUM (
    'estimated',
    'provisional',
    'earned',
    'on_hold',
    'settlement_eligible',
    'approved',
    'payable',
    'paid',
    'reversed',
    'partially_reversed',
    'cancelled',
    'recoverable_balance',
    'clawed_back'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.settlement_batch_status AS ENUM (
    'draft',
    'generated',
    'under_review',
    'approved',
    'payout_ready',
    'execution_blocked',
    'executed',
    'partially_failed',
    'reconciled',
    'cancelled'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.reconciliation_status AS ENUM (
    'matched',
    'unmatched',
    'mismatch',
    'duplicate',
    'under_review',
    'resolved'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE public.finance_vertical AS ENUM (
    'connect',
    'marketplace',
    'enterprise',
    'platform',
    'cross_vertical',
    'other'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

-- ---------------------------------------------------------------------------
-- Financial rule versions (immutable commercial formulas)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.financial_rule_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rule_key text NOT NULL,
  version text NOT NULL,
  vertical public.finance_vertical NOT NULL,
  stakeholder_type text NOT NULL,
  basis text NOT NULL,
  rate_bps int NOT NULL DEFAULT 0,
  attribution_required boolean NOT NULL DEFAULT true,
  effective_from timestamptz NOT NULL DEFAULT now(),
  effective_to timestamptz,
  is_active boolean NOT NULL DEFAULT true,
  authority_refs text[] NOT NULL DEFAULT '{}',
  formula_notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT financial_rule_version_unique UNIQUE (rule_key, version),
  CONSTRAINT financial_rule_rate_nonneg CHECK (rate_bps >= 0)
);

INSERT INTO public.financial_rule_versions (
  rule_key, version, vertical, stakeholder_type, basis, rate_bps,
  attribution_required, authority_refs, formula_notes
) VALUES
  ('connect_bdp_commission', 'fd025-fd029-v1', 'connect', 'connect_bdp',
   'eligible_attributed_subscription_revenue', 2000, true,
   ARRAY['FD-025','FD-029','FD-036'],
   '20% of eligible attributed Connect subscription revenue'),
  ('marketplace_venue_share', 'fd029-fd037-v1', 'marketplace', 'venue_partner',
   'eligible_marketplace_event_revenue', 8000, false,
   ARRAY['FD-029','FD-037'], '80% Venue Partner entitlement'),
  ('marketplace_bdp_attributed', 'fd029-fd037-v1', 'marketplace', 'marketplace_bdp',
   'eligible_marketplace_event_revenue', 1000, true,
   ARRAY['FD-029','FD-033','FD-037'],
   '10% when valid MBDP attribution; from GCE 20% platform commission'),
  ('marketplace_gce_attributed', 'fd029-fd037-v1', 'marketplace', 'gce_platform',
   'eligible_marketplace_event_revenue', 1000, false,
   ARRAY['FD-029','FD-037'], '10% GCE net when attributed'),
  ('marketplace_gce_unattributed', 'fd029-fd037-v1', 'marketplace', 'gce_platform',
   'eligible_marketplace_event_revenue', 2000, false,
   ARRAY['FD-037'], '20% GCE when unattributed; MBDP = 0 (not pending)'),
  ('enterprise_platform_commission', 'fd026-v1', 'enterprise', 'gce_platform',
   'eligible_enterprise_event_revenue', 2000, false,
   ARRAY['FD-026','FD-028'], 'Default 20% GCE platform commission'),
  ('enterprise_bdp_commission', 'fd026-fd038-v1', 'enterprise', 'enterprise_bdp',
   'eligible_gce_platform_commission', 2500, true,
   ARRAY['FD-026','FD-029','FD-038'],
   '25% of eligible GCE platform commission — NOT of project value')
ON CONFLICT (rule_key, version) DO NOTHING;

-- ---------------------------------------------------------------------------
-- Canonical revenue components
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.revenue_components (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_component_key text NOT NULL UNIQUE,
  financial_transaction_id uuid REFERENCES public.financial_transactions(id),
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  vertical public.finance_vertical NOT NULL,
  domain_object_type text NOT NULL,
  domain_object_id uuid,
  currency text NOT NULL DEFAULT 'INR',
  gross_amount_minor bigint NOT NULL DEFAULT 0,
  excluded_amount_minor bigint NOT NULL DEFAULT 0,
  tax_amount_minor bigint NOT NULL DEFAULT 0,
  eligible_base_minor bigint NOT NULL DEFAULT 0,
  recognition_status public.revenue_recognition_status NOT NULL DEFAULT 'payment_received',
  recognised_at timestamptz,
  rule_version text NOT NULL DEFAULT 'phase9-v1',
  attribution_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  source_ids jsonb NOT NULL DEFAULT '{}'::jsonb,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT revenue_component_amounts_nonneg CHECK (
    gross_amount_minor >= 0
    AND excluded_amount_minor >= 0
    AND tax_amount_minor >= 0
    AND eligible_base_minor >= 0
  ),
  CONSTRAINT revenue_component_eligible_le_gross CHECK (
    eligible_base_minor <= gross_amount_minor
  )
);

DROP TRIGGER IF EXISTS trg_revenue_components_updated_at ON public.revenue_components;
CREATE TRIGGER trg_revenue_components_updated_at
  BEFORE UPDATE ON public.revenue_components
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Offer claims alone must never become revenue markers
CREATE OR REPLACE FUNCTION public.gce_reject_claim_only_revenue()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF NEW.domain_object_type IN ('offer_claim', 'offer_visit', 'redemption_token_alone') THEN
    RAISE EXCEPTION 'Offer claim/visit/token alone is not revenue (FD-029/037)'
      USING ERRCODE = '23514';
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_reject_claim_only_revenue ON public.revenue_components;
CREATE TRIGGER trg_reject_claim_only_revenue
  BEFORE INSERT OR UPDATE ON public.revenue_components
  FOR EACH ROW EXECUTE FUNCTION public.gce_reject_claim_only_revenue();

-- ---------------------------------------------------------------------------
-- Canonical stakeholder entitlements
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.stakeholder_entitlements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  earning_event_key text NOT NULL UNIQUE,
  revenue_component_id uuid NOT NULL REFERENCES public.revenue_components(id),
  revenue_component_key text NOT NULL,
  stakeholder_user_id uuid REFERENCES public.users(id),
  stakeholder_org_id uuid REFERENCES public.organisations(id),
  stakeholder_type text NOT NULL,
  source_vertical public.finance_vertical NOT NULL,
  attribution_ref text,
  rule_key text NOT NULL,
  rule_version text NOT NULL,
  gross_eligible_basis_minor bigint NOT NULL DEFAULT 0,
  rate_bps int NOT NULL DEFAULT 0,
  gross_entitlement_minor bigint NOT NULL DEFAULT 0,
  recovery_deduction_minor bigint NOT NULL DEFAULT 0,
  reversal_amount_minor bigint NOT NULL DEFAULT 0,
  net_settlement_eligible_minor bigint NOT NULL DEFAULT 0,
  status public.stakeholder_entitlement_status NOT NULL DEFAULT 'estimated',
  recognised_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES public.users(id),
  settlement_batch_id uuid,
  vertical_source_ref text, -- connect|marketplace|enterprise entitlement id if bridged
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT se_gross_immutable_nonneg CHECK (
    gross_eligible_basis_minor >= 0
    AND gross_entitlement_minor >= 0
    AND recovery_deduction_minor >= 0
    AND reversal_amount_minor >= 0
    AND net_settlement_eligible_minor >= 0
  ),
  CONSTRAINT se_net_formula CHECK (
    net_settlement_eligible_minor
      = GREATEST(0, gross_entitlement_minor - recovery_deduction_minor - reversal_amount_minor)
  ),
  CONSTRAINT se_no_self_approve CHECK (
    approved_by IS NULL
    OR stakeholder_user_id IS NULL
    OR approved_by IS DISTINCT FROM stakeholder_user_id
  )
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_se_component_stakeholder_type
  ON public.stakeholder_entitlements (revenue_component_key, stakeholder_type)
  WHERE status NOT IN ('reversed', 'cancelled');

DROP TRIGGER IF EXISTS trg_stakeholder_entitlements_updated_at ON public.stakeholder_entitlements;
CREATE TRIGGER trg_stakeholder_entitlements_updated_at
  BEFORE UPDATE ON public.stakeholder_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Gross entitlement immutable after posting (except via reversal columns)
CREATE OR REPLACE FUNCTION public.gce_se_protect_gross()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  IF TG_OP = 'UPDATE' THEN
    IF NEW.gross_entitlement_minor IS DISTINCT FROM OLD.gross_entitlement_minor
       OR NEW.gross_eligible_basis_minor IS DISTINCT FROM OLD.gross_eligible_basis_minor
       OR NEW.rate_bps IS DISTINCT FROM OLD.rate_bps THEN
      RAISE EXCEPTION 'Gross entitlement is immutable; use reversal/correction (FD-020/029)'
        USING ERRCODE = '23514';
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_se_protect_gross ON public.stakeholder_entitlements;
CREATE TRIGGER trg_se_protect_gross
  BEFORE UPDATE ON public.stakeholder_entitlements
  FOR EACH ROW EXECUTE FUNCTION public.gce_se_protect_gross();

CREATE TABLE IF NOT EXISTS public.entitlement_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entitlement_id uuid NOT NULL REFERENCES public.stakeholder_entitlements(id) ON DELETE CASCADE,
  from_status public.stakeholder_entitlement_status,
  to_status public.stakeholder_entitlement_status NOT NULL,
  actor_user_id uuid REFERENCES public.users(id),
  reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- Recovery applications (unified; separate from gross)
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.recovery_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entitlement_id uuid NOT NULL REFERENCES public.stakeholder_entitlements(id),
  vertical public.finance_vertical NOT NULL,
  pack_or_unit_ref text,
  cycle_key text NOT NULL,
  remaining_before_minor bigint NOT NULL,
  applied_minor bigint NOT NULL,
  remaining_after_minor bigint NOT NULL,
  cap_minor bigint NOT NULL DEFAULT 500000,
  rule_version text NOT NULL DEFAULT 'fd029-v1',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  created_by uuid REFERENCES public.users(id),
  CONSTRAINT recovery_applied_nonneg CHECK (
    applied_minor >= 0 AND remaining_before_minor >= 0 AND remaining_after_minor >= 0
  ),
  CONSTRAINT recovery_applied_le_cap CHECK (applied_minor <= cap_minor),
  CONSTRAINT recovery_balance_math CHECK (
    remaining_after_minor = remaining_before_minor - applied_minor
  ),
  CONSTRAINT recovery_cycle_unique UNIQUE (entitlement_id, cycle_key)
);

-- ---------------------------------------------------------------------------
-- Holds / reversals / corrections
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.financial_holds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  scope_type text NOT NULL, -- transaction|entitlement|settlement_item|payout|stakeholder
  scope_id uuid NOT NULL,
  reason text NOT NULL,
  amount_minor bigint,
  actor_user_id uuid REFERENCES public.users(id),
  started_at timestamptz NOT NULL DEFAULT now(),
  released_at timestamptz,
  released_by uuid REFERENCES public.users(id),
  status text NOT NULL DEFAULT 'active',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT financial_hold_amount_nonneg CHECK (amount_minor IS NULL OR amount_minor >= 0)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_financial_hold_active_scope
  ON public.financial_holds (scope_type, scope_id)
  WHERE status = 'active';

CREATE TABLE IF NOT EXISTS public.financial_reversals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  original_entitlement_id uuid REFERENCES public.stakeholder_entitlements(id),
  original_revenue_component_id uuid REFERENCES public.revenue_components(id),
  original_financial_transaction_id uuid REFERENCES public.financial_transactions(id),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  reason text NOT NULL,
  refund_ref text,
  chargeback_ref text,
  actor_user_id uuid REFERENCES public.users(id),
  reversing_transaction_id uuid REFERENCES public.financial_transactions(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public.financial_corrections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  correction_key text NOT NULL UNIQUE,
  subject_type text NOT NULL,
  subject_id uuid NOT NULL,
  reason text NOT NULL,
  amount_minor bigint NOT NULL DEFAULT 0,
  actor_user_id uuid REFERENCES public.users(id),
  approved_by uuid REFERENCES public.users(id),
  reversing_transaction_id uuid REFERENCES public.financial_transactions(id),
  status text NOT NULL DEFAULT 'posted',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT financial_correction_no_self_approve CHECK (
    approved_by IS NULL OR actor_user_id IS DISTINCT FROM approved_by
  )
);

CREATE TABLE IF NOT EXISTS public.chargeback_cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider_dispute_ref text NOT NULL UNIQUE,
  payment_intent_id uuid REFERENCES public.payment_intents(id),
  revenue_component_id uuid REFERENCES public.revenue_components(id),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  status text NOT NULL DEFAULT 'opened',
  provisional_hold_id uuid REFERENCES public.financial_holds(id),
  outcome text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_chargeback_cases_updated_at ON public.chargeback_cases;
CREATE TRIGGER trg_chargeback_cases_updated_at
  BEFORE UPDATE ON public.chargeback_cases
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.tax_component_refs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  revenue_component_id uuid REFERENCES public.revenue_components(id),
  tax_kind text NOT NULL, -- gst|tds|withholding|other — rates PENDING PROFESSIONAL VALIDATION
  amount_minor bigint,
  rate_bps int,
  account_mapping_key text,
  validation_status text NOT NULL DEFAULT 'pending_professional_validation',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT tax_component_no_invented_live_rate CHECK (
    validation_status = 'pending_professional_validation'
    OR validation_status = 'professionally_validated'
  )
);

-- ---------------------------------------------------------------------------
-- Settlement batches / payout items
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.settlement_batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_ref text NOT NULL UNIQUE,
  period_start date NOT NULL,
  period_end date NOT NULL,
  vertical public.finance_vertical NOT NULL DEFAULT 'cross_vertical',
  currency text NOT NULL DEFAULT 'INR',
  status public.settlement_batch_status NOT NULL DEFAULT 'draft',
  item_count int NOT NULL DEFAULT 0,
  gross_total_minor bigint NOT NULL DEFAULT 0,
  recovery_total_minor bigint NOT NULL DEFAULT 0,
  net_total_minor bigint NOT NULL DEFAULT 0,
  reconciliation_status public.reconciliation_status,
  generated_at timestamptz,
  approved_at timestamptz,
  approved_by uuid REFERENCES public.users(id),
  executed_at timestamptz,
  execution_blocked_reason text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT settlement_batch_totals_nonneg CHECK (
    item_count >= 0
    AND gross_total_minor >= 0
    AND recovery_total_minor >= 0
    AND net_total_minor >= 0
  )
);

DROP TRIGGER IF EXISTS trg_settlement_batches_updated_at ON public.settlement_batches;
CREATE TRIGGER trg_settlement_batches_updated_at
  BEFORE UPDATE ON public.settlement_batches
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

ALTER TABLE public.stakeholder_entitlements
  DROP CONSTRAINT IF EXISTS stakeholder_entitlements_settlement_batch_id_fkey;
ALTER TABLE public.stakeholder_entitlements
  ADD CONSTRAINT stakeholder_entitlements_settlement_batch_id_fkey
  FOREIGN KEY (settlement_batch_id) REFERENCES public.settlement_batches(id);

CREATE TABLE IF NOT EXISTS public.settlement_batch_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.settlement_batches(id) ON DELETE CASCADE,
  entitlement_id uuid NOT NULL REFERENCES public.stakeholder_entitlements(id),
  gross_minor bigint NOT NULL DEFAULT 0,
  recovery_minor bigint NOT NULL DEFAULT 0,
  net_minor bigint NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'included',
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT settlement_item_nonneg CHECK (
    gross_minor >= 0 AND recovery_minor >= 0 AND net_minor >= 0
  ),
  CONSTRAINT settlement_item_unique UNIQUE (batch_id, entitlement_id),
  CONSTRAINT settlement_item_net CHECK (net_minor = gross_minor - recovery_minor)
);

CREATE TABLE IF NOT EXISTS public.payout_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid REFERENCES public.settlement_batches(id),
  batch_item_id uuid REFERENCES public.settlement_batch_items(id),
  payee_user_id uuid REFERENCES public.users(id),
  payee_org_id uuid REFERENCES public.organisations(id),
  stakeholder_type text NOT NULL,
  gross_minor bigint NOT NULL DEFAULT 0,
  deductions_minor bigint NOT NULL DEFAULT 0,
  recovery_minor bigint NOT NULL DEFAULT 0,
  net_minor bigint NOT NULL DEFAULT 0,
  payout_destination_ref text, -- redacted/reference only — never full bank dump in logs
  status text NOT NULL DEFAULT 'pending',
  hold_id uuid REFERENCES public.financial_holds(id),
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT payout_item_nonneg CHECK (
    gross_minor >= 0 AND deductions_minor >= 0 AND recovery_minor >= 0 AND net_minor >= 0
  ),
  CONSTRAINT payout_item_no_negative_net CHECK (net_minor = gross_minor - deductions_minor - recovery_minor)
);

DROP TRIGGER IF EXISTS trg_payout_items_updated_at ON public.payout_items;
CREATE TRIGGER trg_payout_items_updated_at
  BEFORE UPDATE ON public.payout_items
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Block executed status unless settlement_execution flag enabled
CREATE OR REPLACE FUNCTION public.gce_settlement_execution_guard()
RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE v_enabled boolean;
BEGIN
  IF NEW.status = 'executed' AND (OLD.status IS DISTINCT FROM 'executed') THEN
    SELECT enabled INTO v_enabled FROM public.feature_flags WHERE key = 'settlement_execution';
    IF COALESCE(v_enabled, false) IS NOT TRUE THEN
      NEW.status := 'execution_blocked';
      NEW.execution_blocked_reason := 'settlement_execution feature flag is OFF (FD-039)';
      NEW.executed_at := NULL;
    END IF;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_settlement_execution_guard ON public.settlement_batches;
CREATE TRIGGER trg_settlement_execution_guard
  BEFORE UPDATE OF status ON public.settlement_batches
  FOR EACH ROW EXECUTE FUNCTION public.gce_settlement_execution_guard();

-- ---------------------------------------------------------------------------
-- Offline payments + reconciliation
-- ---------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.offline_payment_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_domain text NOT NULL, -- connect_bdp_pack|marketplace_bdp_unit|enterprise_bdp_pack|other
  source_id uuid,
  payer_user_id uuid REFERENCES public.users(id),
  amount_minor bigint NOT NULL CHECK (amount_minor > 0),
  currency text NOT NULL DEFAULT 'INR',
  method text NOT NULL, -- neft|rtgs|cheque|bank_transfer
  bank_reference text NOT NULL,
  received_on date NOT NULL,
  proof_ref text,
  recorded_by uuid REFERENCES public.users(id),
  verified_by uuid REFERENCES public.users(id),
  reconciliation_status public.reconciliation_status NOT NULL DEFAULT 'unmatched',
  matched_payment_intent_id uuid REFERENCES public.payment_intents(id),
  discrepancy_notes text,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT offline_payment_no_cash CHECK (method <> 'cash'),
  CONSTRAINT offline_payment_dual_control CHECK (
    verified_by IS NULL OR recorded_by IS DISTINCT FROM verified_by
  )
);

DROP TRIGGER IF EXISTS trg_offline_payment_records_updated_at ON public.offline_payment_records;
CREATE TRIGGER trg_offline_payment_records_updated_at
  BEFORE UPDATE ON public.offline_payment_records
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

CREATE TABLE IF NOT EXISTS public.reconciliation_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  domain text NOT NULL,
  left_ref text NOT NULL,
  right_ref text,
  status public.reconciliation_status NOT NULL DEFAULT 'unmatched',
  amount_minor bigint,
  notes text,
  exception_queue boolean NOT NULL DEFAULT false,
  resolved_by uuid REFERENCES public.users(id),
  resolved_at timestamptz,
  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

DROP TRIGGER IF EXISTS trg_reconciliation_records_updated_at ON public.reconciliation_records;
CREATE TRIGGER trg_reconciliation_records_updated_at
  BEFORE UPDATE ON public.reconciliation_records
  FOR EACH ROW EXECUTE FUNCTION public.gce_set_updated_at();

-- Webhook hardening columns
ALTER TABLE public.payment_webhook_events
  ADD COLUMN IF NOT EXISTS payload_hash text;
ALTER TABLE public.payment_webhook_events
  ADD COLUMN IF NOT EXISTS replay_detected boolean NOT NULL DEFAULT false;

CREATE UNIQUE INDEX IF NOT EXISTS uq_payment_webhook_provider_event
  ON public.payment_webhook_events (provider, provider_event_id)
  WHERE provider_event_id IS NOT NULL;

-- ---------------------------------------------------------------------------
-- Ledger balance enforcement helper
-- ---------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.gce_assert_txn_balanced(p_txn_id uuid)
RETURNS boolean
LANGUAGE plpgsql
STABLE
AS $$
DECLARE v_debit bigint; v_credit bigint;
BEGIN
  SELECT
    COALESCE(sum(amount_minor) FILTER (WHERE direction = 'debit'), 0),
    COALESCE(sum(amount_minor) FILTER (WHERE direction = 'credit'), 0)
  INTO v_debit, v_credit
  FROM public.ledger_entries
  WHERE financial_transaction_id = p_txn_id;

  IF v_debit <> v_credit THEN
    RAISE EXCEPTION 'Ledger transaction % unbalanced: debit=% credit=%', p_txn_id, v_debit, v_credit
      USING ERRCODE = '23514';
  END IF;
  RETURN true;
END;
$$;

-- Claim revenue component for commission family (extends Phase 8 guard)
CREATE OR REPLACE FUNCTION public.gce_finance_claim_stakeholder(
  p_key text,
  p_vertical text,
  p_stakeholder text,
  p_entitlement_ref uuid DEFAULT NULL
)
RETURNS public.gce_commissioned_revenue_components
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  RETURN public.gce_claim_revenue_component(p_key, p_vertical, p_stakeholder, p_entitlement_ref);
END;
$$;

-- ---------------------------------------------------------------------------
-- Feature flags (all money execution OFF)
-- ---------------------------------------------------------------------------

INSERT INTO public.feature_flags (key, enabled, description) VALUES
  ('revenue_recognition_live', false, 'Phase 9 — live revenue recognition posting gate'),
  ('commission_posting_live', false, 'Phase 9 — live commission posting gate'),
  ('settlement_batch_generation', false, 'Phase 9 — settlement batch generation gate'),
  ('payout_execution', false, 'Phase 9 — real payout execution (must stay OFF)'),
  ('wallet_cashout', false, 'FD-039 — wallet cash-out remains inactive')
ON CONFLICT (key) DO UPDATE SET
  enabled = CASE
    WHEN feature_flags.key IN (
      'settlement_execution','payout_execution','wallet_cashout',
      'marketplace_ticket_payments','bdp_pack_payments','wallet_cashout'
    ) THEN false
    ELSE feature_flags.enabled
  END;

-- Force critical money flags OFF
UPDATE public.feature_flags SET enabled = false
WHERE key IN (
  'settlement_execution',
  'payout_execution',
  'wallet_cashout',
  'marketplace_ticket_payments',
  'bdp_pack_payments',
  'offline_bdp_pack_payments',
  'enterprise_bdp_pack_payments',
  'revenue_recognition_live',
  'commission_posting_live',
  'settlement_batch_generation'
);

CREATE TABLE IF NOT EXISTS public.legacy_finance_migration_map (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legacy_object text NOT NULL UNIQUE,
  mapping_status text NOT NULL DEFAULT 'historical_only',
  notes text,
  created_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.legacy_finance_migration_map (legacy_object, mapping_status, notes) VALUES
  ('zbp_commission_fields', 'unsafe_deprecated', 'ZBP removed — do not activate entitlement'),
  ('affiliate_commission_fields', 'historical_only', 'Marketplace Affiliate inactive FD-039'),
  ('legacy_bdm_fields', 'ambiguous', 'Do not auto-map to Marketplace BDP commission'),
  ('wallet_cashout_paths', 'inactive', 'FD-039 cash-out inactive'),
  ('marketplace_revenue_entitlements', 'reusable_bridge', 'Phase 7 vertical table; Phase 9 posts canonical stakeholder_entitlements'),
  ('enterprise_revenue_entitlements', 'reusable_bridge', 'Phase 8 boundary; Phase 9 unifies settlement'),
  ('connect_bdp_recovery_entries', 'reusable_bridge', 'Phase 6 recovery; Phase 9 recovery_applications unify')
ON CONFLICT (legacy_object) DO NOTHING;

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE public.financial_rule_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.revenue_components ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stakeholder_entitlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.entitlement_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recovery_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_holds ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_reversals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financial_corrections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chargeback_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tax_component_refs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_batches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settlement_batch_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payout_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.offline_payment_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reconciliation_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legacy_finance_migration_map ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.gce_is_finance_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.gce_has_active_assignment('finance_admin', NULL, NULL)
      OR public.gce_is_platform_admin();
$$;

DROP POLICY IF EXISTS fin_rules_select ON public.financial_rule_versions;
CREATE POLICY fin_rules_select ON public.financial_rule_versions
  FOR SELECT TO authenticated
  USING (true);

DROP POLICY IF EXISTS fin_rules_admin ON public.financial_rule_versions;
CREATE POLICY fin_rules_admin ON public.financial_rule_versions
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_rev_select ON public.revenue_components;
CREATE POLICY fin_rev_select ON public.revenue_components
  FOR SELECT TO authenticated
  USING (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_rev_write ON public.revenue_components;
CREATE POLICY fin_rev_write ON public.revenue_components
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_se_select ON public.stakeholder_entitlements;
CREATE POLICY fin_se_select ON public.stakeholder_entitlements
  FOR SELECT TO authenticated
  USING (
    public.gce_is_finance_admin()
    OR stakeholder_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS fin_se_write ON public.stakeholder_entitlements;
CREATE POLICY fin_se_write ON public.stakeholder_entitlements
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_se_events_select ON public.entitlement_events;
CREATE POLICY fin_se_events_select ON public.entitlement_events
  FOR SELECT TO authenticated
  USING (
    public.gce_is_finance_admin()
    OR EXISTS (
      SELECT 1 FROM public.stakeholder_entitlements e
      WHERE e.id = entitlement_id AND e.stakeholder_user_id = public.gce_current_user_id()
    )
  );

DROP POLICY IF EXISTS fin_recovery_finance ON public.recovery_applications;
CREATE POLICY fin_recovery_finance ON public.recovery_applications
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_holds_finance ON public.financial_holds;
CREATE POLICY fin_holds_finance ON public.financial_holds
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin() OR public.gce_has_active_assignment('compliance_admin', NULL, NULL))
  WITH CHECK (public.gce_is_finance_admin() OR public.gce_has_active_assignment('compliance_admin', NULL, NULL));

DROP POLICY IF EXISTS fin_reversals_finance ON public.financial_reversals;
CREATE POLICY fin_reversals_finance ON public.financial_reversals
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_corrections_finance ON public.financial_corrections;
CREATE POLICY fin_corrections_finance ON public.financial_corrections
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_chargebacks_finance ON public.chargeback_cases;
CREATE POLICY fin_chargebacks_finance ON public.chargeback_cases
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_tax_finance ON public.tax_component_refs;
CREATE POLICY fin_tax_finance ON public.tax_component_refs
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_batches_finance ON public.settlement_batches;
CREATE POLICY fin_batches_finance ON public.settlement_batches
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_batch_items_finance ON public.settlement_batch_items;
CREATE POLICY fin_batch_items_finance ON public.settlement_batch_items
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_payout_select ON public.payout_items;
CREATE POLICY fin_payout_select ON public.payout_items
  FOR SELECT TO authenticated
  USING (
    public.gce_is_finance_admin()
    OR payee_user_id = public.gce_current_user_id()
  );

DROP POLICY IF EXISTS fin_payout_write ON public.payout_items;
CREATE POLICY fin_payout_write ON public.payout_items
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_offline_finance ON public.offline_payment_records;
CREATE POLICY fin_offline_finance ON public.offline_payment_records
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS fin_recon_finance ON public.reconciliation_records;
CREATE POLICY fin_recon_finance ON public.reconciliation_records
  FOR ALL TO authenticated
  USING (public.gce_is_finance_admin())
  WITH CHECK (public.gce_is_finance_admin());

DROP POLICY IF EXISTS legacy_finance_map_select ON public.legacy_finance_migration_map;
CREATE POLICY legacy_finance_map_select ON public.legacy_finance_migration_map
  FOR SELECT TO authenticated USING (true);

COMMENT ON TABLE public.revenue_components IS
  'FD-028 canonical revenue components — payment ≠ automatic recognition; offer claims are not revenue';
COMMENT ON TABLE public.stakeholder_entitlements IS
  'FD-029 commission entitlements — gross immutable; recovery/reversal separate; settlement eligibility distinct';
COMMENT ON TABLE public.settlement_batches IS
  'FD-021 settlement batches — execution blocked while settlement_execution flag OFF';
COMMENT ON FUNCTION public.gce_settlement_execution_guard() IS
  'Forces execution_blocked when settlement_execution feature flag is OFF (FD-039)';
