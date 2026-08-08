import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  activateEmergencyAccess,
  recordEmergencyUse,
  revokeEmergencyAccess,
} from "@/lib/architecture/identity/emergency";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

const activateSchema = z.object({
  action: z.literal("activate"),
  granteeUserId: z.string().uuid(),
  reason: z.string().min(12).max(2000),
  durationMinutes: z.number().int().min(5).max(240).optional(),
  ticketRef: z.string().max(120).optional().nullable(),
});

const revokeSchema = z.object({
  action: z.literal("revoke"),
  grantId: z.string().uuid(),
  reason: z.string().min(12).max(2000),
});

const useSchema = z.object({
  action: z.literal("use"),
  grantId: z.string().uuid(),
  emergencyAction: z.string().min(3).max(200),
  reason: z.string().min(12).max(2000),
  resourceType: z.string().max(120).optional(),
  resourceId: z.string().max(120).optional(),
});

const bodySchema = z.discriminatedUnion("action", [
  activateSchema,
  revokeSchema,
  useSchema,
]);

/**
 * POST /api/admin/emergency-access — restricted break-glass (not Super Admin workspace).
 * Uses service-role client; every use is audited.
 */
export const POST = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "approve", { requirePlatformAdmin: true });
  const body = bodySchema.parse(await request.json());
  const adminClient = createPrivilegedSupabaseClient();

  if (body.action === "activate") {
    const grant = await activateEmergencyAccess(adminClient, {
      granteeUserId: body.granteeUserId,
      reason: body.reason,
      actorUserId: ctx.user.id,
      durationMinutes: body.durationMinutes,
      ticketRef: body.ticketRef,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ grant }, ctx, 201);
  }

  if (body.action === "revoke") {
    await revokeEmergencyAccess(adminClient, {
      grantId: body.grantId,
      actorUserId: ctx.user.id,
      reason: body.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ ok: true }, ctx);
  }

  await recordEmergencyUse(adminClient, {
    grantId: body.grantId,
    actorUserId: ctx.user.id,
    action: body.emergencyAction,
    reason: body.reason,
    resourceType: body.resourceType,
    resourceId: body.resourceId,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ ok: true }, ctx);
});
