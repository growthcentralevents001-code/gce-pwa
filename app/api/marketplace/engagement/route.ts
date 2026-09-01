import { withApiHandler, validateBody } from "@/lib/api/context";
import {
  recordEngagementSchema,
  recordMarketplaceEngagement,
} from "@/lib/architecture/marketplace/engagement";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { AppError } from "@/lib/errors";

export const POST = async (request: Request) =>
  withApiHandler(
    request,
    async (_ctx) => {
      const body = validateBody(recordEngagementSchema, await request.json());
      const admin = createPrivilegedSupabaseClient();

      if (body.engagementType === "marketplace_event_view") {
        const { data: event } = await admin
          .from("marketplace_events")
          .select("id, status, venue_id, marketplace_venues!inner(status)")
          .eq("id", body.subjectId)
          .maybeSingle();
        if (!event || String(event.status) !== "published") {
          throw new AppError("NOT_FOUND", "Event not available", { status: 404 });
        }
      } else if (body.engagementType === "marketplace_offer_view") {
        const { data: offer } = await admin
          .from("marketplace_offer_events")
          .select("id, status, venue_id, marketplace_venues!inner(status)")
          .eq("id", body.subjectId)
          .maybeSingle();
        if (!offer || String(offer.status) !== "published") {
          throw new AppError("NOT_FOUND", "Offer not available", { status: 404 });
        }
      } else {
        const { data: venue } = await admin
          .from("marketplace_venues")
          .select("id, status")
          .eq("id", body.subjectId)
          .maybeSingle();
        if (!venue || String(venue.status) !== "active") {
          throw new AppError("NOT_FOUND", "Venue not available", { status: 404 });
        }
      }

      const supabase = await createServerSupabaseClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const recorded = await recordMarketplaceEngagement(admin, {
        engagementType: body.engagementType,
        subjectId: body.subjectId,
        venueId: body.venueId,
        actorUserId: user?.id ?? null,
        source: body.source,
      });

      return {
        status: 201,
        body: { ok: true, id: recorded.id },
      };
    },
    {
      rateLimitKey: "marketplace_engagement",
      rateLimitMax: 120,
      rateLimitWindowMs: 60_000,
    }
  );
