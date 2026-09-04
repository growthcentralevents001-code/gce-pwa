import type { SupabaseClient } from "@supabase/supabase-js";
import { buildFinanceDashboard } from "@/lib/architecture/finance";

export type FinanceBundle = {
  report: Awaited<ReturnType<typeof buildFinanceDashboard>>;
  revenueComponents: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
  holds: Record<string, unknown>[];
  recoveries: Record<string, unknown>[];
  reversals: Record<string, unknown>[];
  corrections: Record<string, unknown>[];
  settlementBatches: Record<string, unknown>[];
  payoutItems: Record<string, unknown>[];
  reconciliation: Record<string, unknown>[];
  offlinePayments: Record<string, unknown>[];
  refunds: Record<string, unknown>[];
  chargebacks: Record<string, unknown>[];
  ledgerEntries: Record<string, unknown>[];
  marketplaceCommercialEntitlements: Record<string, unknown>[];
};

const LIST_LIMIT = 80;

export async function loadFinanceBundle(
  client: SupabaseClient
): Promise<FinanceBundle> {
  const [
    report,
    revRes,
    entRes,
    holdRes,
    revslRes,
    corrRes,
    batchRes,
    payoutRes,
    reconRes,
    offRes,
    refundRes,
    cbRes,
    ledgerRes,
    mktCommercialRes,
  ] = await Promise.all([
    buildFinanceDashboard(client),
    client
      .from("revenue_components")
      .select(
        "id, revenue_component_key, vertical, recognition_status, gross_amount_minor, eligible_base_minor, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("stakeholder_entitlements")
      .select(
        "id, stakeholder_type, source_vertical, status, revenue_component_key, gross_entitlement_minor, recovery_deduction_minor, reversal_amount_minor, net_settlement_eligible_minor, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("financial_holds")
      .select("id, status, scope_type, reason, amount_minor, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("financial_reversals")
      .select("id, amount_minor, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("financial_corrections")
      .select("id, amount_minor, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("settlement_batches")
      .select(
        "id, status, vertical, batch_ref, period_start, period_end, net_total_minor, gross_total_minor, execution_blocked_reason, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("payout_items")
      .select(
        "id, status, stakeholder_type, gross_minor, net_minor, recovery_minor, deductions_minor, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("reconciliation_records")
      .select(
        "id, domain, status, amount_minor, exception_queue, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("offline_payment_records")
      .select(
        "id, source_domain, amount_minor, method, reconciliation_status, received_on, bank_reference, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("customer_refund_requests")
      .select("id, booking_id, status, amount_determination, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("chargeback_cases")
      .select("id, status, amount_minor, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("ledger_entries")
      .select("id, direction, amount_minor, ledger_account_id, created_at")
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
    client
      .from("marketplace_revenue_entitlements")
      .select(
        "id, earning_event_key, source_type, source_id, venue_id, eligible_revenue_minor, venue_share_minor, mbdp_share_minor, gce_share_minor, has_valid_attribution, state, rule_version, created_at"
      )
      .order("created_at", { ascending: false })
      .limit(LIST_LIMIT),
  ]);

  const entitlements = (entRes.data as Record<string, unknown>[]) ?? [];
  const recoveries = entitlements.filter(
    (e) => Number(e.recovery_deduction_minor ?? 0) > 0
  );

  return {
    report,
    revenueComponents: (revRes.data as Record<string, unknown>[]) ?? [],
    entitlements,
    holds: (holdRes.data as Record<string, unknown>[]) ?? [],
    recoveries,
    reversals: (revslRes.data as Record<string, unknown>[]) ?? [],
    corrections: (corrRes.data as Record<string, unknown>[]) ?? [],
    settlementBatches: (batchRes.data as Record<string, unknown>[]) ?? [],
    payoutItems: (payoutRes.data as Record<string, unknown>[]) ?? [],
    reconciliation: (reconRes.data as Record<string, unknown>[]) ?? [],
    offlinePayments: (offRes.data as Record<string, unknown>[]) ?? [],
    refunds: (refundRes.data as Record<string, unknown>[]) ?? [],
    chargebacks: (cbRes.data as Record<string, unknown>[]) ?? [],
    ledgerEntries: (ledgerRes.data as Record<string, unknown>[]) ?? [],
    marketplaceCommercialEntitlements:
      (mktCommercialRes.data as Record<string, unknown>[]) ?? [],
  };
}
