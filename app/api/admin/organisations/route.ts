import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import { organisationCreateSchema } from "@/lib/architecture/validation/schemas";
import { createOrganisationWithOptionalPrimaryRep } from "@/lib/architecture/organisations/memberships";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { z } from "zod";

const createSchema = organisationCreateSchema.extend({
  primaryRepresentativeUserId: z.string().uuid().optional().nullable(),
});

/**
 * POST /api/admin/organisations — create organisation (+ optional primary rep).
 */
export const POST = withAuthedRoute(async (request, ctx) => {
  assertPermission(ctx, "create", { requirePlatformAdmin: true });
  const body = createSchema.parse(await request.json());
  const adminClient = createPrivilegedSupabaseClient();
  const org = await createOrganisationWithOptionalPrimaryRep(adminClient, {
    ...body,
    actorUserId: ctx.user.id,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess({ organisation: org }, ctx, 201);
});
