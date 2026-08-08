import type { SupabaseClient } from "@supabase/supabase-js";

export async function buildFinanceDashboard(client: SupabaseClient) {
  const [
    { count: recognised },
    { count: pendingEntitlements },
    { count: settlementEligible },
    { count: holds },
    { count: batches },
    { count: payoutReady },
    { count: offlineUnmatched },
    { count: exceptions },
    { count: reversals },
    { data: flags },
  ] = await Promise.all([
    client
      .from("revenue_components")
      .select("id", { count: "exact", head: true })
      .eq("recognition_status", "recognised"),
    client
      .from("stakeholder_entitlements")
      .select("id", { count: "exact", head: true })
      .in("status", ["estimated", "provisional", "earned"]),
    client
      .from("stakeholder_entitlements")
      .select("id", { count: "exact", head: true })
      .eq("status", "settlement_eligible"),
    client
      .from("financial_holds")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    client.from("settlement_batches").select("id", { count: "exact", head: true }),
    client
      .from("payout_items")
      .select("id", { count: "exact", head: true })
      .eq("status", "payout_ready"),
    client
      .from("offline_payment_records")
      .select("id", { count: "exact", head: true })
      .eq("reconciliation_status", "unmatched"),
    client
      .from("reconciliation_records")
      .select("id", { count: "exact", head: true })
      .eq("exception_queue", true),
    client.from("financial_reversals").select("id", { count: "exact", head: true }),
    client
      .from("feature_flags")
      .select("key, enabled")
      .in("key", [
        "settlement_execution",
        "payout_execution",
        "marketplace_ticket_payments",
        "wallet_cashout",
      ]),
  ]);

  const { data: byVertical } = await client
    .from("stakeholder_entitlements")
    .select("source_vertical, gross_entitlement_minor, net_settlement_eligible_minor");

  const totals = {
    connectGross: 0,
    marketplaceGross: 0,
    enterpriseGross: 0,
    netSettlementEligible: 0,
    recoveries: 0,
  };
  for (const row of byVertical ?? []) {
    const g = Number(row.gross_entitlement_minor ?? 0);
    const n = Number(row.net_settlement_eligible_minor ?? 0);
    totals.netSettlementEligible += n;
    totals.recoveries += g - n;
    if (row.source_vertical === "connect") totals.connectGross += g;
    if (row.source_vertical === "marketplace") totals.marketplaceGross += g;
    if (row.source_vertical === "enterprise") totals.enterpriseGross += g;
  }

  return {
    recognisedRevenueComponents: recognised ?? 0,
    pendingEntitlements: pendingEntitlements ?? 0,
    settlementEligibleEntitlements: settlementEligible ?? 0,
    activeHolds: holds ?? 0,
    settlementBatches: batches ?? 0,
    payoutReadyItems: payoutReady ?? 0,
    offlineUnmatched: offlineUnmatched ?? 0,
    reconciliationExceptions: exceptions ?? 0,
    reversals: reversals ?? 0,
    totals,
    moneyFlags: Object.fromEntries(
      (flags ?? []).map((f) => [f.key, Boolean(f.enabled)])
    ),
    note: "Collected funds ≠ GCE revenue. Payout execution remains gated OFF.",
  };
}
