import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export type IdentitySuspension = {
  id: string;
  userId: string;
  status: "active" | "lifted" | "expired";
  reason: string;
  effectiveFrom: string;
  effectiveTo: string | null;
};

export async function getActiveIdentitySuspension(
  client: SupabaseClient,
  userId: string
): Promise<IdentitySuspension | null> {
  const { data, error } = await client
    .from("identity_suspensions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    // Table may be unavailable pre-migration in some environments.
    if (String(error.message).includes("identity_suspensions")) return null;
    throw new AppError("INTERNAL_ERROR", "Failed to load identity suspension", {
      cause: error,
    });
  }
  if (!data) return null;
  const row = data as Record<string, unknown>;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    status: row.status as IdentitySuspension["status"],
    reason: String(row.reason),
    effectiveFrom: String(row.effective_from),
    effectiveTo: (row.effective_to as string | null) ?? null,
  };
}

export async function suspendIdentity(
  client: SupabaseClient,
  input: {
    userId: string;
    reason: string;
    actorUserId: string;
    effectiveTo?: string | null;
    correlationId?: string;
  }
): Promise<IdentitySuspension> {
  if (input.userId === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Users may not suspend their own identity", {
      status: 403,
    });
  }
  if (!input.reason || input.reason.trim().length < 8) {
    throw new AppError("VALIDATION_ERROR", "Suspension reason is required", {
      status: 400,
    });
  }

  const { data, error } = await client
    .from("identity_suspensions")
    .insert({
      user_id: input.userId,
      status: "active",
      reason: input.reason.trim(),
      suspended_by: input.actorUserId,
      effective_to: input.effectiveTo ?? null,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to suspend identity", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "identity.suspend",
    resourceType: "user",
    resourceId: input.userId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  const row = data as Record<string, unknown>;
  return {
    id: String(row.id),
    userId: String(row.user_id),
    status: "active",
    reason: String(row.reason),
    effectiveFrom: String(row.effective_from),
    effectiveTo: (row.effective_to as string | null) ?? null,
  };
}

export async function liftIdentitySuspension(
  client: SupabaseClient,
  input: {
    suspensionId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
): Promise<void> {
  const { data, error } = await client
    .from("identity_suspensions")
    .update({
      status: "lifted",
      lifted_by: input.actorUserId,
      lifted_at: new Date().toISOString(),
    })
    .eq("id", input.suspensionId)
    .eq("status", "active")
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to lift identity suspension", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "identity.suspension_lift",
    resourceType: "identity_suspension",
    resourceId: input.suspensionId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
}
