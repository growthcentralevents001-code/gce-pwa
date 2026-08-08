import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  activateMembership,
  createMembershipDraft,
  listMembershipsForUser,
  recordMembershipPaymentSuccess,
  suspendMembership,
} from "@/lib/architecture/connect/memberships";
import { setMembershipTags, listMembershipTags } from "@/lib/architecture/connect/tags";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { z } from "zod";
import { AppError } from "@/lib/errors";

const createSchema = z.object({
  specialisationId: z.string().uuid().optional().nullable(),
  organisationId: z.string().uuid().optional().nullable(),
  preferredCity: z.string().max(120).optional().nullable(),
  preferredState: z.string().max(120).optional().nullable(),
  preferredDistrict: z.string().max(120).optional().nullable(),
  preferredLocality: z.string().max(120).optional().nullable(),
  connectBdpUserId: z.string().uuid().optional().nullable(),
  attributionProvenance: z.string().max(500).optional().nullable(),
  tags: z
    .array(
      z.object({
        slot: z.number().int().min(1).max(4),
        tagKey: z.string().min(1).max(80),
        tagLabel: z.string().min(1).max(120),
      })
    )
    .max(4)
    .optional(),
});

const activateSchema = z.object({
  membershipId: z.string().uuid(),
  action: z.enum(["activate", "suspend", "payment_succeeded"]),
  reason: z.string().min(3).max(1000).optional(),
  paymentIntentId: z.string().uuid().optional(),
});

export const GET = withAuthedRoute(async (_request, ctx) => {
  const memberships = await listMembershipsForUser(ctx.supabase, ctx.user.id);
  const withTags = await Promise.all(
    memberships.map(async (m) => ({
      ...m,
      tags: await listMembershipTags(ctx.supabase, m.id),
    }))
  );
  return jsonSuccess({ memberships: withTags }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = createSchema.parse(await request.json());
  const membership = await createMembershipDraft(ctx.supabase, {
    userId: ctx.user.id,
    specialisationId: body.specialisationId,
    organisationId: body.organisationId,
    preferredCity: body.preferredCity,
    preferredState: body.preferredState,
    preferredDistrict: body.preferredDistrict,
    preferredLocality: body.preferredLocality,
    connectBdpUserId: body.connectBdpUserId,
    attributionProvenance: body.attributionProvenance,
    actorUserId: ctx.user.id,
    correlationId: ctx.correlationId,
  });

  let tags: unknown[] = [];
  if (body.tags?.length) {
    const admin = createPrivilegedSupabaseClient();
    tags = await setMembershipTags(admin, {
      membershipId: membership.id,
      tags: body.tags,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
  }

  return jsonSuccess({ membership, tags }, ctx, 201);
});

export const PATCH = withAuthedRoute(async (request, ctx) => {
  const body = activateSchema.parse(await request.json());
  const admin = createPrivilegedSupabaseClient();

  if (body.action === "payment_succeeded") {
    if (!body.paymentIntentId) {
      throw new AppError("VALIDATION_ERROR", "paymentIntentId required", {
        status: 400,
      });
    }
    const membership = await recordMembershipPaymentSuccess(admin, {
      membershipId: body.membershipId,
      paymentIntentId: body.paymentIntentId,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ membership }, ctx);
  }

  assertPermission(ctx, "approve", { requirePlatformAdmin: true });

  if (body.action === "activate") {
    const membership = await activateMembership(admin, {
      membershipId: body.membershipId,
      actorUserId: ctx.user.id,
      reason: body.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ membership }, ctx);
  }

  const membership = await suspendMembership(admin, {
    membershipId: body.membershipId,
    actorUserId: ctx.user.id,
    reason: body.reason ?? "Suspended",
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ membership }, ctx);
});
