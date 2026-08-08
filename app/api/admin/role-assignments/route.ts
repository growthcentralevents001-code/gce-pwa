import { z } from "zod";
import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import { roleAssignmentCreateSchema } from "@/lib/architecture/validation/schemas";
import {
  activateRoleAssignment,
  createRoleAssignment,
  revokeRoleAssignment,
  suspendRoleAssignment,
} from "@/lib/architecture/identity/assignments";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";

const mutateSchema = z.object({
  assignmentId: z.string().uuid(),
  action: z.enum(["activate", "suspend", "revoke"]),
  reason: z.string().min(3).max(1000),
});

/**
 * POST /api/admin/role-assignments — create pending/active assignment (privileged).
 * PATCH /api/admin/role-assignments — lifecycle transitions.
 */
export const POST = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "create", { requirePlatformAdmin: true });
  const body = roleAssignmentCreateSchema.parse(await request.json());

  // Privileged path for admin writes when session RLS is insufficient for events/audit.
  const adminClient = createPrivilegedSupabaseClient();
  const created = await createRoleAssignment(adminClient, body, {
    userId: ctx.user.id,
    assignments: ctx.entitlements.activeAssignments,
    correlationId: ctx.correlationId,
  });

  return jsonSuccess({ assignment: created }, ctx, 201);
});

export const PATCH = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "approve", {
    requirePlatformAdmin: true,
    isSelfSubject: false,
  });
  const body = mutateSchema.parse(await request.json());
  const adminClient = createPrivilegedSupabaseClient();
  const actor = {
    actorUserId: ctx.user.id,
    actorAssignments: ctx.entitlements.activeAssignments,
    reason: body.reason,
    correlationId: ctx.correlationId,
    assignmentId: body.assignmentId,
  };

  let assignment;
  switch (body.action) {
    case "activate":
      assignment = await activateRoleAssignment(adminClient, actor);
      break;
    case "suspend":
      assignment = await suspendRoleAssignment(adminClient, actor);
      break;
    case "revoke":
      assignment = await revokeRoleAssignment(adminClient, actor);
      break;
    default:
      throw new AppError("VALIDATION_ERROR", "Unsupported action", { status: 400 });
  }

  return jsonSuccess({ assignment }, ctx);
});
