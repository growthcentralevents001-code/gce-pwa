import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "../errors";

export const MARKETPLACE_ENGAGEMENT_TYPES = [
  "marketplace_venue_view",
  "marketplace_event_view",
  "marketplace_offer_view",
] as const;

export type MarketplaceEngagementType =
  (typeof MARKETPLACE_ENGAGEMENT_TYPES)[number];

export const recordEngagementSchema = z.object({
  engagementType: z.enum(MARKETPLACE_ENGAGEMENT_TYPES),
  subjectId: z.string().uuid(),
  venueId: z.string().uuid().optional().nullable(),
  source: z.enum(["public", "customer"]).optional().default("public"),
});

export type VenueEngagementMetrics = {
  venueViews: number;
  eventViews: number;
  offerViews: number;
  totalBookings: number;
  totalClaims: number;
  totalCustomerActions: number;
  eventPerformance: Array<{
    eventId: string;
    title: string;
    views: number;
    bookings: number;
  }>;
  totalRedemptions: number;
  offerPerformance: Array<{
    offerId: string;
    title: string;
    views: number;
    claims: number;
    activeClaims: number;
    expiredClaims: number;
    redemptions: number;
    conversionRate: number | null;
    redemptionRate: number | null;
  }>;
};

/** Classify persisted claim rows for venue offer activity metrics. */
export function classifyOfferClaimCounts(
  claims: Array<{ status: string; expires_at: string | null }>,
  nowMs = Date.now()
): { total: number; active: number; expired: number; redeemed: number } {
  let active = 0;
  let expired = 0;
  let redeemed = 0;
  for (const c of claims) {
    if (c.status === "redeemed") {
      redeemed += 1;
      continue;
    }
    const pastExpiry =
      c.expires_at != null && new Date(c.expires_at).getTime() < nowMs;
    if (c.status === "expired" || pastExpiry) {
      expired += 1;
    } else if (c.status === "claimed") {
      active += 1;
    }
  }
  return { total: claims.length, active, expired, redeemed };
}

export async function recordMarketplaceEngagement(
  client: SupabaseClient,
  input: {
    engagementType: MarketplaceEngagementType;
    subjectId: string;
    venueId?: string | null;
    actorUserId?: string | null;
    source?: string;
    metadata?: Record<string, unknown>;
  }
) {
  const subjectType =
    input.engagementType === "marketplace_venue_view"
      ? "marketplace_venue"
      : input.engagementType === "marketplace_event_view"
        ? "marketplace_event"
        : "marketplace_offer";

  const { data, error } = await client
    .from("customer_domain_events")
    .insert({
      event_type: input.engagementType,
      actor_user_id: input.actorUserId ?? null,
      subject_type: subjectType,
      subject_id: input.subjectId,
      payload: {
        venueId: input.venueId ?? null,
        source: input.source ?? "public",
        ...input.metadata,
      },
    })
    .select("id")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record engagement", {
      cause: error,
    });
  }
  return data;
}

async function countEngagement(
  client: SupabaseClient,
  eventType: MarketplaceEngagementType,
  subjectIds: string[]
): Promise<Map<string, number>> {
  const counts = new Map<string, number>();
  if (subjectIds.length === 0) return counts;

  const { data, error } = await client
    .from("customer_domain_events")
    .select("subject_id")
    .eq("event_type", eventType)
    .in("subject_id", subjectIds);

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load engagement counts", {
      cause: error,
    });
  }

  for (const row of data ?? []) {
    const id = String(row.subject_id);
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }
  return counts;
}

export async function buildVenueEngagementMetrics(
  client: SupabaseClient,
  venueId: string
): Promise<VenueEngagementMetrics> {
  const [{ data: events }, { data: offers }, venueViewRes] = await Promise.all([
    client
      .from("marketplace_events")
      .select("id, title")
      .eq("venue_id", venueId),
    client
      .from("marketplace_offer_events")
      .select("id, title")
      .eq("venue_id", venueId),
    client
      .from("customer_domain_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "marketplace_venue_view")
      .eq("subject_id", venueId),
  ]);

  const eventRows = events ?? [];
  const offerRows = offers ?? [];
  const eventIds = eventRows.map((e) => String(e.id));
  const offerIds = offerRows.map((o) => String(o.id));

  const [eventViews, offerViews] = await Promise.all([
    countEngagement(client, "marketplace_event_view", eventIds),
    countEngagement(client, "marketplace_offer_view", offerIds),
  ]);

  const bookingsByEvent = new Map<string, number>();
  let totalBookings = 0;
  if (eventIds.length > 0) {
    const { data: bookingRows } = await client
      .from("marketplace_bookings")
      .select("event_id")
      .in("event_id", eventIds);
    for (const b of bookingRows ?? []) {
      const eid = String(b.event_id);
      bookingsByEvent.set(eid, (bookingsByEvent.get(eid) ?? 0) + 1);
    }
    totalBookings = bookingRows?.length ?? 0;
  }

  const claimsByOffer = new Map<
    string,
    Array<{ status: string; expires_at: string | null }>
  >();
  let totalClaims = 0;
  if (offerIds.length > 0) {
    const { data: claimRows } = await client
      .from("marketplace_offer_claims")
      .select("offer_event_id,status,expires_at")
      .in("offer_event_id", offerIds);
    for (const c of claimRows ?? []) {
      const oid = String(c.offer_event_id);
      const bucket = claimsByOffer.get(oid) ?? [];
      bucket.push({
        status: String(c.status),
        expires_at: c.expires_at ? String(c.expires_at) : null,
      });
      claimsByOffer.set(oid, bucket);
    }
    totalClaims = claimRows?.length ?? 0;
  }

  const redemptionsByOffer = new Map<string, number>();
  let totalRedemptions = 0;
  if (offerIds.length > 0) {
    const { data: redemptionRows } = await client
      .from("marketplace_redemptions")
      .select("offer_event_id")
      .in("offer_event_id", offerIds);
    for (const r of redemptionRows ?? []) {
      const oid = String(r.offer_event_id);
      redemptionsByOffer.set(oid, (redemptionsByOffer.get(oid) ?? 0) + 1);
    }
    totalRedemptions = redemptionRows?.length ?? 0;
  }

  const eventViewsTotal = [...eventViews.values()].reduce((s, n) => s + n, 0);
  const offerViewsTotal = [...offerViews.values()].reduce((s, n) => s + n, 0);

  return {
    venueViews: venueViewRes.count ?? 0,
    eventViews: eventViewsTotal,
    offerViews: offerViewsTotal,
    totalBookings,
    totalClaims,
    totalRedemptions,
    totalCustomerActions:
      (venueViewRes.count ?? 0) +
      eventViewsTotal +
      offerViewsTotal +
      totalBookings +
      totalClaims +
      totalRedemptions,
    eventPerformance: eventRows.map((e) => {
      const id = String(e.id);
      return {
        eventId: id,
        title: String(e.title ?? "Event"),
        views: eventViews.get(id) ?? 0,
        bookings: bookingsByEvent.get(id) ?? 0,
      };
    }),
    offerPerformance: offerRows.map((o) => {
      const id = String(o.id);
      const views = offerViews.get(id) ?? 0;
      const claimRows = claimsByOffer.get(id) ?? [];
      const counts = classifyOfferClaimCounts(claimRows);
      const redemptions = redemptionsByOffer.get(id) ?? 0;
      return {
        offerId: id,
        title: String(o.title ?? "Offer"),
        views,
        claims: counts.total,
        activeClaims: counts.active,
        expiredClaims: counts.expired,
        redemptions,
        conversionRate:
          views > 0 ? Math.round((counts.total / views) * 1000) / 10 : null,
        redemptionRate:
          counts.total > 0
            ? Math.round((redemptions / counts.total) * 1000) / 10
            : null,
      };
    }),
  };
}
