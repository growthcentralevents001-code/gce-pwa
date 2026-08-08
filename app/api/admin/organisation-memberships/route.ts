import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  manageOrganisationMembership,
  suspendOrganisationMembership,
} from "@/lib/architecture/organisations/memberships";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

const upsertSchema = z.object({
  organisationId: z.string().uuid(),
  userId: z.string().uuid(),
  membershipRole: z
    .enum([
      "owner",
      "admin",
      "representative",
      "member",
      "billing_contact",
      "viewer",
    ])
    .optional(),
  status: z.enum(["invited", "active", "suspended", "revoked"]).optional(),
  isPrimary: z.boolean().optional(),
});

const suspendSchema = z.object({
  membershipId: z.string().uuid(),
  reason: z.string().min(3).max(1000),
});

/**
 * POST /api/admin/organisation-memberships — upsert membership.
 * PATCH — suspend membership.
 */
export const POST = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "create", { requirePlatformAdmin: true });
  const body = upsertSchema.parse(await request.json());
  const adminClient = createPrivilegedSupabaseClient();
  const membership = await manageOrganisationMembership(adminClient, {
    ...body,
    actorUserId: ctx.user.id,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ membership }, ctx, 201);
});

export const PATCH = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "update", { requirePlatformAdmin: true });
  const body = suspendSchema.parse(await request.json());
  const adminClient = createPrivilegedSupabaseClient();
  const membership = await suspendOrganisationMembership(adminClient, {
    membershipId: body.membershipId,
    actorUserId: ctx.user.id,
    reason: body.reason,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ membership }, ctx);
});
