import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";

/**
 * GET /api/identity/me — current user identity, assignments, workspaces, Phase 4 permissions.
 */
export const GET = withAuthedRoute(async (_request, ctx) => {
  const identity = await getCurrentIdentity(ctx.supabase, {
    userId: ctx.user.id,
    email: ctx.user.email,
    displayName:
      typeof ctx.user.user_metadata?.full_name === "string"
        ? ctx.user.user_metadata.full_name
        : null,
    correlationId: ctx.correlationId,
  });

  return jsonSuccess(
    {
      userId: identity.userId,
      email: identity.email,
      profile: identity.profile,
      identitySuspended: Boolean(identity.identitySuspension),
      identitySuspension: identity.identitySuspension,
      activeAssignments: identity.entitlements.activeAssignments,
      assignmentSource: identity.entitlements.source,
      legacyRoleKeys: identity.entitlements.legacyRoleKeys,
      organisations: identity.organisations,
      workspaces: identity.workspaces,
      currentWorkspace: identity.currentWorkspace,
      permissions: identity.permissions,
    },
    ctx
  );
});
