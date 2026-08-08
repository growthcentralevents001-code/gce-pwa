import type { SupabaseClient } from "@supabase/supabase-js";
import type { WorkspaceKey } from "../types";
import { WORKSPACE_KEYS } from "../types";
import { AppError } from "../errors";
import {
  canAccessWorkspace,
  workspacesForAssignments,
} from "../workspace/registry";
import type { RoleAssignment } from "../types";
import { writeAuditEvent } from "../audit/write";

export function defaultWorkspaceForAssignments(
  assignments: RoleAssignment[]
): WorkspaceKey {
  const allowed = workspacesForAssignments(assignments);
  // Prefer last non-personal operational workspace if any, else personal.
  const operational = allowed.filter((k) => k !== "personal");
  return operational[0] ?? "personal";
}

export async function getWorkspacePreference(
  client: SupabaseClient,
  userId: string
): Promise<{
  lastWorkspaceKey: WorkspaceKey | null;
  defaultWorkspaceKey: WorkspaceKey | null;
} | null> {
  const { data, error } = await client
    .from("user_workspace_preferences")
    .select("last_workspace_key, default_workspace_key, preferences")
    .eq("user_id", userId)
    .maybeSingle();

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load workspace preference", {
      cause: error,
    });
  }
  if (!data) return null;
  const prefs = (data.preferences ?? {}) as Record<string, unknown>;
  const defaultFromJson =
    typeof prefs.defaultWorkspaceKey === "string"
      ? (prefs.defaultWorkspaceKey as WorkspaceKey)
      : null;
  return {
    lastWorkspaceKey: (data.last_workspace_key as WorkspaceKey | null) ?? null,
    defaultWorkspaceKey:
      (data.default_workspace_key as WorkspaceKey | null) ?? defaultFromJson,
  };
}

export async function resolveCurrentWorkspace(options: {
  client: SupabaseClient;
  userId: string;
  assignments: RoleAssignment[];
  requested?: string | null;
}): Promise<{
  workspaceKey: WorkspaceKey;
  allowed: WorkspaceKey[];
  authorized: boolean;
}> {
  const allowed = workspacesForAssignments(options.assignments);
  const pref = await getWorkspacePreference(options.client, options.userId).catch(
    () => null
  );

  const candidates: Array<string | null | undefined> = [
    options.requested,
    pref?.lastWorkspaceKey,
    pref?.defaultWorkspaceKey,
    defaultWorkspaceForAssignments(options.assignments),
    "personal",
  ];

  let workspaceKey: WorkspaceKey = "personal";
  for (const c of candidates) {
    if (!c) continue;
    if (!(WORKSPACE_KEYS as readonly string[]).includes(c)) continue;
    const key = c as WorkspaceKey;
    if (key === "personal" || canAccessWorkspace(options.assignments, key)) {
      workspaceKey = key;
      break;
    }
  }

  const authorized =
    workspaceKey === "personal" ||
    canAccessWorkspace(options.assignments, workspaceKey);

  return { workspaceKey, allowed, authorized };
}

export async function setWorkspacePreference(
  client: SupabaseClient,
  input: {
    userId: string;
    workspaceKey: WorkspaceKey;
    assignments: RoleAssignment[];
    setAsDefault?: boolean;
    correlationId?: string;
  }
): Promise<void> {
  if (
    input.workspaceKey !== "personal" &&
    !canAccessWorkspace(input.assignments, input.workspaceKey)
  ) {
    throw new AppError("FORBIDDEN", "Not authorized for requested workspace", {
      status: 403,
      details: { workspaceKey: input.workspaceKey },
    });
  }

  const row = {
    user_id: input.userId,
    last_workspace_key: input.workspaceKey,
    ...(input.setAsDefault
      ? { default_workspace_key: input.workspaceKey }
      : {}),
    updated_at: new Date().toISOString(),
  };

  const { error } = await client
    .from("user_workspace_preferences")
    .upsert(row, { onConflict: "user_id" });

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to persist workspace preference", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.userId,
    action: "workspace.switch",
    resourceType: "workspace",
    resourceId: input.workspaceKey,
    workspaceKey: input.workspaceKey,
    correlationId: input.correlationId,
    source: "workspace_preferences",
  });
}
