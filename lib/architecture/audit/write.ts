import type { SupabaseClient } from "@supabase/supabase-js";
import { logStructured } from "../logging";

export type AuditWriteInput = {
  actorUserId?: string | null;
  actorAssignmentId?: string | null;
  workspaceKey?: string | null;
  action: string;
  resourceType: string;
  resourceId?: string | null;
  before?: unknown;
  after?: unknown;
  metadata?: Record<string, unknown>;
  reason?: string | null;
  source?: string;
  correlationId?: string | null;
  requestId?: string | null;
  isManualOverride?: boolean;
};

/**
 * Append-only audit writer. Callers should use a privileged server client when
 * authenticated inserts are restricted. Failures are logged; they do not silently succeed.
 */
export async function writeAuditEvent(
  client: SupabaseClient,
  input: AuditWriteInput
): Promise<{ id: string } | null> {
  const row = {
    actor_user_id: input.actorUserId ?? null,
    actor_assignment_id: input.actorAssignmentId ?? null,
    workspace_key: input.workspaceKey ?? null,
    action: input.action,
    resource_type: input.resourceType,
    resource_id: input.resourceId ?? null,
    before_data: input.before ?? null,
    after_data: input.after ?? null,
    metadata: input.metadata ?? {},
    reason: input.reason ?? null,
    source: input.source ?? "app",
    correlation_id: input.correlationId ?? null,
    request_id: input.requestId ?? null,
    is_manual_override: input.isManualOverride ?? false,
  };

  const { data, error } = await client
    .from("audit_events")
    .insert(row)
    .select("id")
    .single();

  if (error) {
    logStructured({
      level: "error",
      message: "audit_write_failed",
      code: "AUDIT_WRITE",
      correlationId: input.correlationId ?? undefined,
      meta: { error: error.message, action: input.action },
    });
    return null;
  }

  return { id: data.id as string };
}
