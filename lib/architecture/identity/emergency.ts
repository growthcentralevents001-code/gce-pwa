import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export type EmergencyGrant = {
  id: string;
  granteeUserId: string;
  status: "requested" | "active" | "revoked" | "expired" | "denied";
  reason: string;
  effectiveFrom: string | null;
  effectiveTo: string | null;
};

/**
 * Restricted root/emergency capability (FD-035 / FD-039).
 * Not a product workspace. Requires privileged server client + reason.
 */
export async function activateEmergencyAccess(
  client: SupabaseClient,
  input: {
    granteeUserId: string;
    reason: string;
    actorUserId: string;
    durationMinutes?: number;
    ticketRef?: string | null;
    correlationId?: string;
  }
): Promise<EmergencyGrant> {
  if (input.granteeUserId === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Emergency access cannot be self-activated",
      { status: 403, details: { rule: "sod_emergency_self_ban" } }
    );
  }
  if (!input.reason || input.reason.trim().length < 12) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Emergency access requires a detailed reason",
      { status: 400 }
    );
  }

  const from = new Date();
  const to = new Date(
    from.getTime() + (input.durationMinutes ?? 60) * 60_000
  );

  const { data, error } = await client
    .from("emergency_access_grants")
    .insert({
      grantee_user_id: input.granteeUserId,
      status: "active",
      reason: input.reason.trim(),
      ticket_ref: input.ticketRef ?? null,
      approved_by: input.actorUserId,
      effective_from: from.toISOString(),
      effective_to: to.toISOString(),
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to activate emergency access", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "emergency_access.activate",
    resourceType: "emergency_access_grant",
    resourceId: String(data.id),
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
    isManualOverride: true,
  });

  return mapGrant(data as Record<string, unknown>);
}

export async function revokeEmergencyAccess(
  client: SupabaseClient,
  input: {
    grantId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
): Promise<void> {
  const { data, error } = await client
    .from("emergency_access_grants")
    .update({
      status: "revoked",
      revoked_by: input.actorUserId,
    })
    .eq("id", input.grantId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to revoke emergency access", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "emergency_access.revoke",
    resourceType: "emergency_access_grant",
    resourceId: input.grantId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
    isManualOverride: true,
  });
}

export async function recordEmergencyUse(
  client: SupabaseClient,
  input: {
    grantId: string;
    actorUserId: string;
    action: string;
    reason: string;
    resourceType?: string;
    resourceId?: string;
    correlationId?: string;
  }
): Promise<void> {
  if (!input.reason || input.reason.trim().length < 12) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Emergency use requires a detailed reason",
      { status: 400 }
    );
  }

  const { data: grant, error: gErr } = await client
    .from("emergency_access_grants")
    .select("*")
    .eq("id", input.grantId)
    .eq("status", "active")
    .maybeSingle();

  if (gErr || !grant) {
    throw new AppError("FORBIDDEN", "No active emergency grant", { status: 403 });
  }

  const { error } = await client.from("emergency_access_uses").insert({
    grant_id: input.grantId,
    actor_user_id: input.actorUserId,
    action: input.action,
    resource_type: input.resourceType ?? null,
    resource_id: input.resourceId ?? null,
    reason: input.reason.trim(),
    correlation_id: input.correlationId ?? null,
  });

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to record emergency use", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "emergency_access.use",
    resourceType: input.resourceType ?? "emergency_access",
    resourceId: input.resourceId ?? input.grantId,
    reason: input.reason,
    correlationId: input.correlationId,
    isManualOverride: true,
    metadata: { grantId: input.grantId, emergencyAction: input.action },
  });
}

function mapGrant(row: Record<string, unknown>): EmergencyGrant {
  return {
    id: String(row.id),
    granteeUserId: String(row.grantee_user_id),
    status: row.status as EmergencyGrant["status"],
    reason: String(row.reason),
    effectiveFrom: (row.effective_from as string | null) ?? null,
    effectiveTo: (row.effective_to as string | null) ?? null,
  };
}
