import {
  withAuthedRoute,
  jsonSuccess,
} from "@/lib/api/context";
import {
  assertVenueInsightsAccess,
  buildVenueBusinessInsights,
} from "@/lib/architecture/marketplace";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

const querySchema = z.object({
  venueId: z.string().uuid(),
  periodDays: z.coerce.number().int().min(7).max(365).optional(),
});

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    venueId: url.searchParams.get("venueId"),
    periodDays: url.searchParams.get("periodDays") ?? undefined,
  });
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid venue insights query", {
      status: 400,
      cause: parsed.error,
    });
  }

  const admin = createPrivilegedSupabaseClient();
  await assertVenueInsightsAccess({
    userClient: ctx.supabase,
    adminClient: admin,
    userId: ctx.user.id,
    venueId: parsed.data.venueId,
    assignments: ctx.entitlements.activeAssignments,
  });

  const insights = await buildVenueBusinessInsights(
    admin,
    parsed.data.venueId,
    { periodDays: parsed.data.periodDays ?? 30 }
  );

  return jsonSuccess({ insights }, ctx);
});
