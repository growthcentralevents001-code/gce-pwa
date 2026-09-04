import type { SupabaseClient } from "@supabase/supabase-js";
import {
  buildMbdpDashboard,
  buildVenueDashboard,
  buildVenueEngagementMetrics,
  buildVenueBusinessInsights,
  listMbdpUnitsForUser,
} from "@/lib/architecture/marketplace";
import { listUserOrganisations } from "@/lib/architecture/organisations/memberships";

export type MbdpUnitRow = Record<string, unknown> & { id: string };

export type MbdpBundle = {
  units: MbdpUnitRow[];
  unit: MbdpUnitRow | null;
  report: Awaited<ReturnType<typeof buildMbdpDashboard>>;
  attributions: Record<string, unknown>[];
  venues: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
  events: Record<string, unknown>[];
  offers: Record<string, unknown>[];
};

export type VenueBundle = {
  organisations: Record<string, unknown>[];
  venues: Record<string, unknown>[];
  venue: Record<string, unknown> | null;
  report: Awaited<ReturnType<typeof buildVenueDashboard>>;
  engagement: Awaited<ReturnType<typeof buildVenueEngagementMetrics>> | null;
  insights: Awaited<ReturnType<typeof buildVenueBusinessInsights>> | null;
  events: Record<string, unknown>[];
  offers: Record<string, unknown>[];
  bookings: Record<string, unknown>[];
  claims: Record<string, unknown>[];
  entitlements: Record<string, unknown>[];
};

export async function loadMbdpBundle(
  userClient: SupabaseClient,
  adminClient: SupabaseClient,
  userId: string,
  preferredUnitId?: string | null
): Promise<MbdpBundle> {
  const units = (await listMbdpUnitsForUser(
    userClient,
    userId
  )) as MbdpUnitRow[];
  const unit =
    (preferredUnitId
      ? units.find((u) => u.id === preferredUnitId)
      : undefined) ??
    units.find((u) => u.application_status === "active") ??
    units[0] ??
    null;

  if (!unit) {
    return {
      units,
      unit: null,
      report: null,
      attributions: [],
      venues: [],
      entitlements: [],
      events: [],
      offers: [],
    };
  }

  const unitId = unit.id;
  const client = adminClient;

  const [
    report,
    { data: attrs },
    { data: ents },
  ] = await Promise.all([
    buildMbdpDashboard(client, unitId),
    client
      .from("marketplace_venue_attributions")
      .select("*, marketplace_venues(*)")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(100),
    client
      .from("marketplace_revenue_entitlements")
      .select("*")
      .eq("unit_id", unitId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const attributions = (attrs as Record<string, unknown>[]) ?? [];
  const venues = attributions
    .map((a) => {
      const v = a.marketplace_venues;
      return Array.isArray(v) ? v[0] : v;
    })
    .filter(Boolean) as Record<string, unknown>[];

  const venueIds = venues.map((v) => String(v.id)).filter(Boolean);
  let events: Record<string, unknown>[] = [];
  let offers: Record<string, unknown>[] = [];
  if (venueIds.length > 0) {
    const [{ data: ev }, { data: of }] = await Promise.all([
      client
        .from("marketplace_events")
        .select("*")
        .in("venue_id", venueIds)
        .order("created_at", { ascending: false })
        .limit(40),
      client
        .from("marketplace_offer_events")
        .select("*")
        .in("venue_id", venueIds)
        .order("created_at", { ascending: false })
        .limit(40),
    ]);
    events = (ev as Record<string, unknown>[]) ?? [];
    offers = (of as Record<string, unknown>[]) ?? [];
  }

  return {
    units,
    unit,
    report,
    attributions,
    venues,
    entitlements: (ents as Record<string, unknown>[]) ?? [],
    events,
    offers,
  };
}

export async function loadVenueBundle(
  userClient: SupabaseClient,
  adminClient: SupabaseClient,
  userId: string,
  preferredVenueId?: string | null
): Promise<VenueBundle> {
  const orgs = (await listUserOrganisations(userClient, userId).catch(
    () => []
  )) as Record<string, unknown>[];
  const orgIds = orgs
    .map((o) => String(o.organisation_id ?? ""))
    .filter(Boolean);

  let venues: Record<string, unknown>[] = [];
  if (orgIds.length > 0) {
    const { data } = await adminClient
      .from("marketplace_venues")
      .select("*")
      .in("organisation_id", orgIds)
      .order("created_at", { ascending: false })
      .limit(40);
    venues = (data as Record<string, unknown>[]) ?? [];
  }

  // Also include venues where user is submitter (assistive fallback)
  if (venues.length === 0) {
    const { data } = await adminClient
      .from("marketplace_venues")
      .select("*")
      .eq("submitted_by", userId)
      .order("created_at", { ascending: false })
      .limit(20);
    venues = (data as Record<string, unknown>[]) ?? [];
  }

  const venue =
    (preferredVenueId
      ? venues.find((v) => String(v.id) === preferredVenueId)
      : undefined) ??
    venues.find((v) => v.status === "active") ??
    venues[0] ??
    null;

  if (!venue) {
    return {
      organisations: orgs,
      venues,
      venue: null,
      report: null,
      engagement: null,
      insights: null,
      events: [],
      offers: [],
      bookings: [],
      claims: [],
      entitlements: [],
    };
  }

  const venueId = String(venue.id);
  const [
    report,
    engagement,
    insights,
    { data: events },
    { data: offers },
    { data: entitlements },
  ] = await Promise.all([
    buildVenueDashboard(adminClient, venueId),
    buildVenueEngagementMetrics(adminClient, venueId).catch(() => null),
    buildVenueBusinessInsights(adminClient, venueId).catch(() => null),
    adminClient
      .from("marketplace_events")
      .select("*")
      .eq("venue_id", venueId)
      .order("starts_at", { ascending: false })
      .limit(50),
    adminClient
      .from("marketplace_offer_events")
      .select("*")
      .eq("venue_id", venueId)
      .order("created_at", { ascending: false })
      .limit(50),
    adminClient
      .from("marketplace_revenue_entitlements")
      .select("*")
      .eq("venue_id", venueId)
      .order("created_at", { ascending: false })
      .limit(50),
  ]);

  const eventIds = ((events as Record<string, unknown>[]) ?? []).map((e) =>
    String(e.id)
  );
  let bookings: Record<string, unknown>[] = [];
  const ticketSummaryByBooking = new Map<
    string,
    { issued: number; checkedIn: number; cancelled: number }
  >();
  if (eventIds.length > 0) {
    const { data } = await adminClient
      .from("marketplace_bookings")
      .select("*")
      .in("event_id", eventIds)
      .order("created_at", { ascending: false })
      .limit(50);
    bookings = (data as Record<string, unknown>[]) ?? [];
    const bookingIds = bookings.map((b) => String(b.id));
    if (bookingIds.length > 0) {
      const { data: ticketRows } = await adminClient
        .from("marketplace_tickets")
        .select("booking_id,status")
        .in("booking_id", bookingIds);
      for (const t of ticketRows ?? []) {
        const bid = String(t.booking_id);
        const summary = ticketSummaryByBooking.get(bid) ?? {
          issued: 0,
          checkedIn: 0,
          cancelled: 0,
        };
        const st = String(t.status ?? "");
        if (st === "checked_in") summary.checkedIn += 1;
        else if (st === "cancelled" || st === "voided") summary.cancelled += 1;
        else if (st === "issued") summary.issued += 1;
        ticketSummaryByBooking.set(bid, summary);
      }
    }
  }

  const offerIds = ((offers as Record<string, unknown>[]) ?? []).map((o) =>
    String(o.id)
  );
  const visitByClaim = new Map<string, { confirmedAt: string | null }>();
  const redemptionByClaim = new Map<string, { createdAt: string | null }>();
  if (offerIds.length > 0) {
    const claimIds = ((await adminClient
      .from("marketplace_offer_claims")
      .select("id")
      .in("offer_event_id", offerIds)) as { data: { id: string }[] | null }).data ?? [];
    const ids = claimIds.map((c) => String(c.id));
    if (ids.length > 0) {
      const [{ data: visits }, { data: reds }] = await Promise.all([
        adminClient
          .from("marketplace_offer_visits")
          .select("claim_id,confirmed_at")
          .in("claim_id", ids),
        adminClient
          .from("marketplace_redemptions")
          .select("claim_id,created_at")
          .in("claim_id", ids),
      ]);
      for (const v of visits ?? []) {
        visitByClaim.set(String(v.claim_id), {
          confirmedAt: v.confirmed_at ? String(v.confirmed_at) : null,
        });
      }
      for (const r of reds ?? []) {
        redemptionByClaim.set(String(r.claim_id), {
          createdAt: r.created_at ? String(r.created_at) : null,
        });
      }
    }
  }

  let claims: Record<string, unknown>[] = [];
  if (offerIds.length > 0) {
    const { data } = await adminClient
      .from("marketplace_offer_claims")
      .select("*")
      .in("offer_event_id", offerIds)
      .order("created_at", { ascending: false })
      .limit(50);
    claims = ((data as Record<string, unknown>[]) ?? []).map((c) => ({
      ...c,
      visitConfirmedAt: visitByClaim.get(String(c.id))?.confirmedAt ?? null,
      redeemedAt: redemptionByClaim.get(String(c.id))?.createdAt ?? c.redeemed_at,
    }));
  }

  return {
    organisations: orgs,
    venues,
    venue,
    report,
    engagement,
    insights,
    events: (events as Record<string, unknown>[]) ?? [],
    offers: (offers as Record<string, unknown>[]) ?? [],
    bookings: bookings.map((b) => {
      const summary = ticketSummaryByBooking.get(String(b.id));
      return {
        ...b,
        ticketsIssued: summary?.issued ?? 0,
        ticketsCheckedIn: summary?.checkedIn ?? 0,
        ticketsCancelled: summary?.cancelled ?? 0,
      };
    }),
    claims,
    entitlements: (entitlements as Record<string, unknown>[]) ?? [],
  };
}
