import type { SupabaseClient } from "@supabase/supabase-js";
import { ensureProfile, getProfile, type ProfileRecord } from "./profile";
import { resolveActiveEntitlements, type EntitlementResolution } from "./resolveEntitlements";
import { getActiveIdentitySuspension, type IdentitySuspension } from "./suspension";
import { listUserOrganisations } from "../organisations/memberships";
import {
  resolveCurrentWorkspace,
  defaultWorkspaceForAssignments,
} from "../workspace/preferences";
import { workspacesForAssignments } from "../workspace/registry";
import type { WorkspaceKey } from "../types";
import {
  buildPermissionContext,
  hasPermission,
} from "../rbac/authz";
import type { Phase4Permission } from "../rbac/matrix";
import { PERMISSION_ROLE_GRANT } from "../rbac/matrix";

export type CurrentIdentity = {
  userId: string;
  email: string | null;
  profile: ProfileRecord | null;
  entitlements: EntitlementResolution;
  identitySuspension: IdentitySuspension | null;
  organisations: unknown[];
  workspaces: WorkspaceKey[];
  currentWorkspace: WorkspaceKey;
  permissions: Phase4Permission[];
};

export async function getCurrentIdentity(
  client: SupabaseClient,
  input: {
    userId: string;
    email?: string | null;
    displayName?: string | null;
    requestedWorkspace?: string | null;
    ensureProfileRow?: boolean;
    correlationId?: string;
  }
): Promise<CurrentIdentity> {
  if (input.ensureProfileRow !== false) {
    await ensureProfile(client, {
      userId: input.userId,
      displayName: input.displayName,
      correlationId: input.correlationId,
    });
  }

  const [profile, entitlements, identitySuspension, organisations] =
    await Promise.all([
      getProfile(client, input.userId),
      resolveActiveEntitlements(client, input.userId, {
        consultLegacyForDiagnostics: true,
      }),
      getActiveIdentitySuspension(client, input.userId),
      listUserOrganisations(client, input.userId).catch(() => []),
    ]);

  const workspaces = identitySuspension
    ? (["personal"] as WorkspaceKey[])
    : workspacesForAssignments(entitlements.activeAssignments);

  const resolved = identitySuspension
    ? {
        workspaceKey: "personal" as WorkspaceKey,
        allowed: workspaces,
        authorized: true,
      }
    : await resolveCurrentWorkspace({
        client,
        userId: input.userId,
        assignments: entitlements.activeAssignments,
        requested: input.requestedWorkspace,
      });

  const ctx = buildPermissionContext({
    userId: input.userId,
    assignments: entitlements.activeAssignments,
    workspaceKey: resolved.workspaceKey,
    resource: { ownerUserId: input.userId },
  });

  const permissions = (
    Object.keys(PERMISSION_ROLE_GRANT) as Phase4Permission[]
  ).filter((p) => hasPermission(ctx, p, { resourceOwnerUserId: input.userId }));

  return {
    userId: input.userId,
    email: input.email ?? null,
    profile,
    entitlements,
    identitySuspension,
    organisations,
    workspaces: resolved.allowed,
    currentWorkspace: resolved.workspaceKey,
    permissions,
  };
}

export async function resolveAvailableWorkspaces(
  client: SupabaseClient,
  userId: string
): Promise<{ workspaces: WorkspaceKey[]; defaultWorkspace: WorkspaceKey }> {
  const entitlements = await resolveActiveEntitlements(client, userId);
  const suspension = await getActiveIdentitySuspension(client, userId);
  if (suspension) {
    return { workspaces: ["personal"], defaultWorkspace: "personal" };
  }
  const workspaces = workspacesForAssignments(entitlements.activeAssignments);
  return {
    workspaces,
    defaultWorkspace: defaultWorkspaceForAssignments(
      entitlements.activeAssignments
    ),
  };
}

export async function resolveEffectivePermissions(
  client: SupabaseClient,
  userId: string
): Promise<Phase4Permission[]> {
  const entitlements = await resolveActiveEntitlements(client, userId);
  const suspension = await getActiveIdentitySuspension(client, userId);
  if (suspension) {
    return ["profile.read.self", "workspace_preference.read.own"];
  }
  const ctx = buildPermissionContext({
    userId,
    assignments: entitlements.activeAssignments,
    resource: { ownerUserId: userId },
  });
  return (Object.keys(PERMISSION_ROLE_GRANT) as Phase4Permission[]).filter((p) =>
    hasPermission(ctx, p, { resourceOwnerUserId: userId })
  );
}
