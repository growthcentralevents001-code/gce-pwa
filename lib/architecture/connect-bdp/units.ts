import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import {
  packageAmounts,
  CONNECT_BDP_TARGET_MONTHS,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_CIRCLES_PER_UNIT,
  CONNECT_BDP_RULE_VERSION,
  type ConnectBdpPackageOption,
} from "./constants";
import { createRoleAssignment, activateRoleAssignment, suspendRoleAssignment } from "../identity/assignments";
import type { RoleAssignment } from "../types";

export async function createConnectBdpApplication(
  client: SupabaseClient,
  input: {
    userId: string;
    packageOption?: ConnectBdpPackageOption;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const option = input.packageOption ?? "finance_recovery_60000";
  const amounts = packageAmounts(option);

  const { data, error } = await client
    .from("connect_bdp_units")
    .insert({
      user_id: input.userId,
      application_status: "draft",
      package_option: option,
      package_total_minor: amounts.packageTotalMinor,
      initial_payment_minor: amounts.initialPaymentMinor,
      recoverable_balance_minor: amounts.recoverableBalanceMinor,
      recovered_to_date_minor: 0,
      remaining_recoverable_minor: amounts.recoverableBalanceMinor,
      target_window_months: CONNECT_BDP_TARGET_MONTHS,
      target_circles: CONNECT_BDP_TARGET_CIRCLES,
      circles_capacity_max: CONNECT_BDP_CIRCLES_PER_UNIT,
      pricing_rule_version: CONNECT_BDP_RULE_VERSION,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create Connect BDP application", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.application_create",
    resourceType: "connect_bdp_unit",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function recordConnectBdpPackPayment(
  client: SupabaseClient,
  input: {
    unitId: string;
    paymentIntentId?: string | null;
    offlinePaymentRef?: string | null;
    offlineRecordedBy?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: existing, error } = await client
    .from("connect_bdp_units")
    .select("*")
    .eq("id", input.unitId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "Connect BDP unit not found", { status: 404 });
  }

  // Payment alone does not activate — move to pending_approval/pending_verification
  const nextStatus =
    existing.application_status === "active"
      ? "active"
      : "pending_approval";

  const { data, error: upErr } = await client
    .from("connect_bdp_units")
    .update({
      payment_intent_id: input.paymentIntentId ?? existing.payment_intent_id,
      offline_payment_ref: input.offlinePaymentRef ?? existing.offline_payment_ref,
      offline_recorded_by: input.offlineRecordedBy ?? existing.offline_recorded_by,
      application_status:
        existing.application_status === "draft" ||
        existing.application_status === "submitted" ||
        existing.application_status === "pending_payment"
          ? nextStatus
          : existing.application_status,
    })
    .eq("id", input.unitId)
    .select("*")
    .single();

  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record pack payment", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.pack_payment_recorded",
    resourceType: "connect_bdp_unit",
    resourceId: input.unitId,
    before: existing,
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

/**
 * Platform activation — requires approval actor ≠ subject; creates connect_bdp role_assignment.
 */
export async function activateConnectBdpUnit(
  client: SupabaseClient,
  input: {
    unitId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: unit, error } = await client
    .from("connect_bdp_units")
    .select("*")
    .eq("id", input.unitId)
    .single();
  if (error || !unit) {
    throw new AppError("NOT_FOUND", "Connect BDP unit not found", { status: 404 });
  }
  if (unit.user_id === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Connect BDP cannot self-activate", {
      status: 403,
    });
  }
  if (unit.application_status === "active") {
    return unit; // idempotent
  }
  if (!unit.terms_accepted_at) {
    throw new AppError("VALIDATION_ERROR", "Terms acceptance required", {
      status: 400,
    });
  }
  if (!unit.payment_intent_id && !unit.offline_payment_ref) {
    throw new AppError("VALIDATION_ERROR", "Pack payment required before activation", {
      status: 400,
    });
  }

  const assignment = await createRoleAssignment(
    client,
    {
      userId: String(unit.user_id),
      roleKey: "connect_bdp",
      status: "pending",
      scopeType: "city",
      reason: input.reason ?? "Connect BDP activation",
    },
    {
      userId: input.actorUserId,
      assignments: input.actorAssignments,
      correlationId: input.correlationId,
    }
  );

  const activated = await activateRoleAssignment(client, {
    assignmentId: assignment.id,
    actorUserId: input.actorUserId,
    actorAssignments: input.actorAssignments,
    reason: input.reason ?? "Activate Connect BDP role",
    correlationId: input.correlationId,
  });

  const now = new Date();
  const { data, error: upErr } = await client
    .from("connect_bdp_units")
    .update({
      application_status: "active",
      role_assignment_id: activated.id,
      activated_at: now.toISOString(),
      target_start_at: now.toISOString(),
    })
    .eq("id", input.unitId)
    .select("*")
    .single();

  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate Connect BDP unit", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.activate",
    resourceType: "connect_bdp_unit",
    resourceId: input.unitId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return data;
}

export async function acceptConnectBdpTerms(
  client: SupabaseClient,
  input: { unitId: string; actorUserId: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("connect_bdp_units")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("id", input.unitId)
    .eq("user_id", input.actorUserId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("FORBIDDEN", "Unable to accept terms for unit", {
      status: 403,
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.terms_accepted",
    resourceType: "connect_bdp_unit",
    resourceId: input.unitId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function suspendConnectBdpUnit(
  client: SupabaseClient,
  input: {
    unitId: string;
    actorUserId: string;
    actorAssignments?: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("connect_bdp_units")
    .update({
      application_status: "suspended",
      suspended_at: new Date().toISOString(),
    })
    .eq("id", input.unitId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to suspend Connect BDP", {
      cause: error,
    });
  }

  if (data.role_assignment_id && input.actorAssignments) {
    try {
      await suspendRoleAssignment(client, {
        assignmentId: String(data.role_assignment_id),
        actorUserId: input.actorUserId,
        actorAssignments: input.actorAssignments,
        reason: input.reason,
        correlationId: input.correlationId,
      });
    } catch {
      // Unit status is suspended even if assignment transition races
    }
  }

  // Note: does not erase Recoverable Balance (FD-029)
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "connect_bdp.suspend",
    resourceType: "connect_bdp_unit",
    resourceId: input.unitId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function getConnectBdpUnit(client: SupabaseClient, unitId: string) {
  const { data, error } = await client
    .from("connect_bdp_units")
    .select("*")
    .eq("id", unitId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load unit", { cause: error });
  }
  return data;
}

export async function listConnectBdpUnitsForUser(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from("connect_bdp_units")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list units", { cause: error });
  }
  return data ?? [];
}
