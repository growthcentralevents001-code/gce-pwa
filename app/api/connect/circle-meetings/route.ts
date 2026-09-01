import {
  withAuthedRoute,
  jsonSuccess,
  type AuthedRequestContext,
} from "@/lib/api/context";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import {
  listCircleMeetings,
  partitionCircleMeetings,
  scheduleCircleMeeting,
  updateCircleMeetingStatus,
  CIRCLE_MEETING_STATUSES,
} from "@/lib/architecture/connect/meetings";
import { AppError } from "@/lib/architecture/errors";
import { z } from "zod";

const postSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("schedule"),
    circleId: z.string().uuid(),
    scheduledAt: z.string().min(1),
    title: z.string().max(200).optional().nullable(),
    location: z.string().max(300).optional().nullable(),
    notes: z.string().max(2000).optional().nullable(),
  }),
  z.object({
    action: z.literal("update_status"),
    meetingId: z.string().uuid(),
    status: z.enum(CIRCLE_MEETING_STATUSES),
    notes: z.string().max(2000).optional().nullable(),
  }),
]);

async function userCanReadCircleMeetings(
  ctx: AuthedRequestContext,
  circleId: string
): Promise<boolean> {
  if (actorHasOpsAdminPermission(ctx.entitlements.activeAssignments, "ops.connect")) {
    return true;
  }

  const { data: memberships } = await ctx.supabase
    .from("connect_memberships")
    .select("id")
    .eq("user_id", ctx.user.id);
  const membershipIds = (memberships ?? []).map((m) => m.id);
  if (membershipIds.length > 0) {
    const { data: seat } = await ctx.supabase
      .from("connect_circle_seats")
      .select("id")
      .eq("circle_id", circleId)
      .in("membership_id", membershipIds)
      .in("status", ["allocated", "reserved", "protected_grace"])
      .limit(1)
      .maybeSingle();
    if (seat) return true;
  }

  const { data: bdpAssign } = await ctx.supabase
    .from("connect_bdp_circle_assignments")
    .select("id")
    .eq("circle_id", circleId)
    .eq("status", "active")
    .limit(1)
    .maybeSingle();
  return Boolean(bdpAssign);
}

function assertOpsCanManageMeetings(ctx: AuthedRequestContext): void {
  if (!actorHasOpsAdminPermission(ctx.entitlements.activeAssignments, "ops.connect")) {
    throw new AppError("FORBIDDEN", "Connect Ops permission required", {
      status: 403,
    });
  }
}

export const GET = withAuthedRoute(async (request, ctx) => {
  const circleId = new URL(request.url).searchParams.get("circleId");
  if (!circleId) {
    throw new AppError("VALIDATION_ERROR", "circleId is required", { status: 400 });
  }

  const allowed = await userCanReadCircleMeetings(ctx, circleId);
  if (!allowed) {
    throw new AppError("FORBIDDEN", "Not authorized for this Circle", {
      status: 403,
    });
  }

  const meetings = await listCircleMeetings(ctx.supabase, circleId);
  const partitioned = partitionCircleMeetings(meetings);
  return jsonSuccess(
    {
      meetings,
      upcoming: partitioned.upcoming,
      previous: partitioned.previous,
      cadenceDays: 15,
    },
    ctx
  );
});

export const POST = withAuthedRoute(async (request, ctx) => {
  assertOpsCanManageMeetings(ctx);
  const admin = createPrivilegedSupabaseClient();
  const body = postSchema.parse(await request.json());

  if (body.action === "schedule") {
    const result = await scheduleCircleMeeting(admin, {
      circleId: body.circleId,
      scheduledAt: body.scheduledAt,
      title: body.title,
      location: body.location,
      notes: body.notes,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess(result, ctx, 201);
  }

  const meeting = await updateCircleMeetingStatus(admin, {
    meetingId: body.meetingId,
    status: body.status,
    notes: body.notes,
    actorUserId: ctx.user.id,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ meeting }, ctx);
});
