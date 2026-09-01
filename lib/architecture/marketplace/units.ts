import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import {
  mbdpPackageAmounts,
  MBDP_VENUES_PER_UNIT,
  MBDP_PACKAGE_RULE_VERSION,
  type MarketplaceBdpPackageOption,
} from "./constants";
import {
  createRoleAssignment,
  activateRoleAssignment,
  suspendRoleAssignment,
  listRoleAssignmentsForUser,
} from "../identity/assignments";
import type { RoleAssignment } from "../types";

export async function createMarketplaceBdpApplication(
  client: SupabaseClient,
  input: {
    userId: string;
    packageOption?: MarketplaceBdpPackageOption;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const option = input.packageOption ?? "finance_recovery_60000";
  const amounts = mbdpPackageAmounts(option);
  const { data, error } = await client
    .from("marketplace_bdp_units")
    .insert({
      user_id: input.userId,
      application_status: "draft",
      package_option: option,
      package_total_minor: amounts.packageTotalMinor,
      initial_payment_minor: amounts.initialPaymentMinor,
      recoverable_balance_minor: amounts.recoverableBalanceMinor,
      recovered_to_date_minor: 0,
      remaining_recoverable_minor: amounts.recoverableBalanceMinor,
      venues_capacity_max: MBDP_VENUES_PER_UNIT,
      pricing_rule_version: MBDP_PACKAGE_RULE_VERSION,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create MBDP application", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_bdp.application_create",
    resourceType: "marketplace_bdp_unit",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function acceptMbdpTerms(
  client: SupabaseClient,
  input: { unitId: string; actorUserId: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("marketplace_bdp_units")
    .update({ terms_accepted_at: new Date().toISOString() })
    .eq("id", input.unitId)
    .eq("user_id", input.actorUserId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("FORBIDDEN", "Unable to accept terms", {
      status: 403,
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_bdp.terms_accepted",
    resourceType: "marketplace_bdp_unit",
    resourceId: input.unitId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function recordMbdpPackPayment(
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
    .from("marketplace_bdp_units")
    .select("*")
    .eq("id", input.unitId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "MBDP unit not found", { status: 404 });
  }
  const { data, error: upErr } = await client
    .from("marketplace_bdp_units")
    .update({
      payment_intent_id: input.paymentIntentId ?? existing.payment_intent_id,
      offline_payment_ref:
        input.offlinePaymentRef ?? existing.offline_payment_ref,
      offline_recorded_by:
        input.offlineRecordedBy ?? existing.offline_recorded_by,
      application_status:
        existing.application_status === "draft" ||
        existing.application_status === "submitted" ||
        existing.application_status === "pending_payment"
          ? "pending_approval"
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
    action: "marketplace_bdp.pack_payment_recorded",
    resourceType: "marketplace_bdp_unit",
    resourceId: input.unitId,
    before: existing,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function activateMarketplaceBdpUnit(
  client: SupabaseClient,
  input: {
    unitId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    secondUnitApproved?: boolean;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: unit, error } = await client
    .from("marketplace_bdp_units")
    .select("*")
    .eq("id", input.unitId)
    .single();
  if (error || !unit) {
    throw new AppError("NOT_FOUND", "MBDP unit not found", { status: 404 });
  }
  if (unit.user_id === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Marketplace BDP cannot self-activate", {
      status: 403,
    });
  }
  if (unit.application_status === "active") return unit;
  if (!unit.terms_accepted_at) {
    throw new AppError("VALIDATION_ERROR", "Terms acceptance required", {
      status: 400,
    });
  }
  if (!unit.payment_intent_id && !unit.offline_payment_ref) {
    throw new AppError("VALIDATION_ERROR", "Pack payment required", {
      status: 400,
    });
  }

  const { data: otherActiveUnits } = await client
    .from("marketplace_bdp_units")
    .select("id")
    .eq("user_id", unit.user_id)
    .eq("application_status", "active")
    .neq("id", input.unitId)
    .limit(1);

  const secondUnitApproved =
    input.secondUnitApproved === true ||
    (otherActiveUnits?.length ?? 0) > 0;

  if (secondUnitApproved) {
    await client
      .from("marketplace_bdp_units")
      .update({
        metadata: {
          ...(typeof unit.metadata === "object" && unit.metadata
            ? (unit.metadata as object)
            : {}),
          second_unit_approved: true,
        },
      })
      .eq("id", input.unitId);
  }

  const subjectAssignments = await listRoleAssignmentsForUser(
    client,
    String(unit.user_id)
  );
  const existingMbdpRole = subjectAssignments.find(
    (a) => a.roleKey === "marketplace_bdp" && a.status === "active"
  );

  let activated: RoleAssignment;
  if (existingMbdpRole) {
    activated = existingMbdpRole;
  } else {
    const assignment = await createRoleAssignment(
      client,
      {
        userId: String(unit.user_id),
        roleKey: "marketplace_bdp",
        status: "pending",
        scopeType: "platform",
        reason: input.reason ?? "Marketplace BDP activation",
      },
      {
        userId: input.actorUserId,
        assignments: input.actorAssignments,
        correlationId: input.correlationId,
      }
    );
    activated = await activateRoleAssignment(client, {
      assignmentId: assignment.id,
      actorUserId: input.actorUserId,
      actorAssignments: input.actorAssignments,
      reason: input.reason ?? "Activate Marketplace BDP role",
      correlationId: input.correlationId,
    });
  }

  const { data, error: upErr } = await client
    .from("marketplace_bdp_units")
    .update({
      application_status: "active",
      role_assignment_id: activated.id,
      activated_at: new Date().toISOString(),
    })
    .eq("id", input.unitId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate MBDP unit", {
      cause: upErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_bdp.activate",
    resourceType: "marketplace_bdp_unit",
    resourceId: input.unitId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function suspendMarketplaceBdpUnit(
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
    .from("marketplace_bdp_units")
    .update({
      application_status: "suspended",
      suspended_at: new Date().toISOString(),
    })
    .eq("id", input.unitId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to suspend MBDP", {
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
      // unit status still suspended
    }
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_bdp.suspend",
    resourceType: "marketplace_bdp_unit",
    resourceId: input.unitId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function listMbdpUnitsForUser(
  client: SupabaseClient,
  userId: string
) {
  const { data, error } = await client
    .from("marketplace_bdp_units")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list MBDP units", {
      cause: error,
    });
  }
  return data ?? [];
}
