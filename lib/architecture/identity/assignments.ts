import type { SupabaseClient } from "@supabase/supabase-js";
import type { AssignmentStatus, RoleAssignment } from "../types";
import type { RoleAssignmentCreateInput } from "../validation/schemas";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import {
  assertAssignmentSoD,
  requiresElevatedApprover,
  roleAssignmentMachine,
} from "./sod";
import {
  buildPermissionContext,
  canManageRole,
  requirePermission,
} from "../rbac/authz";

function mapAssignmentRow(row: Record<string, unknown>): RoleAssignment {
  return {
    id: String(row.id),
    userId: String(row.user_id),
    roleKey: row.role_key as RoleAssignment["roleKey"],
    status: row.status as RoleAssignment["status"],
    scopeType: row.scope_type as RoleAssignment["scopeType"],
    scopeId: (row.scope_id as string | null) ?? null,
    organisationId: (row.organisation_id as string | null) ?? null,
    effectiveFrom: String(row.effective_from),
    effectiveTo: (row.effective_to as string | null) ?? null,
  };
}

async function appendAssignmentEvent(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    eventType: string;
    fromStatus?: AssignmentStatus | null;
    toStatus?: AssignmentStatus | null;
    actorUserId: string;
    reason?: string | null;
    metadata?: Record<string, unknown>;
  }
): Promise<void> {
  const { error } = await client.from("role_assignment_events").insert({
    assignment_id: input.assignmentId,
    event_type: input.eventType,
    from_status: input.fromStatus ?? null,
    to_status: input.toStatus ?? null,
    actor_user_id: input.actorUserId,
    reason: input.reason ?? null,
    metadata: input.metadata ?? {},
  });
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to write assignment event", {
      cause: error,
    });
  }
}

export async function listRoleAssignmentsForUser(
  client: SupabaseClient,
  userId: string
): Promise<RoleAssignment[]> {
  const { data, error } = await client
    .from("role_assignments")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load role assignments", {
      cause: error,
    });
  }
  return (data ?? []).map((r) => mapAssignmentRow(r as Record<string, unknown>));
}

export async function getRoleAssignment(
  client: SupabaseClient,
  assignmentId: string
): Promise<RoleAssignment | null> {
  const { data, error } = await client
    .from("role_assignments")
    .select("*")
    .eq("id", assignmentId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load role assignment", {
      cause: error,
    });
  }
  return data ? mapAssignmentRow(data as Record<string, unknown>) : null;
}

/**
 * Creates an assignment (typically pending). Canonical entitlement source is this table.
 * Callers must pass actor assignments for SoD/RBAC checks.
 */
export async function createRoleAssignment(
  client: SupabaseClient,
  input: RoleAssignmentCreateInput,
  actor: {
    userId: string;
    assignments: RoleAssignment[];
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  const ctx = buildPermissionContext({
    userId: actor.userId,
    assignments: actor.assignments,
  });
  requirePermission(ctx, "role_assignment.create");
  if (!canManageRole(ctx, input.roleKey)) {
    throw new AppError("FORBIDDEN", "Cannot manage this role key", {
      status: 403,
      details: { roleKey: input.roleKey },
    });
  }

  assertAssignmentSoD({
    actorUserId: actor.userId,
    targetUserId: input.userId,
    roleKey: input.roleKey,
    action: "create",
  });

  const initialStatus = input.status ?? "pending";
  if (
    initialStatus === "active" &&
    requiresElevatedApprover(input.roleKey) &&
    actor.userId === input.userId
  ) {
    throw new AppError("FORBIDDEN", "Privileged roles cannot self-activate", {
      status: 403,
    });
  }

  const { data, error } = await client
    .from("role_assignments")
    .insert({
      user_id: input.userId,
      role_key: input.roleKey,
      status: initialStatus,
      scope_type: input.scopeType ?? "platform",
      scope_id: input.scopeId ?? null,
      organisation_id: input.organisationId ?? null,
      title: input.title ?? null,
      granted_by: actor.userId,
      approved_by:
        initialStatus === "active" && actor.userId !== input.userId
          ? actor.userId
          : null,
      approved_at:
        initialStatus === "active" && actor.userId !== input.userId
          ? new Date().toISOString()
          : null,
      effective_from: input.effectiveFrom ?? new Date().toISOString(),
      effective_to: input.effectiveTo ?? null,
      metadata: { reason: input.reason ?? null },
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create role assignment", {
      cause: error,
    });
  }

  await appendAssignmentEvent(client, {
    assignmentId: String(data.id),
    eventType: "created",
    toStatus: data.status as AssignmentStatus,
    actorUserId: actor.userId,
    reason: input.reason ?? null,
  });

  await writeAuditEvent(client, {
    actorUserId: actor.userId,
    action: "role_assignment.create",
    resourceType: "role_assignment",
    resourceId: String(data.id),
    after: data,
    correlationId: actor.correlationId,
    reason: input.reason,
  });

  return mapAssignmentRow(data as Record<string, unknown>);
}

async function transitionAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    transition: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    permission:
      | "role_assignment.approve"
      | "role_assignment.suspend"
      | "role_assignment.revoke";
    correlationId?: string;
    patch?: Record<string, unknown>;
  }
): Promise<RoleAssignment> {
  if (!input.reason || input.reason.trim().length < 3) {
    throw new AppError("VALIDATION_ERROR", "Reason is required", { status: 400 });
  }

  const { data: existing, error: loadErr } = await client
    .from("role_assignments")
    .select("*")
    .eq("id", input.assignmentId)
    .single();

  if (loadErr || !existing) {
    throw new AppError("NOT_FOUND", "Role assignment not found", { status: 404 });
  }

  const current = existing.status as AssignmentStatus;
  const next = await roleAssignmentMachine.transition(current, input.transition, {
    actorUserId: input.actorUserId,
    reason: input.reason,
  });

  const ctx = buildPermissionContext({
    userId: input.actorUserId,
    assignments: input.actorAssignments,
    isSelfSubject: String(existing.user_id) === input.actorUserId,
  });
  requirePermission(ctx, input.permission, {
    isSelfSubject: String(existing.user_id) === input.actorUserId,
  });

  if (input.transition === "activate" || input.transition === "reinstate") {
    assertAssignmentSoD({
      actorUserId: input.actorUserId,
      targetUserId: String(existing.user_id),
      roleKey: existing.role_key as RoleAssignment["roleKey"],
      action: "activate",
      approvedBy: input.actorUserId,
    });
  }

  const patch = {
    status: next,
    ...(input.patch ?? {}),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from("role_assignments")
    .update(patch)
    .eq("id", input.assignmentId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to update role assignment", {
      cause: error,
    });
  }

  await appendAssignmentEvent(client, {
    assignmentId: input.assignmentId,
    eventType: input.transition,
    fromStatus: current,
    toStatus: next,
    actorUserId: input.actorUserId,
    reason: input.reason,
  });

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: `role_assignment.${input.transition}`,
    resourceType: "role_assignment",
    resourceId: input.assignmentId,
    before: existing,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return mapAssignmentRow(data as Record<string, unknown>);
}

export async function activateRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    ...input,
    transition: "activate",
    permission: "role_assignment.approve",
    patch: {
      approved_by: input.actorUserId,
      approved_at: new Date().toISOString(),
      approval_reason: input.reason,
    },
  });
}

export async function suspendRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    ...input,
    transition: "suspend",
    permission: "role_assignment.suspend",
    patch: {
      suspended_by: input.actorUserId,
      suspended_at: new Date().toISOString(),
      suspend_reason: input.reason,
    },
  });
}

export async function reinstateRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    ...input,
    transition: "reinstate",
    permission: "role_assignment.approve",
    patch: {
      approved_by: input.actorUserId,
      approved_at: new Date().toISOString(),
      approval_reason: input.reason,
      suspended_by: null,
      suspended_at: null,
      suspend_reason: null,
    },
  });
}

export async function revokeRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    ...input,
    transition: "revoke",
    permission: "role_assignment.revoke",
    patch: {
      revoked_by: input.actorUserId,
      revoke_reason: input.reason,
    },
  });
}

export async function terminateRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    ...input,
    transition: "terminate",
    permission: "role_assignment.revoke",
    patch: {
      terminated_by: input.actorUserId,
      terminated_at: new Date().toISOString(),
      terminate_reason: input.reason,
    },
  });
}

export async function expireRoleAssignment(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    actorAssignments: RoleAssignment[];
    reason?: string;
    correlationId?: string;
  }
): Promise<RoleAssignment> {
  return transitionAssignment(client, {
    assignmentId: input.assignmentId,
    actorUserId: input.actorUserId,
    actorAssignments: input.actorAssignments,
    reason: input.reason ?? "Assignment expired",
    correlationId: input.correlationId,
    transition: "expire",
    permission: "role_assignment.suspend",
    patch: {
      effective_to: new Date().toISOString(),
    },
  });
}

/** Convenience aliases matching Phase 4 service naming. */
export const assignRole = createRoleAssignment;
export const suspendRole = suspendRoleAssignment;
export const revokeRole = revokeRoleAssignment;
