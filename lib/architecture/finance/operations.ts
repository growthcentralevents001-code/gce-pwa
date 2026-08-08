import type { SupabaseClient } from "@supabase/supabase-js";
import { randomUUID } from "node:crypto";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { assertBalancedEntries, postFinancialTransaction } from "../ledger/posting";
import {
  calculateConnectBdpCommission,
  calculateEnterpriseEntitlement,
  calculateMarketplaceSplit,
  netAfterRecovery,
  recoveryForCycle,
  FINANCE_RULE_VERSION,
  RECOVERY_CYCLE_CAP_MINOR,
} from "./constants";

function cryptoRandomUuid(): string {
  return randomUUID();
}

export async function recogniseRevenueComponent(
  client: SupabaseClient,
  input: {
    revenueComponentKey: string;
    vertical: "connect" | "marketplace" | "enterprise" | "platform" | "other";
    domainObjectType: string;
    domainObjectId?: string | null;
    grossAmountMinor: number;
    excludedAmountMinor?: number;
    taxAmountMinor?: number;
    eligibleBaseMinor: number;
    paymentIntentId?: string | null;
    attributionSnapshot?: Record<string, unknown>;
    sourceIds?: Record<string, unknown>;
    markRecognised?: boolean;
    actorUserId: string;
    correlationId?: string;
  }
) {
  if (
    ["offer_claim", "offer_visit", "redemption_token_alone"].includes(
      input.domainObjectType
    )
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Offer claim/visit/token alone is not revenue (FD-029/037)",
      { status: 400 }
    );
  }

  const { data: existing } = await client
    .from("revenue_components")
    .select("*")
    .eq("revenue_component_key", input.revenueComponentKey)
    .maybeSingle();
  if (existing) {
    return existing; // idempotent
  }

  const status = input.markRecognised ? "recognised" : "revenue_eligible";
  const { data, error } = await client
    .from("revenue_components")
    .insert({
      revenue_component_key: input.revenueComponentKey,
      vertical: input.vertical,
      domain_object_type: input.domainObjectType,
      domain_object_id: input.domainObjectId ?? null,
      gross_amount_minor: input.grossAmountMinor,
      excluded_amount_minor: input.excludedAmountMinor ?? 0,
      tax_amount_minor: input.taxAmountMinor ?? 0,
      eligible_base_minor: input.eligibleBaseMinor,
      payment_intent_id: input.paymentIntentId ?? null,
      recognition_status: status,
      recognised_at: input.markRecognised ? new Date().toISOString() : null,
      rule_version: FINANCE_RULE_VERSION,
      attribution_snapshot: input.attributionSnapshot ?? {},
      source_ids: input.sourceIds ?? {},
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to recognise revenue component", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.revenue.recognise",
    resourceType: "revenue_component",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

async function claimComponent(
  client: SupabaseClient,
  key: string,
  vertical: string,
  stakeholder: string
) {
  const { error } = await client.rpc("gce_finance_claim_stakeholder", {
    p_key: key,
    p_vertical: vertical,
    p_stakeholder: stakeholder,
    p_entitlement_ref: null,
  });
  if (error) {
    throw new AppError(
      "CONFLICT",
      "No double commission on this revenue component",
      { status: 409, cause: error }
    );
  }
}

async function insertEntitlement(
  client: SupabaseClient,
  row: Record<string, unknown>,
  actorUserId: string,
  correlationId?: string
) {
  const { data, error } = await client
    .from("stakeholder_entitlements")
    .insert(row)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to post entitlement", {
      cause: error,
    });
  }
  await client.from("entitlement_events").insert({
    entitlement_id: data.id,
    from_status: null,
    to_status: data.status,
    actor_user_id: actorUserId,
    reason: "posted",
  });
  await writeAuditEvent(client, {
    actorUserId,
    action: "finance.entitlement.create",
    resourceType: "stakeholder_entitlement",
    resourceId: String(data.id),
    after: data,
    correlationId,
  });
  return data;
}

export async function postConnectCommission(
  client: SupabaseClient,
  input: {
    revenueComponentKey: string;
    eligibleAttributedSubscriptionMinor: number;
    hasValidAttribution: boolean;
    stakeholderUserId?: string | null;
    attributionRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const calc = calculateConnectBdpCommission({
    eligibleAttributedSubscriptionMinor:
      input.eligibleAttributedSubscriptionMinor,
    hasValidAttribution: input.hasValidAttribution,
  });

  const component = await recogniseRevenueComponent(client, {
    revenueComponentKey: input.revenueComponentKey,
    vertical: "connect",
    domainObjectType: "connect_membership_subscription",
    grossAmountMinor: input.eligibleAttributedSubscriptionMinor,
    eligibleBaseMinor: input.eligibleAttributedSubscriptionMinor,
    markRecognised: true,
    attributionSnapshot: {
      hasValidAttribution: input.hasValidAttribution,
      attributionRef: input.attributionRef ?? null,
    },
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  if (calc.entitled) {
    await claimComponent(
      client,
      input.revenueComponentKey,
      "connect",
      "connect_bdp"
    );
  }

  return insertEntitlement(
    client,
    {
      earning_event_key: `connect:${input.revenueComponentKey}:connect_bdp`,
      revenue_component_id: component.id,
      revenue_component_key: input.revenueComponentKey,
      stakeholder_user_id: input.stakeholderUserId ?? null,
      stakeholder_type: "connect_bdp",
      source_vertical: "connect",
      attribution_ref: input.attributionRef ?? null,
      rule_key: calc.ruleKey,
      rule_version: calc.ruleVersion,
      gross_eligible_basis_minor: input.eligibleAttributedSubscriptionMinor,
      rate_bps: calc.rateBps,
      gross_entitlement_minor: calc.grossEntitlementMinor,
      recovery_deduction_minor: 0,
      reversal_amount_minor: 0,
      net_settlement_eligible_minor: calc.grossEntitlementMinor,
      status: calc.entitled ? "earned" : "estimated",
      recognised_at: new Date().toISOString(),
    },
    input.actorUserId,
    input.correlationId
  );
}

export async function postMarketplaceCommission(
  client: SupabaseClient,
  input: {
    revenueComponentKey: string;
    eligibleEventRevenueMinor: number;
    hasValidMbdpAttribution: boolean;
    venueOrgId?: string | null;
    mbdpUserId?: string | null;
    attributionRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const split = calculateMarketplaceSplit({
    eligibleEventRevenueMinor: input.eligibleEventRevenueMinor,
    hasValidMbdpAttribution: input.hasValidMbdpAttribution,
  });

  const component = await recogniseRevenueComponent(client, {
    revenueComponentKey: input.revenueComponentKey,
    vertical: "marketplace",
    domainObjectType: "marketplace_booking_completed",
    grossAmountMinor: input.eligibleEventRevenueMinor,
    eligibleBaseMinor: input.eligibleEventRevenueMinor,
    markRecognised: true,
    attributionSnapshot: {
      hasValidMbdpAttribution: input.hasValidMbdpAttribution,
      attributionRef: input.attributionRef ?? null,
    },
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  const results = [];

  await claimComponent(
    client,
    `${input.revenueComponentKey}:venue`,
    "marketplace",
    "venue_partner"
  );
  results.push(
    await insertEntitlement(
      client,
      {
        earning_event_key: `mkt:${input.revenueComponentKey}:venue`,
        revenue_component_id: component.id,
        revenue_component_key: `${input.revenueComponentKey}:venue`,
        stakeholder_org_id: input.venueOrgId ?? null,
        stakeholder_type: "venue_partner",
        source_vertical: "marketplace",
        attribution_ref: input.attributionRef ?? null,
        rule_key: "marketplace_venue_share",
        rule_version: split.ruleVersion,
        gross_eligible_basis_minor: input.eligibleEventRevenueMinor,
        rate_bps: 8000,
        gross_entitlement_minor: split.venueShareMinor,
        recovery_deduction_minor: 0,
        reversal_amount_minor: 0,
        net_settlement_eligible_minor: split.venueShareMinor,
        status: "earned",
        recognised_at: new Date().toISOString(),
      },
      input.actorUserId,
      input.correlationId
    )
  );

  if (split.entitledMbdp) {
    await claimComponent(
      client,
      `${input.revenueComponentKey}:mbdp`,
      "marketplace",
      "marketplace_bdp"
    );
  }
  results.push(
    await insertEntitlement(
      client,
      {
        earning_event_key: `mkt:${input.revenueComponentKey}:mbdp`,
        revenue_component_id: component.id,
        revenue_component_key: `${input.revenueComponentKey}:mbdp`,
        stakeholder_user_id: input.mbdpUserId ?? null,
        stakeholder_type: "marketplace_bdp",
        source_vertical: "marketplace",
        attribution_ref: input.attributionRef ?? null,
        rule_key: "marketplace_bdp_attributed",
        rule_version: split.ruleVersion,
        gross_eligible_basis_minor: input.eligibleEventRevenueMinor,
        rate_bps: split.entitledMbdp ? 1000 : 0,
        gross_entitlement_minor: split.mbdpShareMinor,
        recovery_deduction_minor: 0,
        reversal_amount_minor: 0,
        net_settlement_eligible_minor: split.mbdpShareMinor,
        status: split.entitledMbdp ? "earned" : "estimated",
        recognised_at: new Date().toISOString(),
      },
      input.actorUserId,
      input.correlationId
    )
  );

  await claimComponent(
    client,
    `${input.revenueComponentKey}:gce`,
    "marketplace",
    "gce_platform"
  );
  results.push(
    await insertEntitlement(
      client,
      {
        earning_event_key: `mkt:${input.revenueComponentKey}:gce`,
        revenue_component_id: component.id,
        revenue_component_key: `${input.revenueComponentKey}:gce`,
        stakeholder_type: "gce_platform",
        source_vertical: "marketplace",
        rule_key: split.entitledMbdp
          ? "marketplace_gce_attributed"
          : "marketplace_gce_unattributed",
        rule_version: split.ruleVersion,
        gross_eligible_basis_minor: input.eligibleEventRevenueMinor,
        rate_bps: split.entitledMbdp ? 1000 : 2000,
        gross_entitlement_minor: split.gceShareMinor,
        recovery_deduction_minor: 0,
        reversal_amount_minor: 0,
        net_settlement_eligible_minor: split.gceShareMinor,
        status: "earned",
        recognised_at: new Date().toISOString(),
      },
      input.actorUserId,
      input.correlationId
    )
  );

  return { component, entitlements: results, split };
}

export async function postEnterpriseCommission(
  client: SupabaseClient,
  input: {
    revenueComponentKey: string;
    eligibleEventRevenueMinor: number;
    hasValidAttribution: boolean;
    ebdpUserId?: string | null;
    attributionRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const calc = calculateEnterpriseEntitlement({
    eligibleEventRevenueMinor: input.eligibleEventRevenueMinor,
    hasValidAttribution: input.hasValidAttribution,
  });

  const component = await recogniseRevenueComponent(client, {
    revenueComponentKey: input.revenueComponentKey,
    vertical: "enterprise",
    domainObjectType: "enterprise_project_component",
    grossAmountMinor: input.eligibleEventRevenueMinor,
    eligibleBaseMinor: input.eligibleEventRevenueMinor,
    markRecognised: true,
    attributionSnapshot: {
      hasValidAttribution: input.hasValidAttribution,
      attributionRef: input.attributionRef ?? null,
    },
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  if (calc.entitledEbdp) {
    await claimComponent(
      client,
      input.revenueComponentKey,
      "enterprise",
      "enterprise_bdp"
    );
  }

  const entitlement = await insertEntitlement(
    client,
    {
      earning_event_key: `ent:${input.revenueComponentKey}:ebdp`,
      revenue_component_id: component.id,
      revenue_component_key: input.revenueComponentKey,
      stakeholder_user_id: input.ebdpUserId ?? null,
      stakeholder_type: "enterprise_bdp",
      source_vertical: "enterprise",
      attribution_ref: input.attributionRef ?? null,
      rule_key: "enterprise_bdp_commission",
      rule_version: calc.ruleVersion,
      gross_eligible_basis_minor: calc.platformCommissionMinor,
      rate_bps: 2500,
      gross_entitlement_minor: calc.ebdpEntitlementMinor,
      recovery_deduction_minor: 0,
      reversal_amount_minor: 0,
      net_settlement_eligible_minor: calc.ebdpEntitlementMinor,
      status: calc.entitledEbdp ? "earned" : "estimated",
      recognised_at: new Date().toISOString(),
    },
    input.actorUserId,
    input.correlationId
  );

  return { component, entitlement, calc };
}

export async function applyRecoveryToEntitlement(
  client: SupabaseClient,
  input: {
    entitlementId: string;
    cycleKey: string;
    remainingRecoverableMinor: number;
    packOrUnitRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: ent, error } = await client
    .from("stakeholder_entitlements")
    .select("*")
    .eq("id", input.entitlementId)
    .single();
  if (error || !ent) {
    throw new AppError("NOT_FOUND", "Entitlement not found", { status: 404 });
  }
  if (!["earned", "settlement_eligible", "approved"].includes(ent.status)) {
    throw new AppError(
      "CONFLICT",
      "Recovery only from earned/approved commission paths (FD-029)",
      { status: 409 }
    );
  }

  const available =
    Number(ent.gross_entitlement_minor) -
    Number(ent.recovery_deduction_minor) -
    Number(ent.reversal_amount_minor);
  const applied = recoveryForCycle({
    remainingRecoverableMinor: input.remainingRecoverableMinor,
    approvedCommissionMinor: available,
    capMinor: RECOVERY_CYCLE_CAP_MINOR,
  });

  const { data: recovery, error: rErr } = await client
    .from("recovery_applications")
    .insert({
      entitlement_id: ent.id,
      vertical: ent.source_vertical,
      pack_or_unit_ref: input.packOrUnitRef ?? null,
      cycle_key: input.cycleKey,
      remaining_before_minor: input.remainingRecoverableMinor,
      applied_minor: applied,
      remaining_after_minor: input.remainingRecoverableMinor - applied,
      cap_minor: RECOVERY_CYCLE_CAP_MINOR,
      created_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (rErr || !recovery) {
    throw new AppError("INTERNAL_ERROR", "Failed to apply recovery", {
      cause: rErr,
    });
  }

  const newRecovery = Number(ent.recovery_deduction_minor) + applied;
  const { data: updated, error: uErr } = await client
    .from("stakeholder_entitlements")
    .update({
      recovery_deduction_minor: newRecovery,
      net_settlement_eligible_minor: netAfterRecovery(
        Number(ent.gross_entitlement_minor),
        newRecovery,
        Number(ent.reversal_amount_minor)
      ),
    })
    .eq("id", ent.id)
    .select("*")
    .single();
  if (uErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to update entitlement recovery", {
      cause: uErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.recovery.apply",
    resourceType: "recovery_application",
    resourceId: String(recovery.id),
    after: recovery,
    correlationId: input.correlationId,
  });
  return { entitlement: updated, recovery };
}

export async function placeFinancialHold(
  client: SupabaseClient,
  input: {
    scopeType: string;
    scopeId: string;
    reason: string;
    amountMinor?: number | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("financial_holds")
    .insert({
      scope_type: input.scopeType,
      scope_id: input.scopeId,
      reason: input.reason,
      amount_minor: input.amountMinor ?? null,
      actor_user_id: input.actorUserId,
      status: "active",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to place hold", { cause: error });
  }

  if (input.scopeType === "entitlement") {
    const { data: ent } = await client
      .from("stakeholder_entitlements")
      .select("status")
      .eq("id", input.scopeId)
      .maybeSingle();
    if (ent) {
      await client
        .from("stakeholder_entitlements")
        .update({ status: "on_hold" })
        .eq("id", input.scopeId);
      await client.from("entitlement_events").insert({
        entitlement_id: input.scopeId,
        from_status: ent.status,
        to_status: "on_hold",
        actor_user_id: input.actorUserId,
        reason: input.reason,
      });
    }
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.hold.place",
    resourceType: "financial_hold",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function releaseFinancialHold(
  client: SupabaseClient,
  input: {
    holdId: string;
    actorUserId: string;
    restoreStatus?: string;
    correlationId?: string;
  }
) {
  const { data: hold, error } = await client
    .from("financial_holds")
    .select("*")
    .eq("id", input.holdId)
    .single();
  if (error || !hold) {
    throw new AppError("NOT_FOUND", "Hold not found", { status: 404 });
  }
  const { data, error: upErr } = await client
    .from("financial_holds")
    .update({
      status: "released",
      released_at: new Date().toISOString(),
      released_by: input.actorUserId,
    })
    .eq("id", input.holdId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to release hold", {
      cause: upErr,
    });
  }
  if (hold.scope_type === "entitlement") {
    const restore = input.restoreStatus ?? "earned";
    await client
      .from("stakeholder_entitlements")
      .update({ status: restore })
      .eq("id", hold.scope_id);
    await client.from("entitlement_events").insert({
      entitlement_id: hold.scope_id,
      from_status: "on_hold",
      to_status: restore,
      actor_user_id: input.actorUserId,
      reason: "hold_released",
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.hold.release",
    resourceType: "financial_hold",
    resourceId: input.holdId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function reverseEntitlement(
  client: SupabaseClient,
  input: {
    entitlementId: string;
    amountMinor: number;
    reason: string;
    refundRef?: string | null;
    chargebackRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: ent, error } = await client
    .from("stakeholder_entitlements")
    .select("*")
    .eq("id", input.entitlementId)
    .single();
  if (error || !ent) {
    throw new AppError("NOT_FOUND", "Entitlement not found", { status: 404 });
  }
  if (input.amountMinor <= 0) {
    throw new AppError("VALIDATION_ERROR", "Reversal amount must be positive", {
      status: 400,
    });
  }
  const newReversal = Number(ent.reversal_amount_minor) + input.amountMinor;
  if (newReversal > Number(ent.gross_entitlement_minor)) {
    throw new AppError("CONFLICT", "Cannot reverse more than gross entitlement", {
      status: 409,
    });
  }

  const full = newReversal === Number(ent.gross_entitlement_minor);
  const status = full ? "reversed" : "partially_reversed";

  const { data: rev, error: rErr } = await client
    .from("financial_reversals")
    .insert({
      original_entitlement_id: ent.id,
      original_revenue_component_id: ent.revenue_component_id,
      amount_minor: input.amountMinor,
      reason: input.reason,
      refund_ref: input.refundRef ?? null,
      chargeback_ref: input.chargebackRef ?? null,
      actor_user_id: input.actorUserId,
    })
    .select("*")
    .single();
  if (rErr || !rev) {
    throw new AppError("INTERNAL_ERROR", "Failed to create reversal", {
      cause: rErr,
    });
  }

  const { data: updated, error: uErr } = await client
    .from("stakeholder_entitlements")
    .update({
      reversal_amount_minor: newReversal,
      net_settlement_eligible_minor: netAfterRecovery(
        Number(ent.gross_entitlement_minor),
        Number(ent.recovery_deduction_minor),
        newReversal
      ),
      status,
    })
    .eq("id", ent.id)
    .select("*")
    .single();
  if (uErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to reverse entitlement", {
      cause: uErr,
    });
  }
  await client.from("entitlement_events").insert({
    entitlement_id: ent.id,
    from_status: ent.status,
    to_status: status,
    actor_user_id: input.actorUserId,
    reason: input.reason,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.entitlement.reverse",
    resourceType: "financial_reversal",
    resourceId: String(rev.id),
    after: rev,
    correlationId: input.correlationId,
  });
  return { entitlement: updated, reversal: rev };
}

export async function markSettlementEligible(
  client: SupabaseClient,
  input: { entitlementId: string; actorUserId: string; correlationId?: string }
) {
  const { data: ent, error } = await client
    .from("stakeholder_entitlements")
    .select("*")
    .eq("id", input.entitlementId)
    .single();
  if (error || !ent) {
    throw new AppError("NOT_FOUND", "Entitlement not found", { status: 404 });
  }
  if (["reversed", "cancelled", "on_hold", "paid"].includes(ent.status)) {
    throw new AppError("CONFLICT", `Cannot mark ${ent.status} settlement-eligible`, {
      status: 409,
    });
  }
  const { data: hold } = await client
    .from("financial_holds")
    .select("id")
    .eq("scope_type", "entitlement")
    .eq("scope_id", input.entitlementId)
    .eq("status", "active")
    .maybeSingle();
  if (hold) {
    throw new AppError("CONFLICT", "Active hold blocks settlement eligibility", {
      status: 409,
    });
  }
  if (Number(ent.net_settlement_eligible_minor) <= 0) {
    throw new AppError("CONFLICT", "Net settlement-eligible amount is zero", {
      status: 409,
    });
  }

  const { data, error: upErr } = await client
    .from("stakeholder_entitlements")
    .update({ status: "settlement_eligible" })
    .eq("id", input.entitlementId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to mark settlement eligible", {
      cause: upErr,
    });
  }
  await client.from("entitlement_events").insert({
    entitlement_id: input.entitlementId,
    from_status: ent.status,
    to_status: "settlement_eligible",
    actor_user_id: input.actorUserId,
  });
  return data;
}

export async function approveEntitlement(
  client: SupabaseClient,
  input: { entitlementId: string; actorUserId: string; correlationId?: string }
) {
  const { data: ent, error } = await client
    .from("stakeholder_entitlements")
    .select("*")
    .eq("id", input.entitlementId)
    .single();
  if (error || !ent) {
    throw new AppError("NOT_FOUND", "Entitlement not found", { status: 404 });
  }
  if (ent.stakeholder_user_id === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Beneficiary cannot self-approve", {
      status: 403,
    });
  }
  if (ent.status !== "settlement_eligible" && ent.status !== "earned") {
    throw new AppError("CONFLICT", "Entitlement not approvable in current state", {
      status: 409,
    });
  }
  const { data, error: upErr } = await client
    .from("stakeholder_entitlements")
    .update({
      status: "approved",
      approved_by: input.actorUserId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.entitlementId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to approve entitlement", {
      cause: upErr,
    });
  }
  await client.from("entitlement_events").insert({
    entitlement_id: input.entitlementId,
    from_status: ent.status,
    to_status: "approved",
    actor_user_id: input.actorUserId,
  });
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.entitlement.approve",
    resourceType: "stakeholder_entitlement",
    resourceId: input.entitlementId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

function batchRef(): string {
  return `SB-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

export async function generateSettlementBatch(
  client: SupabaseClient,
  input: {
    periodStart: string;
    periodEnd: string;
    vertical?: "connect" | "marketplace" | "enterprise" | "cross_vertical";
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: ents, error } = await client
    .from("stakeholder_entitlements")
    .select("*")
    .eq("status", "approved")
    .is("settlement_batch_id", null)
    .gt("net_settlement_eligible_minor", 0);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load entitlements", {
      cause: error,
    });
  }

  let rows = ents ?? [];
  if (input.vertical && input.vertical !== "cross_vertical") {
    rows = rows.filter((e) => e.source_vertical === input.vertical);
  }

  const { data: batch, error: bErr } = await client
    .from("settlement_batches")
    .insert({
      batch_ref: batchRef(),
      period_start: input.periodStart,
      period_end: input.periodEnd,
      vertical: input.vertical ?? "cross_vertical",
      status: "generated",
      generated_at: new Date().toISOString(),
      item_count: rows.length,
      gross_total_minor: rows.reduce(
        (s, e) => s + Number(e.gross_entitlement_minor),
        0
      ),
      recovery_total_minor: rows.reduce(
        (s, e) => s + Number(e.recovery_deduction_minor),
        0
      ),
      net_total_minor: rows.reduce(
        (s, e) => s + Number(e.net_settlement_eligible_minor),
        0
      ),
    })
    .select("*")
    .single();
  if (bErr || !batch) {
    throw new AppError("INTERNAL_ERROR", "Failed to create settlement batch", {
      cause: bErr,
    });
  }

  if (rows.length) {
    const items = rows.map((e) => ({
      batch_id: batch.id,
      entitlement_id: e.id,
      gross_minor: e.gross_entitlement_minor,
      recovery_minor: e.recovery_deduction_minor,
      net_minor: e.net_settlement_eligible_minor,
    }));
    const { error: iErr } = await client
      .from("settlement_batch_items")
      .insert(items);
    if (iErr) {
      throw new AppError("INTERNAL_ERROR", "Failed to create batch items", {
        cause: iErr,
      });
    }
    await client
      .from("stakeholder_entitlements")
      .update({ status: "payable", settlement_batch_id: batch.id })
      .in(
        "id",
        rows.map((e) => e.id)
      );
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.settlement.generate",
    resourceType: "settlement_batch",
    resourceId: String(batch.id),
    after: batch,
    correlationId: input.correlationId,
  });
  return batch;
}

export async function approveSettlementBatch(
  client: SupabaseClient,
  input: { batchId: string; actorUserId: string; correlationId?: string }
) {
  const { data: batch, error } = await client
    .from("settlement_batches")
    .select("*")
    .eq("id", input.batchId)
    .single();
  if (error || !batch) {
    throw new AppError("NOT_FOUND", "Batch not found", { status: 404 });
  }

  const { data, error: upErr } = await client
    .from("settlement_batches")
    .update({
      status: "payout_ready",
      approved_at: new Date().toISOString(),
      approved_by: input.actorUserId,
    })
    .eq("id", input.batchId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to approve batch", {
      cause: upErr,
    });
  }

  const { data: items } = await client
    .from("settlement_batch_items")
    .select("*")
    .eq("batch_id", input.batchId);

  for (const item of items ?? []) {
    const { data: ent } = await client
      .from("stakeholder_entitlements")
      .select("stakeholder_user_id, stakeholder_org_id, stakeholder_type")
      .eq("id", item.entitlement_id)
      .maybeSingle();
    await client.from("payout_items").insert({
      batch_id: input.batchId,
      batch_item_id: item.id,
      payee_user_id: ent?.stakeholder_user_id ?? null,
      payee_org_id: ent?.stakeholder_org_id ?? null,
      stakeholder_type: ent?.stakeholder_type ?? "unknown",
      gross_minor: item.gross_minor,
      recovery_minor: item.recovery_minor,
      deductions_minor: 0,
      net_minor: item.net_minor,
      status: "payout_ready",
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.settlement.approve",
    resourceType: "settlement_batch",
    resourceId: input.batchId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/** Execution is always blocked while settlement_execution / payout_execution OFF. */
export async function attemptSettlementExecution(
  client: SupabaseClient,
  input: { batchId: string; actorUserId: string; correlationId?: string }
) {
  const { data: flags } = await client
    .from("feature_flags")
    .select("key, enabled")
    .in("key", ["settlement_execution", "payout_execution"]);

  const enabled = (flags ?? []).every((f) => f.enabled === true);
  const { data, error } = await client
    .from("settlement_batches")
    .update({
      status: enabled ? "executed" : "execution_blocked",
      executed_at: enabled ? new Date().toISOString() : null,
      execution_blocked_reason: enabled
        ? null
        : "settlement_execution/payout_execution flags OFF (FD-039)",
    })
    .eq("id", input.batchId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to transition settlement execution", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.settlement.execute_attempt",
    resourceType: "settlement_batch",
    resourceId: input.batchId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function recordOfflinePayment(
  client: SupabaseClient,
  input: {
    sourceDomain: string;
    sourceId?: string | null;
    payerUserId?: string | null;
    amountMinor: number;
    method: "neft" | "rtgs" | "cheque" | "bank_transfer";
    bankReference: string;
    receivedOn: string;
    proofRef?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  if (input.method === ("cash" as string)) {
    throw new AppError("VALIDATION_ERROR", "Cash is not a normal activation path", {
      status: 400,
    });
  }
  const { data, error } = await client
    .from("offline_payment_records")
    .insert({
      source_domain: input.sourceDomain,
      source_id: input.sourceId ?? null,
      payer_user_id: input.payerUserId ?? null,
      amount_minor: input.amountMinor,
      method: input.method,
      bank_reference: input.bankReference,
      received_on: input.receivedOn,
      proof_ref: input.proofRef ?? null,
      recorded_by: input.actorUserId,
      reconciliation_status: "unmatched",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record offline payment", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.offline.record",
    resourceType: "offline_payment_record",
    resourceId: String(data.id),
    after: { ...data, bank_reference: "[redacted]" },
    correlationId: input.correlationId,
  });
  return data;
}

export async function verifyOfflinePayment(
  client: SupabaseClient,
  input: {
    offlinePaymentId: string;
    actorUserId: string;
    matchedPaymentIntentId?: string | null;
    correlationId?: string;
  }
) {
  const { data: row, error } = await client
    .from("offline_payment_records")
    .select("*")
    .eq("id", input.offlinePaymentId)
    .single();
  if (error || !row) {
    throw new AppError("NOT_FOUND", "Offline payment not found", { status: 404 });
  }
  if (row.recorded_by === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Recorder cannot verify own offline payment (dual control)",
      { status: 403 }
    );
  }
  const { data, error: upErr } = await client
    .from("offline_payment_records")
    .update({
      verified_by: input.actorUserId,
      reconciliation_status: input.matchedPaymentIntentId ? "matched" : "under_review",
      matched_payment_intent_id: input.matchedPaymentIntentId ?? null,
    })
    .eq("id", input.offlinePaymentId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to verify offline payment", {
      cause: upErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.offline.verify",
    resourceType: "offline_payment_record",
    resourceId: input.offlinePaymentId,
    after: { ...data, bank_reference: "[redacted]" },
    correlationId: input.correlationId,
  });
  return data;
}

export async function openChargebackCase(
  client: SupabaseClient,
  input: {
    providerDisputeRef: string;
    paymentIntentId?: string | null;
    revenueComponentId?: string | null;
    amountMinor: number;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const hold = await placeFinancialHold(client, {
    scopeType: input.revenueComponentId ? "transaction" : "stakeholder",
    scopeId: input.revenueComponentId ?? input.paymentIntentId ?? cryptoRandomUuid(),
    reason: `chargeback:${input.providerDisputeRef}`,
    amountMinor: input.amountMinor,
    actorUserId: input.actorUserId,
    correlationId: input.correlationId,
  });

  const { data, error } = await client
    .from("chargeback_cases")
    .insert({
      provider_dispute_ref: input.providerDisputeRef,
      payment_intent_id: input.paymentIntentId ?? null,
      revenue_component_id: input.revenueComponentId ?? null,
      amount_minor: input.amountMinor,
      status: "opened",
      provisional_hold_id: hold.id,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to open chargeback", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.chargeback.open",
    resourceType: "chargeback_case",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createFinancialCorrection(
  client: SupabaseClient,
  input: {
    correctionKey: string;
    subjectType: string;
    subjectId: string;
    reason: string;
    amountMinor: number;
    actorUserId: string;
    approverUserId: string;
    correlationId?: string;
  }
) {
  if (input.actorUserId === input.approverUserId) {
    throw new AppError("FORBIDDEN", "Correction requires distinct approver", {
      status: 403,
    });
  }
  const { data, error } = await client
    .from("financial_corrections")
    .insert({
      correction_key: input.correctionKey,
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      reason: input.reason,
      amount_minor: input.amountMinor,
      actor_user_id: input.actorUserId,
      approved_by: input.approverUserId,
      status: "posted",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create correction", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.correction.create",
    resourceType: "financial_correction",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function postBalancedLedger(
  client: SupabaseClient,
  input: Parameters<typeof postFinancialTransaction>[1]
) {
  assertBalancedEntries(input.entries);
  return postFinancialTransaction(client, input);
}

export async function createReconciliationRecord(
  client: SupabaseClient,
  input: {
    domain: string;
    leftRef: string;
    rightRef?: string | null;
    status: "matched" | "unmatched" | "mismatch" | "duplicate" | "under_review" | "resolved";
    amountMinor?: number | null;
    notes?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("reconciliation_records")
    .insert({
      domain: input.domain,
      left_ref: input.leftRef,
      right_ref: input.rightRef ?? null,
      status: input.status,
      amount_minor: input.amountMinor ?? null,
      notes: input.notes ?? null,
      exception_queue: ["unmatched", "mismatch", "duplicate"].includes(
        input.status
      ),
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create reconciliation record", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "finance.reconciliation.create",
    resourceType: "reconciliation_record",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}
