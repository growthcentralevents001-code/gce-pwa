import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import { createCircle, getCircle } from "@/lib/architecture/connect/circles";
import {
  confirmAllocation,
  proposeAllocation,
  addToWaitlist,
  listWaitlistOperationalOrder,
  getSeatAvailability,
} from "@/lib/architecture/connect/allocation";
import {
  appointCircleGovernance,
  requestCircleTransfer,
  completeCircleTransfer,
  startKycCase,
  clearKycCase,
} from "@/lib/architecture/connect/governance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { z } from "zod";
import { GCE_ROLE_KEYS } from "@/lib/architecture/types";

const createCircleSchema = z.object({
  name: z.string().min(1).max(200),
  city: z.string().min(1).max(120),
  district: z.string().max(120).optional().nullable(),
  state: z.string().max(120).optional().nullable(),
  locality: z.string().max(120).optional().nullable(),
});

const actionSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("propose_allocation"),
    membershipId: z.string().uuid(),
    circleId: z.string().uuid(),
    specialisationId: z.string().uuid().optional().nullable(),
    assistedByBdpUserId: z.string().uuid().optional().nullable(),
    reason: z.string().max(1000).optional(),
  }),
  z.object({
    action: z.literal("confirm_allocation"),
    proposalId: z.string().uuid(),
    reason: z.string().max(1000).optional(),
  }),
  z.object({
    action: z.literal("waitlist"),
    membershipId: z.string().uuid(),
    preferredCity: z.string().max(120).optional().nullable(),
    preferredState: z.string().max(120).optional().nullable(),
    specialisationId: z.string().uuid().optional().nullable(),
  }),
  z.object({
    action: z.literal("appoint_governance"),
    circleId: z.string().uuid(),
    userId: z.string().uuid(),
    roleKey: z.enum(GCE_ROLE_KEYS),
    reason: z.string().max(1000).optional(),
  }),
  z.object({
    action: z.literal("transfer_request"),
    membershipId: z.string().uuid(),
    sourceCircleId: z.string().uuid(),
    targetCircleId: z.string().uuid(),
    sourceSeatId: z.string().uuid().optional().nullable(),
    reason: z.string().max(1000).optional(),
  }),
  z.object({
    action: z.literal("transfer_complete"),
    transferId: z.string().uuid(),
    targetSeatId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("kyc_start"),
    userId: z.string().uuid().optional(),
  }),
  z.object({
    action: z.literal("kyc_clear"),
    caseId: z.string().uuid(),
    reason: z.string().min(3).max(1000),
    conditional: z.boolean().optional(),
  }),
]);

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const circleId = url.searchParams.get("circleId");
  if (circleId) {
    const [circle, availability] = await Promise.all([
      getCircle(ctx.supabase, circleId),
      getSeatAvailability(ctx.supabase, circleId),
    ]);
    return jsonSuccess({ circle, availability }, ctx);
  }
  assertPermission(ctx, "read", { requirePlatformAdmin: true });
  const waitlist = await listWaitlistOperationalOrder(ctx.supabase, {
    city: url.searchParams.get("city"),
  });
  return jsonSuccess({ waitlist }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "create", { requirePlatformAdmin: true });
  const admin = createPrivilegedSupabaseClient();
  const json = await request.json();

  // Circle create shortcut
  if (json?.action === undefined && json?.name && json?.city) {
    const body = createCircleSchema.parse(json);
    const circle = await createCircle(admin, {
      ...body,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ circle }, ctx, 201);
  }

  const body = actionSchema.parse(json);

  switch (body.action) {
    case "propose_allocation":
      return jsonSuccess(
        await proposeAllocation(admin, {
          ...body,
          actorUserId: ctx.user.id,
          correlationId: ctx.correlationId,
        }),
        ctx,
        201
      );
    case "confirm_allocation":
      return jsonSuccess(
        await confirmAllocation(admin, {
          proposalId: body.proposalId,
          actorUserId: ctx.user.id,
          reason: body.reason,
          correlationId: ctx.correlationId,
        }),
        ctx
      );
    case "waitlist":
      return jsonSuccess(
        {
          entry: await addToWaitlist(admin, {
            ...body,
            actorUserId: ctx.user.id,
            correlationId: ctx.correlationId,
          }),
        },
        ctx,
        201
      );
    case "appoint_governance":
      return jsonSuccess(
        await appointCircleGovernance(admin, {
          circleId: body.circleId,
          userId: body.userId,
          roleKey: body.roleKey,
          actorUserId: ctx.user.id,
          actorAssignments: ctx.entitlements.activeAssignments,
          reason: body.reason,
          correlationId: ctx.correlationId,
        }),
        ctx,
        201
      );
    case "transfer_request":
      return jsonSuccess(
        {
          transfer: await requestCircleTransfer(admin, {
            ...body,
            actorUserId: ctx.user.id,
            correlationId: ctx.correlationId,
          }),
        },
        ctx,
        201
      );
    case "transfer_complete":
      return jsonSuccess(
        {
          transfer: await completeCircleTransfer(admin, {
            transferId: body.transferId,
            targetSeatId: body.targetSeatId,
            actorUserId: ctx.user.id,
            correlationId: ctx.correlationId,
          }),
        },
        ctx
      );
    case "kyc_start":
      return jsonSuccess(
        {
          kyc: await startKycCase(admin, {
            userId: body.userId ?? ctx.user.id,
            actorUserId: ctx.user.id,
            correlationId: ctx.correlationId,
          }),
        },
        ctx,
        201
      );
    case "kyc_clear":
      return jsonSuccess(
        {
          kyc: await clearKycCase(admin, {
            caseId: body.caseId,
            actorUserId: ctx.user.id,
            reason: body.reason,
            conditional: body.conditional,
            correlationId: ctx.correlationId,
          }),
        },
        ctx
      );
  }
});
