import {
  withAuthedRoute,
  jsonSuccess,
} from "@/lib/api/context";
import {
  assertVenueInsightsAccess,
} from "@/lib/architecture/marketplace";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

const querySchema = z.object({
  venueId: z.string().uuid(),
});

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    venueId: url.searchParams.get("venueId"),
  });
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid venue allocations query", {
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

  const { data, error } = await admin
    .from("marketplace_revenue_entitlements")
    .select(
      "id, earning_event_key, source_type, source_id, eligible_revenue_minor, venue_share_minor, mbdp_share_minor, gce_share_minor, has_valid_attribution, state, rule_version, created_at"
    )
    .eq("venue_id", parsed.data.venueId)
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load allocations", {
      cause: error,
    });
  }

  return jsonSuccess({ allocations: data ?? [] }, ctx);
});
