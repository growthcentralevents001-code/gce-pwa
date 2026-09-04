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

  const { data: marketplaceCommercial } = await client
    .from("marketplace_revenue_entitlements")
    .select("state, eligible_revenue_minor, venue_share_minor, mbdp_share_minor, gce_share_minor");

  const marketplaceCommercialSummary = {
    rowCount: marketplaceCommercial?.length ?? 0,
    eligibleGrossMinor: 0,
    onHoldMinor: 0,
    reversedMinor: 0,
    earnedMinor: 0,
  };
  for (const row of marketplaceCommercial ?? []) {
    const gross = Number(row.eligible_revenue_minor ?? 0);
    marketplaceCommercialSummary.eligibleGrossMinor += gross;
    const state = String(row.state ?? "");
    if (state === "on_hold") marketplaceCommercialSummary.onHoldMinor += gross;
    else if (state === "reversed") marketplaceCommercialSummary.reversedMinor += gross;
    else if (state === "earned" || state === "settlement_eligible")
      marketplaceCommercialSummary.earnedMinor += gross;
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
    marketplaceCommercialSummary,
    marketplaceCommercialNote:
      "marketplace_revenue_entitlements is the vertical commercial-entitlement layer (split SoT). stakeholder_entitlements is the Finance settlement layer posted via Finance write actions.",
    moneyFlags: Object.fromEntries(
      (flags ?? []).map((f) => [f.key, Boolean(f.enabled)])
    ),
    note: "Collected funds ≠ GCE revenue. Payout execution remains gated OFF.",
  };
}
