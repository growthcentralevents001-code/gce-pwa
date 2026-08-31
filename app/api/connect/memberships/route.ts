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
  submitMembershipApplication,
  suspendMembership,
  updateMembershipDraft,
} from "@/lib/architecture/connect/memberships";
import { connectMembershipApplicationSchema } from "@/lib/architecture/connect/application";
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
  application: connectMembershipApplicationSchema,
  submit: z.boolean().optional(),
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

const patchSchema = z.discriminatedUnion("action", [
  z.object({
    action: z.literal("submit"),
    membershipId: z.string().uuid(),
  }),
  z.object({
    action: z.literal("update_draft"),
    membershipId: z.string().uuid(),
    specialisationId: z.string().uuid().optional().nullable(),
    preferredCity: z.string().max(120).optional().nullable(),
    preferredState: z.string().max(120).optional().nullable(),
    preferredDistrict: z.string().max(120).optional().nullable(),
    preferredLocality: z.string().max(120).optional().nullable(),
    application: connectMembershipApplicationSchema.optional(),
    tags: createSchema.shape.tags,
  }),
  z.object({
    action: z.enum(["activate", "suspend", "payment_succeeded"]),
    membershipId: z.string().uuid(),
    reason: z.string().min(3).max(1000).optional(),
    paymentIntentId: z.string().uuid().optional(),
  }),
]);

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
  const existing = await listMembershipsForUser(ctx.supabase, ctx.user.id);
  const draft = existing.find((m) => m.status === "draft");

  if (existing.some((m) => m.status !== "draft")) {
    throw new AppError(
      "CONFLICT",
      "You already have a membership application in progress",
      { status: 409 }
    );
  }

  let membership;
  if (draft) {
    membership = await updateMembershipDraft(ctx.supabase, {
      membershipId: draft.id,
      actorUserId: ctx.user.id,
      specialisationId: body.specialisationId,
      preferredCity: body.preferredCity,
      preferredState: body.preferredState,
      preferredDistrict: body.preferredDistrict,
      preferredLocality: body.preferredLocality,
      metadata: { application: body.application },
      correlationId: ctx.correlationId,
    });
  } else {
    membership = await createMembershipDraft(ctx.supabase, {
      userId: ctx.user.id,
      specialisationId: body.specialisationId,
      organisationId: body.organisationId,
      preferredCity: body.preferredCity,
      preferredState: body.preferredState,
      preferredDistrict: body.preferredDistrict,
      preferredLocality: body.preferredLocality,
      connectBdpUserId: body.connectBdpUserId,
      attributionProvenance: body.attributionProvenance,
      metadata: { application: body.application },
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
  }

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

  let result = membership;
  if (body.submit) {
    result = await submitMembershipApplication(ctx.supabase, {
      membershipId: membership.id,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
  }

  return jsonSuccess({ membership: result, tags }, ctx, 201);
});

export const PATCH = withAuthedRoute(async (request, ctx) => {
  const body = patchSchema.parse(await request.json());
  const admin = createPrivilegedSupabaseClient();

  if (body.action === "submit") {
    const membership = await submitMembershipApplication(ctx.supabase, {
      membershipId: body.membershipId,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ membership }, ctx);
  }

  if (body.action === "update_draft") {
    const metadata = body.application
      ? { application: body.application }
      : undefined;
    const membership = await updateMembershipDraft(ctx.supabase, {
      membershipId: body.membershipId,
      actorUserId: ctx.user.id,
      specialisationId: body.specialisationId,
      preferredCity: body.preferredCity,
      preferredState: body.preferredState,
      preferredDistrict: body.preferredDistrict,
      preferredLocality: body.preferredLocality,
      metadata,
      correlationId: ctx.correlationId,
    });
    let tags: unknown[] = [];
    if (body.tags?.length) {
      tags = await setMembershipTags(admin, {
        membershipId: membership.id,
        tags: body.tags,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
    }
    return jsonSuccess({ membership, tags }, ctx);
  }

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

  if (!body.reason) {
    throw new AppError("VALIDATION_ERROR", "reason required", { status: 400 });
  }

  const membership = await suspendMembership(admin, {
    membershipId: body.membershipId,
    actorUserId: ctx.user.id,
    reason: body.reason,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ membership }, ctx);
});
