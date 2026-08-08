import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import {
  calculateConnectBdpCommission,
  CITY_TIER_MAX_UNITS,
  CONNECT_BDP_RULE_VERSION,
} from "./constants";

export async function upsertCityConfig(
  client: SupabaseClient,
  input: {
    city: string;
    state?: string | null;
    tier: "tier_1" | "tier_2" | "tier_3";
    actorUserId: string;
    correlationId?: string;
  }
) {
  const maxUnits = CITY_TIER_MAX_UNITS[input.tier];
  const { data, error } = await client
    .from("connect_bdp_city_configs")
    .upsert(
      {
        city: input.city,
        state: input.state ?? null,
        tier: input.tier,
        max_units: maxUnits,
        is_active: true,
      },
      { onConflict: "city" }
    )
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to upsert city config", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.city_config_upsert",
    resourceType: "connect_bdp_city_config",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function assignUnitToCity(
  client: SupabaseClient,
  input: {
    unitId: string;
    cityConfigId: string;
    zoneCode?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_city_assignments")
    .insert({
      unit_id: input.unitId,
      city_config_id: input.cityConfigId,
      zone_code: input.zoneCode ?? null,
      status: "active",
      assigned_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "City assignment failed", {
      status: 409,
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.city_assign",
    resourceType: "connect_bdp_city_assignment",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function proposeMemberAttribution(
  client: SupabaseClient,
  input: {
    membershipId: string;
    unitId: string;
    bdpUserId: string;
    provenance?: string;
    basis?: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_member_attributions")
    .insert({
      membership_id: input.membershipId,
      unit_id: input.unitId,
      bdp_user_id: input.bdpUserId,
      status: "proposed",
      provenance: input.provenance ?? "sourced",
      basis: input.basis ?? null,
      created_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to propose attribution", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_attr.proposed",
    resourceType: "connect_bdp_member_attribution",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/** Platform confirmation — BDP cannot self-approve. */
export async function activateMemberAttribution(
  client: SupabaseClient,
  input: {
    attributionId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: existing, error } = await client
    .from("connect_bdp_member_attributions")
    .select("*")
    .eq("id", input.attributionId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "Attribution not found", { status: 404 });
  }
  if (existing.bdp_user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Connect BDP cannot self-approve attribution",
      { status: 403 }
    );
  }

  const { data, error: upErr } = await client
    .from("connect_bdp_member_attributions")
    .update({
      status: "active",
      approved_by: input.actorUserId,
      effective_from: new Date().toISOString(),
      reason: input.reason ?? existing.reason,
    })
    .eq("id", input.attributionId)
    .select("*")
    .single();

  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate attribution", {
      cause: upErr,
    });
  }

  // Sync membership optional BDP pointer for Phase 5 compatibility
  await client
    .from("connect_memberships")
    .update({
      connect_bdp_user_id: data.bdp_user_id,
      connect_bdp_attribution_id: data.id,
      attribution_provenance: data.provenance,
    })
    .eq("id", data.membership_id);

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_attr.activated",
    resourceType: "connect_bdp_member_attribution",
    resourceId: input.attributionId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return data;
}

export async function assignCircleToUnit(
  client: SupabaseClient,
  input: {
    unitId: string;
    circleId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_circle_assignments")
    .insert({
      unit_id: input.unitId,
      circle_id: input.circleId,
      status: "active",
      assigned_by: input.actorUserId,
      reason: input.reason ?? null,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "Circle assignment failed", {
      status: 409,
      cause: error,
    });
  }

  await client.rpc("gce_connect_bdp_refresh_portfolio_counts", {
    p_unit_id: input.unitId,
  });

  // Attempt credit if Circle already formally activated
  try {
    await client.rpc("gce_connect_bdp_credit_circle_activation", {
      p_circle_id: input.circleId,
      p_actor: input.actorUserId,
    });
  } catch {
    // Circle may not be activated yet
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.circle_assign",
    resourceType: "connect_bdp_circle_assignment",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

/**
 * Entitlement boundary: no valid attribution ⇒ 0 BDP commission (not pending).
 */
export async function createCommissionEntitlement(
  client: SupabaseClient,
  input: {
    unitId: string;
    membershipId: string | null;
    attributionId: string | null;
    earningEventKey: string;
    eligibleRevenueMinor: number;
    hasValidAttribution: boolean;
    actorUserId: string;
    state?: "estimated" | "earned" | "settlement_eligible";
    correlationId?: string;
  }
) {
  const calc = calculateConnectBdpCommission(
    input.eligibleRevenueMinor,
    input.hasValidAttribution
  );

  const { data, error } = await client
    .from("connect_bdp_commission_entitlements")
    .upsert(
      {
        unit_id: input.unitId,
        membership_id: input.membershipId,
        attribution_id: input.attributionId,
        earning_event_key: input.earningEventKey,
        gross_eligible_revenue_minor: input.eligibleRevenueMinor,
        commission_bps: calc.commissionBps,
        gross_commission_minor: calc.grossCommissionMinor,
        state: calc.entitled
          ? (input.state ?? "earned")
          : "estimated",
        rule_version: CONNECT_BDP_RULE_VERSION,
        metadata: {
          entitled: calc.entitled,
          unattributed: !input.hasValidAttribution,
        },
      },
      { onConflict: "unit_id,earning_event_key" }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create entitlement", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.entitlement_recorded",
    resourceType: "connect_bdp_commission_entitlement",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function applyPackageRecovery(
  client: SupabaseClient,
  input: {
    unitId: string;
    entitlementId: string;
    cycleKey: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client.rpc("gce_connect_bdp_apply_recovery", {
    p_unit_id: input.unitId,
    p_entitlement_id: input.entitlementId,
    p_cycle_key: input.cycleKey,
    p_actor: input.actorUserId,
  });
  if (error) {
    throw new AppError("CONFLICT", error.message || "Recovery failed", {
      status: 409,
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.recovery_applied",
    resourceType: "connect_bdp_recovery_entry",
    resourceId: String((data as { id?: string })?.id ?? input.entitlementId),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function creditCircleActivation(
  client: SupabaseClient,
  input: { circleId: string; actorUserId: string; correlationId?: string }
) {
  const { data, error } = await client.rpc(
    "gce_connect_bdp_credit_circle_activation",
    {
      p_circle_id: input.circleId,
      p_actor: input.actorUserId,
    }
  );
  if (error) {
    throw new AppError("CONFLICT", error.message || "Target credit failed", {
      status: 409,
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.target_credit",
    resourceType: "connect_bdp_target_credit",
    resourceId: String((data as { id?: string } | null)?.id ?? input.circleId),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}
