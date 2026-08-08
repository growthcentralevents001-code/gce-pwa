import type { SupabaseClient } from "@supabase/supabase-js";
import type { RoleAssignment } from "../types";
import type { RoleAssignmentCreateInput } from "../validation/schemas";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

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

/**
 * Creates an assignment. Callers must enforce SoD (no self-grant of privileged roles)
 * and must not treat legacy enum as sufficient entitlement.
 */
export async function createRoleAssignment(
  client: SupabaseClient,
  input: RoleAssignmentCreateInput,
  actor: { userId: string; correlationId?: string }
): Promise<RoleAssignment> {
  if (input.userId === actor.userId && input.roleKey.endsWith("_admin")) {
    throw new AppError("FORBIDDEN", "Users may not self-grant admin assignments", {
      status: 403,
    });
  }

  const { data, error } = await client
    .from("role_assignments")
    .insert({
      user_id: input.userId,
      role_key: input.roleKey,
      status: input.status ?? "pending",
      scope_type: input.scopeType ?? "platform",
      scope_id: input.scopeId ?? null,
      organisation_id: input.organisationId ?? null,
      title: input.title ?? null,
      granted_by: actor.userId,
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

  await client.from("role_assignment_events").insert({
    assignment_id: data.id,
    event_type: "created",
    to_status: data.status,
    actor_user_id: actor.userId,
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
