import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { buildVenueDashboard } from "./reporting";
import { listUserOrganisations } from "../organisations/memberships";
import { actorHasMarketplacePermission } from "./permissions";
import type { RoleAssignment } from "../types";
import { listMbdpUnitsForUser } from "./units";

/** Confirmed/paid bookings qualify; draft/cancelled/refunded do not. */
export const QUALIFYING_BOOKING_STATUSES = ["paid", "confirmed"] as const;

export type QualifyingActivityType =
  | "event_booking"
  | "ticket_check_in"
  | "offer_visit"
  | "offer_redemption";

/**
 * Canonical Venue customer relationship (GCE Marketplace):
 * - Qualifying activity = paid/confirmed event booking, ticket check-in,
 *   confirmed offer visit, or completed offer redemption at this Venue.
 * - Offer claims alone and page views do NOT qualify as customer relationships.
 * - Identity = GCE users.id; same user across modules counts once per Venue reach.
 * - First-time / returning / repeat classifications are Venue-scoped only.
 * - Repeat customer = user with 2+ qualifying activities at this Venue
 *   (distinct source records; idempotent replays deduped by sourceRecordId).
 */
export const VENUE_CUSTOMER_INSIGHT_DEFINITION =
  "Unique customers are distinct GCE users with at least one qualifying Marketplace activity at this Venue: paid/confirmed event booking, ticket check-in, confirmed offer visit, or completed offer redemption. Claims and page views are excluded. Classifications are Venue-specific and computed server-side.";

export type VenueQualifyingTouchpoint = {
  venueId: string;
  customerUserId: string;
  activityType: QualifyingActivityType;
  /** Stable dedupe key, e.g. booking:{id} */
  sourceRecordId: string;
  occurredAt: string;
  eventId?: string;
  offerId?: string;
};

export type VenueInsightsPeriod = {
  days: number;
  start: string;
  end: string;
  previousStart: string;
  previousEnd: string;
};

export type VenueCustomerMetrics = {
  uniqueAllTime: number;
  uniqueInPeriod: number;
  firstTimeInPeriod: number;
  returningInPeriod: number;
  repeatAllTime: number;
  qualifyingActivitiesInPeriod: number;
  newSharePercent: number | null;
  returningSharePercent: number | null;
};

export type VenueBusinessInsights = {
  definition: string;
  period: VenueInsightsPeriod;
  hasQualifyingActivity: boolean;
  customers: VenueCustomerMetrics;
  trends: {
    uniqueCustomersDelta: number | null;
    qualifyingActivitiesDelta: number | null;
    visibilityViewsDelta: number | null;
  };
  visibility: {
    venueViewsAllTime: number;
    eventViewsAllTime: number;
    offerViewsAllTime: number;
    venueViewsInPeriod: number;
    eventViewsInPeriod: number;
    offerViewsInPeriod: number;
  };
  engagement: {
    bookingsInPeriod: number;
    checkInsInPeriod: number;
    visitsInPeriod: number;
    redemptionsInPeriod: number;
  };
  listingPerformance: {
    events: Array<{
      eventId: string;
      title: string;
      uniqueCustomers: number;
      bookings: number;
      checkIns: number;
    }>;
    offers: Array<{
      offerId: string;
      title: string;
      uniqueCustomers: number;
      visits: number;
      redemptions: number;
    }>;
  };
  observations: string[];
};

function parseMs(iso: string): number {
  return Date.parse(iso);
}

function inRange(iso: string, startMs: number, endMs: number): boolean {
  const t = parseMs(iso);
  return t >= startMs && t <= endMs;
}

/** Dedupe touchpoints by sourceRecordId (duplicate processing protection). */
export function dedupeVenueTouchpoints(
  touchpoints: VenueQualifyingTouchpoint[]
): VenueQualifyingTouchpoint[] {
  const seen = new Set<string>();
  const out: VenueQualifyingTouchpoint[] = [];
  for (const tp of touchpoints) {
    if (seen.has(tp.sourceRecordId)) continue;
    seen.add(tp.sourceRecordId);
    out.push(tp);
  }
  return out;
}

export function buildVenueInsightsPeriod(
  days: number,
  now = new Date()
): VenueInsightsPeriod {
  const end = now.toISOString();
  const startMs = now.getTime() - days * 86_400_000;
  const start = new Date(startMs).toISOString();
  const previousEndMs = startMs - 1;
  const previousStartMs = previousEndMs - days * 86_400_000;
  return {
    days,
    start,
    end,
    previousStart: new Date(previousStartMs).toISOString(),
    previousEnd: new Date(previousEndMs).toISOString(),
  };
}

export function computeVenueCustomerMetrics(
  touchpoints: VenueQualifyingTouchpoint[],
  period: VenueInsightsPeriod
): VenueCustomerMetrics {
  const rows = dedupeVenueTouchpoints(touchpoints);
  const startMs = parseMs(period.start);
  const endMs = parseMs(period.end);
  const prevStartMs = parseMs(period.previousStart);
  const prevEndMs = parseMs(period.previousEnd);

  const firstEverByUser = new Map<string, number>();
  const activityCountByUser = new Map<string, number>();
  const usersInPeriod = new Set<string>();
  const usersInPrevious = new Set<string>();

  for (const tp of rows) {
    const t = parseMs(tp.occurredAt);
    activityCountByUser.set(
      tp.customerUserId,
      (activityCountByUser.get(tp.customerUserId) ?? 0) + 1
    );
    const prevFirst = firstEverByUser.get(tp.customerUserId);
    if (prevFirst == null || t < prevFirst) {
      firstEverByUser.set(tp.customerUserId, t);
    }
    if (inRange(tp.occurredAt, startMs, endMs)) {
      usersInPeriod.add(tp.customerUserId);
    }
    if (inRange(tp.occurredAt, prevStartMs, prevEndMs)) {
      usersInPrevious.add(tp.customerUserId);
    }
  }

  let firstTimeInPeriod = 0;
  let returningInPeriod = 0;
  for (const userId of usersInPeriod) {
    const firstEver = firstEverByUser.get(userId)!;
    if (inRange(new Date(firstEver).toISOString(), startMs, endMs)) {
      firstTimeInPeriod += 1;
    } else {
      returningInPeriod += 1;
    }
  }

  const uniqueInPeriod = usersInPeriod.size;
  const uniqueAllTime = firstEverByUser.size;
  const repeatAllTime = [...activityCountByUser.values()].filter(
    (n) => n >= 2
  ).length;

  const qualifyingActivitiesInPeriod = rows.filter((tp) =>
    inRange(tp.occurredAt, startMs, endMs)
  ).length;

  const newSharePercent =
    uniqueInPeriod > 0
      ? Math.round((firstTimeInPeriod / uniqueInPeriod) * 1000) / 10
      : null;
  const returningSharePercent =
    uniqueInPeriod > 0
      ? Math.round((returningInPeriod / uniqueInPeriod) * 1000) / 10
      : null;

  return {
    uniqueAllTime,
    uniqueInPeriod,
    firstTimeInPeriod,
    returningInPeriod,
    repeatAllTime,
    qualifyingActivitiesInPeriod,
    newSharePercent,
    returningSharePercent,
  };
}

export function computeListingPerformance(
  touchpoints: VenueQualifyingTouchpoint[],
  events: Array<{ id: string; title: string }>,
  offers: Array<{ id: string; title: string }>
): VenueBusinessInsights["listingPerformance"] {
  const rows = dedupeVenueTouchpoints(touchpoints);
  const eventUsers = new Map<string, Set<string>>();
  const eventBookings = new Map<string, number>();
  const eventCheckIns = new Map<string, number>();
  const offerUsers = new Map<string, Set<string>>();
  const offerVisits = new Map<string, number>();
  const offerRedemptions = new Map<string, number>();

  for (const tp of rows) {
    if (tp.eventId) {
      const users = eventUsers.get(tp.eventId) ?? new Set<string>();
      users.add(tp.customerUserId);
      eventUsers.set(tp.eventId, users);
      if (tp.activityType === "event_booking") {
        eventBookings.set(tp.eventId, (eventBookings.get(tp.eventId) ?? 0) + 1);
      }
      if (tp.activityType === "ticket_check_in") {
        eventCheckIns.set(tp.eventId, (eventCheckIns.get(tp.eventId) ?? 0) + 1);
      }
    }
    if (tp.offerId) {
      const users = offerUsers.get(tp.offerId) ?? new Set<string>();
      users.add(tp.customerUserId);
      offerUsers.set(tp.offerId, users);
      if (tp.activityType === "offer_visit") {
        offerVisits.set(tp.offerId, (offerVisits.get(tp.offerId) ?? 0) + 1);
      }
      if (tp.activityType === "offer_redemption") {
        offerRedemptions.set(
          tp.offerId,
          (offerRedemptions.get(tp.offerId) ?? 0) + 1
        );
      }
    }
  }

  return {
    events: events.map((e) => ({
      eventId: e.id,
      title: e.title,
      uniqueCustomers: eventUsers.get(e.id)?.size ?? 0,
      bookings: eventBookings.get(e.id) ?? 0,
      checkIns: eventCheckIns.get(e.id) ?? 0,
    })),
    offers: offers.map((o) => ({
      offerId: o.id,
      title: o.title,
      uniqueCustomers: offerUsers.get(o.id)?.size ?? 0,
      visits: offerVisits.get(o.id) ?? 0,
      redemptions: offerRedemptions.get(o.id) ?? 0,
    })),
  };
}

function buildObservations(
  customers: VenueCustomerMetrics,
  period: VenueInsightsPeriod,
  listing: VenueBusinessInsights["listingPerformance"]
): string[] {
  if (customers.uniqueInPeriod === 0) {
    return [
      "No qualifying customer activity in this period yet. Visibility views may still accrue separately.",
    ];
  }
  const out: string[] = [
    `${customers.uniqueInPeriod} unique customer(s) had qualifying Marketplace activity in the last ${period.days} days.`,
  ];
  if (customers.returningInPeriod > 0) {
    out.push(
      `${customers.returningInPeriod} returning customer(s) had prior activity at this Venue before the current period.`,
    );
  }
  if (customers.repeatAllTime > 0) {
    out.push(
      `${customers.repeatAllTime} customer(s) have 2 or more qualifying activities at this Venue overall.`,
    );
  }
  const topEvent = [...listing.events]
    .filter((e) => e.uniqueCustomers > 0)
    .sort((a, b) => b.uniqueCustomers - a.uniqueCustomers)[0];
  if (topEvent) {
    out.push(
      `Highest event reach: “${topEvent.title}” with ${topEvent.uniqueCustomers} unique customer(s).`,
    );
  }
  const topOffer = [...listing.offers]
    .filter((o) => o.uniqueCustomers > 0)
    .sort((a, b) => b.uniqueCustomers - a.uniqueCustomers)[0];
  if (topOffer) {
    out.push(
      `Highest offer reach: “${topOffer.title}” with ${topOffer.uniqueCustomers} unique customer(s).`,
    );
  }
  return out.slice(0, 5);
}

export function buildVenueBusinessInsightsFromTouchpoints(input: {
  touchpoints: VenueQualifyingTouchpoint[];
  period: VenueInsightsPeriod;
  visibility: VenueBusinessInsights["visibility"];
  events: Array<{ id: string; title: string }>;
  offers: Array<{ id: string; title: string }>;
}): VenueBusinessInsights {
  const rows = dedupeVenueTouchpoints(input.touchpoints);
  const customers = computeVenueCustomerMetrics(rows, input.period);
  const listingPerformance = computeListingPerformance(
    rows,
    input.events,
    input.offers
  );

  const startMs = parseMs(input.period.start);
  const endMs = parseMs(input.period.end);
  const prevStartMs = parseMs(input.period.previousStart);
  const prevEndMs = parseMs(input.period.previousEnd);

  const inCurrent = rows.filter((tp) =>
    inRange(tp.occurredAt, startMs, endMs)
  );
  const inPrevious = rows.filter((tp) =>
    inRange(tp.occurredAt, prevStartMs, prevEndMs)
  );

  const uniqueCurrent = new Set(inCurrent.map((t) => t.customerUserId)).size;
  const uniquePrevious = new Set(inPrevious.map((t) => t.customerUserId)).size;

  const visibilityInPeriod =
    input.visibility.venueViewsInPeriod +
    input.visibility.eventViewsInPeriod +
    input.visibility.offerViewsInPeriod;
  const visibilityPrevious =
    input.visibility.venueViewsAllTime -
    visibilityInPeriod; /* approx fallback — replaced in async builder */

  return {
    definition: VENUE_CUSTOMER_INSIGHT_DEFINITION,
    period: input.period,
    hasQualifyingActivity: customers.uniqueAllTime > 0,
    customers,
    trends: {
      uniqueCustomersDelta:
        uniquePrevious > 0 || uniqueCurrent > 0
          ? uniqueCurrent - uniquePrevious
          : null,
      qualifyingActivitiesDelta:
        inPrevious.length > 0 || inCurrent.length > 0
          ? inCurrent.length - inPrevious.length
          : null,
      visibilityViewsDelta:
        visibilityPrevious > 0 || visibilityInPeriod > 0
          ? visibilityInPeriod - visibilityPrevious
          : null,
    },
    visibility: input.visibility,
    engagement: {
      bookingsInPeriod: inCurrent.filter((t) => t.activityType === "event_booking")
        .length,
      checkInsInPeriod: inCurrent.filter(
        (t) => t.activityType === "ticket_check_in"
      ).length,
      visitsInPeriod: inCurrent.filter((t) => t.activityType === "offer_visit")
        .length,
      redemptionsInPeriod: inCurrent.filter(
        (t) => t.activityType === "offer_redemption"
      ).length,
    },
    listingPerformance,
    observations: buildObservations(customers, input.period, listingPerformance),
  };
}

async function countViewsAllTime(
  client: SupabaseClient,
  eventType: string,
  subjectIds: string[]
): Promise<number> {
  if (subjectIds.length === 0) return 0;
  const { count, error } = await client
    .from("customer_domain_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", eventType)
    .in("subject_id", subjectIds);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load visibility counts", {
      cause: error,
    });
  }
  return count ?? 0;
}

async function countViewsInRange(
  client: SupabaseClient,
  eventType: string,
  subjectIds: string[],
  start: string,
  end: string
): Promise<number> {
  if (subjectIds.length === 0) return 0;
  const { count, error } = await client
    .from("customer_domain_events")
    .select("id", { count: "exact", head: true })
    .eq("event_type", eventType)
    .in("subject_id", subjectIds)
    .gte("created_at", start)
    .lte("created_at", end);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load visibility counts", {
      cause: error,
    });
  }
  return count ?? 0;
}

export async function loadVenueQualifyingTouchpoints(
  client: SupabaseClient,
  venueId: string
): Promise<VenueQualifyingTouchpoint[]> {
  const [{ data: events }, { data: offers }] = await Promise.all([
    client
      .from("marketplace_events")
      .select("id")
      .eq("venue_id", venueId),
    client
      .from("marketplace_offer_events")
      .select("id")
      .eq("venue_id", venueId),
  ]);

  const eventIds = (events ?? []).map((e) => String(e.id));
  const offerIds = (offers ?? []).map((o) => String(o.id));
  const touchpoints: VenueQualifyingTouchpoint[] = [];

  if (eventIds.length > 0) {
    const [{ data: bookings }, { data: tickets }] = await Promise.all([
      client
        .from("marketplace_bookings")
        .select("id, buyer_user_id, event_id, status, created_at")
        .in("event_id", eventIds)
        .in("status", [...QUALIFYING_BOOKING_STATUSES]),
      client
        .from("marketplace_tickets")
        .select("id, holder_user_id, event_id, checked_in_at")
        .in("event_id", eventIds)
        .not("checked_in_at", "is", null),
    ]);

    for (const b of bookings ?? []) {
      touchpoints.push({
        venueId,
        customerUserId: String(b.buyer_user_id),
        activityType: "event_booking",
        sourceRecordId: `booking:${b.id}`,
        occurredAt: String(b.created_at),
        eventId: String(b.event_id),
      });
    }
    for (const t of tickets ?? []) {
      touchpoints.push({
        venueId,
        customerUserId: String(t.holder_user_id),
        activityType: "ticket_check_in",
        sourceRecordId: `ticket:${t.id}`,
        occurredAt: String(t.checked_in_at),
        eventId: String(t.event_id),
      });
    }
  }

  if (offerIds.length > 0) {
    const [{ data: visits }, { data: redemptions }] = await Promise.all([
      client
        .from("marketplace_offer_visits")
        .select("id, customer_user_id, offer_event_id, confirmed_at")
        .eq("venue_id", venueId),
      client
        .from("marketplace_redemptions")
        .select("id, claim_id, offer_event_id, created_at")
        .in("offer_event_id", offerIds),
    ]);

    for (const v of visits ?? []) {
      touchpoints.push({
        venueId,
        customerUserId: String(v.customer_user_id),
        activityType: "offer_visit",
        sourceRecordId: `visit:${v.id}`,
        occurredAt: String(v.confirmed_at),
        offerId: String(v.offer_event_id),
      });
    }

    const claimIds = (redemptions ?? []).map((r) => String(r.claim_id));
    const claimUserById = new Map<string, string>();
    if (claimIds.length > 0) {
      const { data: claims } = await client
        .from("marketplace_offer_claims")
        .select("id, claimant_user_id")
        .in("id", claimIds);
      for (const c of claims ?? []) {
        claimUserById.set(String(c.id), String(c.claimant_user_id));
      }
    }

    for (const r of redemptions ?? []) {
      const userId = claimUserById.get(String(r.claim_id));
      if (!userId) continue;
      touchpoints.push({
        venueId,
        customerUserId: userId,
        activityType: "offer_redemption",
        sourceRecordId: `redemption:${r.id}`,
        occurredAt: String(r.created_at),
        offerId: String(r.offer_event_id),
      });
    }
  }

  return dedupeVenueTouchpoints(touchpoints);
}

export async function buildVenueBusinessInsights(
  client: SupabaseClient,
  venueId: string,
  options?: { periodDays?: number }
): Promise<VenueBusinessInsights> {
  const periodDays = options?.periodDays ?? 30;
  const period = buildVenueInsightsPeriod(periodDays);

  const [{ data: events }, { data: offers }, touchpoints] = await Promise.all([
    client
      .from("marketplace_events")
      .select("id, title")
      .eq("venue_id", venueId),
    client
      .from("marketplace_offer_events")
      .select("id, title")
      .eq("venue_id", venueId),
    loadVenueQualifyingTouchpoints(client, venueId),
  ]);

  const eventRows = (events ?? []).map((e) => ({
    id: String(e.id),
    title: String(e.title ?? "Event"),
  }));
  const offerRows = (offers ?? []).map((o) => ({
    id: String(o.id),
    title: String(o.title ?? "Offer"),
  }));
  const eventIds = eventRows.map((e) => e.id);
  const offerIds = offerRows.map((o) => o.id);

  const [
    venueViewsAllTime,
    eventViewsAllTime,
    offerViewsAllTime,
    venueViewsInPeriod,
    eventViewsInPeriod,
    offerViewsInPeriod,
    venueViewsPrevious,
    eventViewsPrevious,
    offerViewsPrevious,
  ] = await Promise.all([
    client
      .from("customer_domain_events")
      .select("id", { count: "exact", head: true })
      .eq("event_type", "marketplace_venue_view")
      .eq("subject_id", venueId)
      .then((r) => r.count ?? 0),
    countViewsAllTime(client, "marketplace_event_view", eventIds),
    countViewsAllTime(client, "marketplace_offer_view", offerIds),
    countViewsInRange(
      client,
      "marketplace_venue_view",
      [venueId],
      period.start,
      period.end
    ),
    countViewsInRange(
      client,
      "marketplace_event_view",
      eventIds,
      period.start,
      period.end
    ),
    countViewsInRange(
      client,
      "marketplace_offer_view",
      offerIds,
      period.start,
      period.end
    ),
    countViewsInRange(
      client,
      "marketplace_venue_view",
      [venueId],
      period.previousStart,
      period.previousEnd
    ),
    countViewsInRange(
      client,
      "marketplace_event_view",
      eventIds,
      period.previousStart,
      period.previousEnd
    ),
    countViewsInRange(
      client,
      "marketplace_offer_view",
      offerIds,
      period.previousStart,
      period.previousEnd
    ),
  ]);

  const visibility = {
    venueViewsAllTime,
    eventViewsAllTime,
    offerViewsAllTime,
    venueViewsInPeriod,
    eventViewsInPeriod,
    offerViewsInPeriod,
  };

  const insights = buildVenueBusinessInsightsFromTouchpoints({
    touchpoints,
    period,
    visibility,
    events: eventRows,
    offers: offerRows,
  });

  const visibilityCurrent =
    venueViewsInPeriod + eventViewsInPeriod + offerViewsInPeriod;
  const visibilityPreviousPeriod =
    venueViewsPrevious + eventViewsPrevious + offerViewsPrevious;

  insights.trends.visibilityViewsDelta =
    visibilityPreviousPeriod > 0 || visibilityCurrent > 0
      ? visibilityCurrent - visibilityPreviousPeriod
      : null;

  return insights;
}

export async function assertVenueInsightsAccess(input: {
  userClient: SupabaseClient;
  adminClient: SupabaseClient;
  userId: string;
  venueId: string;
  assignments: RoleAssignment[];
}): Promise<void> {
  const report = await buildVenueDashboard(input.adminClient, input.venueId);
  if (!report) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }

  const canOps = actorHasMarketplacePermission(
    input.assignments,
    "marketplace.venue.approve"
  );
  if (canOps) return;

  const orgs = await listUserOrganisations(input.userClient, input.userId).catch(
    () => []
  );
  const orgOk = orgs.some(
    (o) => String(o.organisation_id) === report.organisationId
  );
  const units = await listMbdpUnitsForUser(input.userClient, input.userId);
  const unitOk = units.some(
    (u) => String(u.id) === String(report.attributedUnitId ?? "")
  );
  const submitter = report.submittedBy === input.userId;
  if (!orgOk && !unitOk && !submitter) {
    throw new AppError("FORBIDDEN", "Not allowed to read this Venue's insights", {
      status: 403,
    });
  }
}
