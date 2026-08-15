import type { SupabaseClient } from "@supabase/supabase-js";
import { randomBytes } from "node:crypto";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import {
  hashDisplayToken,
  issueDisplayCredentialMaterial,
  persistDisplayCredential,
} from "../credentials";
import {
  calculateMarketplaceSplit,
  validateOfferCampaign,
  claimExpiresAt,
  EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
  MARKETPLACE_RULE_VERSION,
  OFFER_CLAIM_VALIDITY_HOURS,
  OFFER_CUSTOMER_CAP,
} from "./constants";

function tokenHash(raw: string): string {
  return hashDisplayToken(raw);
}

export async function createMarketplaceVenue(
  client: SupabaseClient,
  input: {
    organisationId: string;
    displayName: string;
    city: string;
    state?: string | null;
    address?: string | null;
    category?: string | null;
    legacyVenueId?: string | null;
    actorUserId: string;
    recommendUnitId?: string | null;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("marketplace_venues")
    .insert({
      organisation_id: input.organisationId,
      display_name: input.displayName,
      city: input.city,
      state: input.state ?? null,
      address: input.address ?? null,
      category: input.category ?? null,
      legacy_venue_id: input.legacyVenueId ?? null,
      status: "submitted",
      submitted_by: input.actorUserId,
      recommended_by_unit_id: input.recommendUnitId ?? null,
      recommended_by_user_id: input.recommendUnitId ? input.actorUserId : null,
      recommended_at: input.recommendUnitId ? new Date().toISOString() : null,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create marketplace venue", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.create",
    resourceType: "marketplace_venue",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/** Platform Marketplace Ops final approval — Venue cannot self-approve; MBDP cannot final-approve. */
export async function approveMarketplaceVenue(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: venue, error } = await client
    .from("marketplace_venues")
    .select("*")
    .eq("id", input.venueId)
    .single();
  if (error || !venue) {
    throw new AppError("NOT_FOUND", "Venue not found", { status: 404 });
  }
  if (venue.submitted_by === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Venue submitter cannot self-approve", {
      status: 403,
    });
  }
  if (venue.recommended_by_user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Marketplace BDP recommender cannot final-approve Venue (FD-037)",
      { status: 403 }
    );
  }
  const { data, error: upErr } = await client
    .from("marketplace_venues")
    .update({
      status: "active",
      approved_by: input.actorUserId,
      approved_at: new Date().toISOString(),
    })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to approve venue", {
      cause: upErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.approve",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function proposeVenueAttribution(
  client: SupabaseClient,
  input: {
    venueId: string;
    unitId: string;
    bdpUserId: string;
    actorUserId: string;
    provenance?: string;
    basis?: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("marketplace_venue_attributions")
    .insert({
      venue_id: input.venueId,
      unit_id: input.unitId,
      bdp_user_id: input.bdpUserId,
      status: "proposed",
      provenance: input.provenance ?? "sourced",
      basis: input.basis ?? null,
      created_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to propose attribution", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_attr.proposed",
    resourceType: "marketplace_venue_attribution",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function activateVenueAttribution(
  client: SupabaseClient,
  input: {
    attributionId: string;
    actorUserId: string;
    reason?: string;
    correlationId?: string;
  }
) {
  const { data: existing, error } = await client
    .from("marketplace_venue_attributions")
    .select("*")
    .eq("id", input.attributionId)
    .single();
  if (error || !existing) {
    throw new AppError("NOT_FOUND", "Attribution not found", { status: 404 });
  }
  if (existing.bdp_user_id === input.actorUserId) {
    throw new AppError(
      "FORBIDDEN",
      "Marketplace BDP cannot self-approve attribution",
      { status: 403 }
    );
  }
  const { data, error: upErr } = await client
    .from("marketplace_venue_attributions")
    .update({
      status: "active",
      approved_by: input.actorUserId,
      effective_from: new Date().toISOString(),
      reason: input.reason ?? existing.reason,
    })
    .eq("id", input.attributionId)
    .select("*")
    .single();
  if (upErr || !data) {
    throw new AppError("CONFLICT", upErr?.message || "Attribution activate failed", {
      status: 409,
      cause: upErr,
    });
  }
  if (data.unit_id) {
    await client.rpc("gce_mbdp_refresh_venue_counts", {
      p_unit_id: data.unit_id,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_attr.activated",
    resourceType: "marketplace_venue_attribution",
    resourceId: input.attributionId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createMarketplaceEvent(
  client: SupabaseClient,
  input: {
    venueId: string;
    title: string;
    startsAt: string;
    endsAt?: string | null;
    capacity: number;
    priceMinor: number;
    category?: string | null;
    description?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("marketplace_events")
    .insert({
      venue_id: input.venueId,
      title: input.title,
      description: input.description ?? null,
      category: input.category ?? null,
      starts_at: input.startsAt,
      ends_at: input.endsAt ?? null,
      capacity: input.capacity,
      price_minor: input.priceMinor,
      status: "draft",
      cancel_cutoff_hours: EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
      submitted_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create event", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_event.create",
    resourceType: "marketplace_event",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function submitMarketplaceEvent(
  client: SupabaseClient,
  input: { eventId: string; actorUserId: string; correlationId?: string }
) {
  const { data, error } = await client
    .from("marketplace_events")
    .update({ status: "submitted" })
    .eq("id", input.eventId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to submit event", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_event.submit",
    resourceType: "marketplace_event",
    resourceId: input.eventId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function approveMarketplaceEvent(
  client: SupabaseClient,
  input: {
    eventId: string;
    actorUserId: string;
    publish?: boolean;
    correlationId?: string;
  }
) {
  const { data: existing } = await client
    .from("marketplace_events")
    .select("*")
    .eq("id", input.eventId)
    .single();
  if (!existing) {
    throw new AppError("NOT_FOUND", "Event not found", { status: 404 });
  }
  if (existing.submitted_by === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Venue cannot self-approve event", {
      status: 403,
    });
  }
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("marketplace_events")
    .update({
      status: input.publish === false ? "approved" : "published",
      approved_by: input.actorUserId,
      approved_at: now,
      published_at: input.publish === false ? null : now,
    })
    .eq("id", input.eventId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to approve event", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_event.approve",
    resourceType: "marketplace_event",
    resourceId: input.eventId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createOfferEvent(
  client: SupabaseClient,
  input: {
    venueId: string;
    title: string;
    plannedCommercialValueMinor: number;
    campaignStartsAt: string;
    campaignEndsAt: string;
    customerCap?: number;
    description?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const validation = validateOfferCampaign({
    plannedCommercialValueMinor: input.plannedCommercialValueMinor,
    campaignStartsAt: new Date(input.campaignStartsAt),
    campaignEndsAt: new Date(input.campaignEndsAt),
    customerCap: input.customerCap ?? OFFER_CUSTOMER_CAP,
  });
  if (!validation.ok) {
    throw new AppError("VALIDATION_ERROR", validation.reason, { status: 400 });
  }
  const { data, error } = await client
    .from("marketplace_offer_events")
    .insert({
      venue_id: input.venueId,
      title: input.title,
      description: input.description ?? null,
      planned_commercial_value_minor: input.plannedCommercialValueMinor,
      campaign_starts_at: input.campaignStartsAt,
      campaign_ends_at: input.campaignEndsAt,
      customer_cap: input.customerCap ?? OFFER_CUSTOMER_CAP,
      claim_validity_hours: OFFER_CLAIM_VALIDITY_HOURS,
      status: "draft",
      submitted_by: input.actorUserId,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create offer event", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_offer.create",
    resourceType: "marketplace_offer_event",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function approveOfferEvent(
  client: SupabaseClient,
  input: {
    offerId: string;
    actorUserId: string;
    publish?: boolean;
    correlationId?: string;
  }
) {
  const { data: existing } = await client
    .from("marketplace_offer_events")
    .select("*")
    .eq("id", input.offerId)
    .single();
  if (!existing) {
    throw new AppError("NOT_FOUND", "Offer not found", { status: 404 });
  }
  if (existing.submitted_by === input.actorUserId) {
    throw new AppError("FORBIDDEN", "Venue cannot self-approve offer", {
      status: 403,
    });
  }
  const now = new Date().toISOString();
  const { data, error } = await client
    .from("marketplace_offer_events")
    .update({
      status: input.publish === false ? "approved" : "published",
      approved_by: input.actorUserId,
      approved_at: now,
      published_at: input.publish === false ? null : now,
    })
    .eq("id", input.offerId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to approve offer", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_offer.approve",
    resourceType: "marketplace_offer_event",
    resourceId: input.offerId,
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function createBooking(
  client: SupabaseClient,
  input: {
    eventId: string;
    buyerUserId: string;
    quantity: number;
    idempotencyKey?: string;
    correlationId?: string;
  }
) {
  const { data: event, error } = await client
    .from("marketplace_events")
    .select("*")
    .eq("id", input.eventId)
    .single();
  if (error || !event) {
    throw new AppError("NOT_FOUND", "Event not found", { status: 404 });
  }
  if (event.status !== "published") {
    throw new AppError("VALIDATION_ERROR", "Event is not published", {
      status: 400,
    });
  }
  const unit = Number(event.price_minor);
  const { data, error: insErr } = await client
    .from("marketplace_bookings")
    .insert({
      event_id: input.eventId,
      buyer_user_id: input.buyerUserId,
      quantity: input.quantity,
      unit_price_minor: unit,
      total_minor: unit * input.quantity,
      status: "pending_payment",
      cancel_cutoff_hours: event.cancel_cutoff_hours,
      cancel_policy_version: event.cancel_policy_version,
      attribution_id: event.attribution_id,
      idempotency_key: input.idempotencyKey ?? null,
    })
    .select("*")
    .single();
  if (insErr || !data) {
    throw new AppError("CONFLICT", insErr?.message || "Booking failed", {
      status: 409,
      cause: insErr,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.buyerUserId,
    action: "marketplace_booking.create",
    resourceType: "marketplace_booking",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

/** Issue tickets after payment confirmation (sandbox-safe; money flag may still be OFF). */
export async function issueTicketsForBooking(
  client: SupabaseClient,
  input: {
    bookingId: string;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<{ booking: Record<string, unknown>; tickets: unknown[]; rawTokens: string[] }> {
  const { data: booking, error } = await client
    .from("marketplace_bookings")
    .select("*")
    .eq("id", input.bookingId)
    .single();
  if (error || !booking) {
    throw new AppError("NOT_FOUND", "Booking not found", { status: 404 });
  }

  const { data: existingTickets } = await client
    .from("marketplace_tickets")
    .select("*")
    .eq("booking_id", input.bookingId);
  if (existingTickets && existingTickets.length > 0) {
    return { booking, tickets: existingTickets, rawTokens: [] };
  }

  const qty = Number(booking.quantity);
  const issued = Array.from({ length: qty }, () => {
    const material = issueDisplayCredentialMaterial();
    return {
      raw: material.rawToken,
      row: {
        booking_id: input.bookingId,
        event_id: booking.event_id,
        holder_user_id: booking.buyer_user_id,
        ticket_ref: `TCK-${randomBytes(8).toString("hex").toUpperCase()}`,
        qr_token_hash: material.tokenHash,
        status: "issued",
      },
    };
  });
  const rawTokens = issued.map((item) => item.raw);

  const { data: tickets, error: tErr } = await client
    .from("marketplace_tickets")
    .insert(issued.map((item) => item.row))
    .select("*");
  if (tErr || !tickets) {
    throw new AppError("INTERNAL_ERROR", "Failed to issue tickets", {
      cause: tErr,
    });
  }

  for (const ticket of tickets) {
    const match = issued.find(
      (item) => item.row.qr_token_hash === ticket.qr_token_hash
    );
    if (!ticket?.id || !match) {
      throw new AppError(
        "INTERNAL_ERROR",
        "Failed to persist ticket display credential",
        { status: 500, expose: false }
      );
    }
    await persistDisplayCredential(client, {
      subjectType: "ticket",
      subjectId: String(ticket.id),
      rawToken: match.raw,
      tokenHash: match.row.qr_token_hash,
    });
  }

  const { data: updated } = await client
    .from("marketplace_bookings")
    .update({ status: "confirmed" })
    .eq("id", input.bookingId)
    .select("*")
    .single();

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_ticket.issue",
    resourceType: "marketplace_booking",
    resourceId: input.bookingId,
    after: { ticketCount: tickets.length },
    correlationId: input.correlationId,
  });

  return { booking: updated ?? booking, tickets, rawTokens };
}

export async function claimOffer(
  client: SupabaseClient,
  input: {
    offerEventId: string;
    claimantUserId: string;
    correlationId?: string;
  }
) {
  const { data: offer, error } = await client
    .from("marketplace_offer_events")
    .select("*")
    .eq("id", input.offerEventId)
    .single();
  if (error || !offer) {
    throw new AppError("NOT_FOUND", "Offer not found", { status: 404 });
  }
  if (offer.status !== "published") {
    throw new AppError("VALIDATION_ERROR", "Offer is not published", {
      status: 400,
    });
  }
  if (Number(offer.claims_count) >= Number(offer.customer_cap)) {
    throw new AppError("CONFLICT", "Offer customer cap reached", {
      status: 409,
    });
  }

  const material = issueDisplayCredentialMaterial();
  const raw = material.rawToken;
  const claimedAt = new Date();
  const { data, error: insErr } = await client
    .from("marketplace_offer_claims")
    .insert({
      offer_event_id: input.offerEventId,
      claimant_user_id: input.claimantUserId,
      claim_token_hash: material.tokenHash,
      status: "claimed",
      claimed_at: claimedAt.toISOString(),
      expires_at: claimExpiresAt(claimedAt).toISOString(),
      metadata: { is_revenue: false },
    })
    .select("*")
    .single();
  if (insErr || !data) {
    throw new AppError("CONFLICT", insErr?.message || "Claim failed", {
      status: 409,
      cause: insErr,
    });
  }
  await client
    .from("marketplace_offer_events")
    .update({ claims_count: Number(offer.claims_count) + 1 })
    .eq("id", input.offerEventId);

  await persistDisplayCredential(client, {
    subjectType: "offer_claim",
    subjectId: String(data.id),
    rawToken: raw,
    tokenHash: material.tokenHash,
  });

  await writeAuditEvent(client, {
    actorUserId: input.claimantUserId,
    action: "marketplace_offer.claim",
    resourceType: "marketplace_offer_claim",
    resourceId: String(data.id),
    after: { ...data, note: "claim_is_not_revenue" },
    correlationId: input.correlationId,
  });
  return { claim: data, rawClaimToken: raw };
}

export async function createRevenueEntitlement(
  client: SupabaseClient,
  input: {
    earningEventKey: string;
    sourceType: string;
    sourceId?: string | null;
    venueId: string;
    attributionId?: string | null;
    unitId?: string | null;
    eligibleRevenueMinor: number;
    hasValidAttribution: boolean;
    actorUserId: string;
    state?: "estimated" | "earned" | "settlement_eligible";
    correlationId?: string;
  }
) {
  const split = calculateMarketplaceSplit(
    input.eligibleRevenueMinor,
    input.hasValidAttribution
  );
  const { data, error } = await client
    .from("marketplace_revenue_entitlements")
    .upsert(
      {
        earning_event_key: input.earningEventKey,
        source_type: input.sourceType,
        source_id: input.sourceId ?? null,
        venue_id: input.venueId,
        attribution_id: input.attributionId ?? null,
        unit_id: input.unitId ?? null,
        eligible_revenue_minor: input.eligibleRevenueMinor,
        venue_share_minor: split.venueShareMinor,
        mbdp_share_minor: split.mbdpShareMinor,
        gce_share_minor: split.gceShareMinor,
        mbdp_commission_bps: split.mbdpCommissionBps,
        has_valid_attribution: input.hasValidAttribution,
        state: input.state ?? "earned",
        rule_version: MARKETPLACE_RULE_VERSION,
        metadata: {
          entitled_mbdp: split.entitledMbdp,
          unattributed: !input.hasValidAttribution,
        },
      },
      { onConflict: "earning_event_key" }
    )
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record entitlement", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_entitlement.recorded",
    resourceType: "marketplace_revenue_entitlement",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });
  return data;
}

export async function setVenueInactive(
  client: SupabaseClient,
  input: {
    venueId: string;
    actorUserId: string;
    reason: string;
    temporary?: boolean;
    correlationId?: string;
  }
) {
  const { data, error } = await client
    .from("marketplace_venues")
    .update({
      status: input.temporary === false ? "suspended" : "temporarily_inactive",
      inactive_reason: input.reason,
    })
    .eq("id", input.venueId)
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to set venue inactive", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.inactive",
    resourceType: "marketplace_venue",
    resourceId: input.venueId,
    after: data,
    reason: input.reason,
    correlationId: input.correlationId,
  });
  return data;
}

export async function handoverVenueAttribution(
  client: SupabaseClient,
  input: {
    venueId: string;
    fromUnitId: string;
    toUnitId: string;
    actorUserId: string;
    notes?: string | null;
    correlationId?: string;
  }
) {
  const now = new Date().toISOString();
  const { data: handover, error } = await client
    .from("marketplace_venue_handovers")
    .insert({
      venue_id: input.venueId,
      source_unit_id: input.fromUnitId,
      target_unit_id: input.toUnitId,
      status: "approved",
      effective_from: now,
      notes: input.notes ?? null,
      requested_by: input.actorUserId,
      approved_by: input.actorUserId,
      completed_at: now,
    })
    .select("*")
    .single();
  if (error || !handover) {
    throw new AppError("INTERNAL_ERROR", "Failed to create handover", {
      cause: error,
    });
  }

  await client
    .from("marketplace_venue_attributions")
    .update({ status: "reassigned_closed", effective_to: now })
    .eq("venue_id", input.venueId)
    .eq("unit_id", input.fromUnitId)
    .eq("status", "active");

  const { data: toUnit } = await client
    .from("marketplace_bdp_units")
    .select("user_id")
    .eq("id", input.toUnitId)
    .single();

  await client.from("marketplace_venue_attributions").insert({
    venue_id: input.venueId,
    unit_id: input.toUnitId,
    bdp_user_id: toUnit?.user_id ?? null,
    status: "active",
    provenance: "platform_assigned",
    effective_from: now,
    created_by: input.actorUserId,
    approved_by: input.actorUserId,
    is_correction: true,
    reason: `Handover from unit ${input.fromUnitId}`,
  });

  await client.rpc("gce_mbdp_refresh_venue_counts", {
    p_unit_id: input.fromUnitId,
  });
  await client.rpc("gce_mbdp_refresh_venue_counts", {
    p_unit_id: input.toUnitId,
  });

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_venue.handover",
    resourceType: "marketplace_venue_handover",
    resourceId: String(handover.id),
    after: handover,
    correlationId: input.correlationId,
  });
  return handover;
}

export { tokenHash };
