import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";

export type OfferOpsClaimRow = {
  id: string;
  status: string;
  claimedAt: string;
  expiresAt: string;
  redeemedAt: string | null;
  customerUserId: string;
  visit: {
    id: string;
    confirmedAt: string;
    confirmedByStaffUserId: string | null;
    status: string;
  } | null;
  redemption: {
    id: string;
    createdAt: string;
    redeemedByStaffUserId: string | null;
    saleConfirmed: boolean;
  } | null;
};

export type OfferOpsInspection = {
  offer: {
    id: string;
    title: string;
    status: string;
    campaignStartsAt: string;
    campaignEndsAt: string;
    claimsCount: number;
    customerCap: number;
  };
  venue: {
    id: string;
    displayName: string;
    city: string | null;
    status: string;
  };
  claims: OfferOpsClaimRow[];
  domainEvents: Array<{
    id: string;
    eventType: string;
    createdAt: string;
    actorUserId: string | null;
    subjectType: string | null;
    payload: Record<string, unknown>;
  }>;
};

export async function loadOfferOpsInspection(
  client: SupabaseClient,
  offerId: string
): Promise<OfferOpsInspection> {
  const { data: offer, error: offerErr } = await client
    .from("marketplace_offer_events")
    .select(
      "id,title,status,campaign_starts_at,campaign_ends_at,claims_count,customer_cap,venue_id,marketplace_venues(id,display_name,city,status)"
    )
    .eq("id", offerId)
    .maybeSingle();
  if (offerErr || !offer) {
    throw new AppError("NOT_FOUND", "Offer not found", { status: 404 });
  }

  const venueRaw = offer.marketplace_venues;
  const venue = Array.isArray(venueRaw) ? venueRaw[0] : venueRaw;
  if (!venue) {
    throw new AppError("NOT_FOUND", "Venue not found for offer", { status: 404 });
  }

  const { data: claims } = await client
    .from("marketplace_offer_claims")
    .select(
      "id,status,claimed_at,expires_at,redeemed_at,claimant_user_id,marketplace_offer_visits(id,confirmed_at,status,confirmed_by_staff_user_id),marketplace_redemptions(id,created_at,redeemed_by_staff_user_id,sale_confirmed)"
    )
    .eq("offer_event_id", offerId)
    .order("claimed_at", { ascending: false })
    .limit(100);

  const claimIds = (claims ?? []).map((c) => String(c.id));
  let domainEvents: OfferOpsInspection["domainEvents"] = [];

  const visitIds = (claims ?? [])
    .map((c) => {
      const v = Array.isArray(c.marketplace_offer_visits)
        ? c.marketplace_offer_visits[0]
        : c.marketplace_offer_visits;
      return v?.id ? String(v.id) : null;
    })
    .filter(Boolean) as string[];

  const redemptionIds = (claims ?? [])
    .map((c) => {
      const r = Array.isArray(c.marketplace_redemptions)
        ? c.marketplace_redemptions[0]
        : c.marketplace_redemptions;
      return r?.id ? String(r.id) : null;
    })
    .filter(Boolean) as string[];

  const filters: string[] = [];
  for (const id of claimIds) {
    filters.push(`and(subject_type.eq.marketplace_offer_claim,subject_id.eq.${id})`);
  }
  for (const id of visitIds) {
    filters.push(`and(subject_type.eq.marketplace_offer_visit,subject_id.eq.${id})`);
  }
  for (const id of redemptionIds) {
    filters.push(`and(subject_type.eq.marketplace_redemption,subject_id.eq.${id})`);
  }
  filters.push(`and(subject_type.eq.marketplace_offer_event,subject_id.eq.${offerId})`);

  if (filters.length > 0) {
    const { data: ev2 } = await client
      .from("customer_domain_events")
      .select("id,event_type,created_at,actor_user_id,subject_type,payload")
      .or(filters.join(","))
      .order("created_at", { ascending: false })
      .limit(80);
    domainEvents = (ev2 ?? []).map((e) => ({
      id: String(e.id),
      eventType: String(e.event_type),
      createdAt: String(e.created_at),
      actorUserId: e.actor_user_id ? String(e.actor_user_id) : null,
      subjectType: e.subject_type ? String(e.subject_type) : null,
      payload: (e.payload as Record<string, unknown>) ?? {},
    }));
  }

  return {
    offer: {
      id: String(offer.id),
      title: String(offer.title ?? "Offer"),
      status: String(offer.status),
      campaignStartsAt: String(offer.campaign_starts_at),
      campaignEndsAt: String(offer.campaign_ends_at),
      claimsCount: Number(offer.claims_count ?? 0),
      customerCap: Number(offer.customer_cap ?? 0),
    },
    venue: {
      id: String(venue.id),
      displayName: String(venue.display_name ?? "Venue"),
      city: venue.city ? String(venue.city) : null,
      status: String(venue.status),
    },
    claims: (claims ?? []).map((c) => {
      const visitRaw = c.marketplace_offer_visits;
      const visit = Array.isArray(visitRaw) ? visitRaw[0] : visitRaw;
      const redemptionRaw = c.marketplace_redemptions;
      const redemption = Array.isArray(redemptionRaw)
        ? redemptionRaw[0]
        : redemptionRaw;
      return {
        id: String(c.id),
        status: String(c.status),
        claimedAt: String(c.claimed_at),
        expiresAt: String(c.expires_at),
        redeemedAt: c.redeemed_at ? String(c.redeemed_at) : null,
        customerUserId: String(c.claimant_user_id),
        visit: visit
          ? {
              id: String(visit.id),
              confirmedAt: String(visit.confirmed_at),
              confirmedByStaffUserId: visit.confirmed_by_staff_user_id
                ? String(visit.confirmed_by_staff_user_id)
                : null,
              status: String(visit.status),
            }
          : null,
        redemption: redemption
          ? {
              id: String(redemption.id),
              createdAt: String(redemption.created_at),
              redeemedByStaffUserId: redemption.redeemed_by_staff_user_id
                ? String(redemption.redeemed_by_staff_user_id)
                : null,
              saleConfirmed: Boolean(redemption.sale_confirmed),
            }
          : null,
      };
    }),
    domainEvents,
  };
}
