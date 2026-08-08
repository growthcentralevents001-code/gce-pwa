import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import {
  ensureProfile,
  updateOwnProfile,
} from "@/lib/architecture/identity/profile";
import { ValidationError } from "@/lib/errors";

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

/**
 * PATCH /api/identity/me — update own profile fields (Batch 1 onboarding).
 * Never grants roles or workspaces.
 */
export const PATCH = withAuthedRoute(async (request, ctx) => {
  let body: Record<string, unknown> = {};
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    throw new ValidationError("Invalid JSON body");
  }

  await ensureProfile(ctx.supabase, {
    userId: ctx.user.id,
    displayName:
      typeof body.displayName === "string"
        ? body.displayName
        : typeof ctx.user.user_metadata?.full_name === "string"
          ? ctx.user.user_metadata.full_name
          : null,
    correlationId: ctx.correlationId,
  });

  const profile = await updateOwnProfile(ctx.supabase, {
    userId: ctx.user.id,
    displayName:
      body.displayName === undefined
        ? undefined
        : (body.displayName as string | null),
    phone: body.phone === undefined ? undefined : (body.phone as string | null),
    correlationId: ctx.correlationId,
  });

  return jsonSuccess({ profile }, ctx);
});
