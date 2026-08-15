import type { SupabaseClient } from "@supabase/supabase-js";
import { createHash, randomBytes } from "node:crypto";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { assertFeatureEnabled, isFeatureEnabled } from "../feature-flags/flags";
import {
  EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
  OFFER_CLAIM_VALIDITY_HOURS,
  claimExpiresAt,
} from "../marketplace/constants";
import { issueTicketsForBooking } from "../marketplace/operations";
import {
  CX_RULE_VERSION,
  DEFAULT_TRUST_SCORE,
  MONEY_FLAGS_MUST_STAY_OFF,
  type NonPurchaseReasonCode,
} from "./constants";

function tokenHash(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

const OPS_CHECKIN_ROLES = new Set([
  "platform_admin",
  "support_admin",
  "finance_admin",
]);

/**
 * Venue staff may only check in / redeem objects for venues in their
 * organisation memberships. Ops roles retain platform scope.
 * Does not use submitted_by as authority (that is an assistive listing fallback).
 */
async function assertVenueStaffScope(
  client: SupabaseClient,
  actorUserId: string,
  venueId: string
) {
  const { data: assignments } = await client
    .from("role_assignments")
    .select("role_key,status")
    .eq("user_id", actorUserId)
    .eq("status", "active");
  const roles = new Set((assignments ?? []).map((a) => String(a.role_key)));
  if ([...roles].some((r) => OPS_CHECKIN_ROLES.has(r))) {
    return;
  }

  const { data: mems } = await client
    .from("organisation_memberships")
    .select("organisation_id")
    .eq("user_id", actorUserId)
    .in("status", ["active"]);
  const orgIds = (mems ?? [])
    .map((m) => String(m.organisation_id ?? ""))
    .filter(Boolean);
  if (orgIds.length === 0) {
    throw new AppError("FORBIDDEN", "Venue scope required", { status: 403 });
  }

  const { data: venues } = await client
    .from("marketplace_venues")
    .select("id")
    .eq("id", venueId)
    .in("organisation_id", orgIds)
    .limit(1);
  if (!venues?.length) {
    throw new AppError("FORBIDDEN", "Outside this Venue's operating scope", {
      status: 403,
    });
  }
}

async function emitCxEvent(
  client: SupabaseClient,
  eventType: string,
  actorUserId: string | null,
  subjectType: string | null,
  subjectId: string | null,
  payload: Record<string, unknown> = {}
) {
  await client.from("customer_domain_events").insert({
    event_type: eventType,
    actor_user_id: actorUserId,
    subject_type: subjectType,
    subject_id: subjectId,
    payload: { ...payload, ruleVersion: CX_RULE_VERSION },
  });
}

export async function assertMoneyFlagsOff(client: SupabaseClient) {
  const status: Record<string, boolean> = {};
  for (const key of MONEY_FLAGS_MUST_STAY_OFF) {
    status[key] = await isFeatureEnabled(
      client,
      key as Parameters<typeof isFeatureEnabled>[1]
    );
    if (status[key]) {
      throw new AppError(
        "CONFIGURATION_ERROR",
        `Money/refund execution flag must remain OFF: ${key}`,
        { details: status }
      );
    }
  }
  return status;
}

export async function discoverEvents(
  client: SupabaseClient,
  input: {
    city?: string | null;
    category?: string | null;
    q?: string | null;
    dateFrom?: string | null;
    dateTo?: string | null;
    minPriceMinor?: number | null;
    maxPriceMinor?: number | null;
    limit?: number;
    offset?: number;
  } = {}
) {
  const limit = Math.min(input.limit ?? 20, 50);
  const offset = input.offset ?? 0;

  let query = client
    .from("marketplace_events")
    .select(
      "id,title,description,category,starts_at,ends_at,capacity,price_minor,currency,status,cancel_cutoff_hours,cancel_policy_version,published_at,venue_id,marketplace_venues!inner(id,display_name,city,status)",
      { count: "exact" }
    )
    .eq("status", "published")
    .eq("marketplace_venues.status", "active")
    .order("starts_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (input.city) {
    query = query.ilike("marketplace_venues.city", input.city);
  }
  if (input.category) {
    query = query.eq("category", input.category);
  }
  if (input.dateFrom) {
    query = query.gte("starts_at", input.dateFrom);
  }
  if (input.dateTo) {
    query = query.lte("starts_at", input.dateTo);
  }
  if (input.minPriceMinor != null) {
    query = query.gte("price_minor", input.minPriceMinor);
  }
  if (input.maxPriceMinor != null) {
    query = query.lte("price_minor", input.maxPriceMinor);
  }
  if (input.q) {
    query = query.ilike("title", `%${input.q}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new AppError("DATABASE_ERROR", "Event discovery failed", {
      cause: error,
    });
  }

  // Hide draft-like via status already; strip internal fields
  const items = (data ?? []).map((e) => ({
    id: e.id,
    title: e.title,
    description: e.description,
    category: e.category,
    startsAt: e.starts_at,
    endsAt: e.ends_at,
    capacity: e.capacity,
    priceMinor: e.price_minor,
    currency: e.currency,
    cancelCutoffHours: e.cancel_cutoff_hours,
    cancelPolicyVersion: e.cancel_policy_version,
    venue: Array.isArray(e.marketplace_venues)
      ? e.marketplace_venues[0]
      : e.marketplace_venues,
  }));

  return { items, total: count ?? items.length, limit, offset };
}

export async function getEventDetail(client: SupabaseClient, eventId: string) {
  const { data: event, error } = await client
    .from("marketplace_events")
    .select(
      "id,title,description,category,starts_at,ends_at,capacity,price_minor,currency,status,cancel_cutoff_hours,cancel_policy_version,published_at,venue_id,marketplace_venues(id,display_name,city,address,status)"
    )
    .eq("id", eventId)
    .maybeSingle();
  if (error || !event) {
    throw new AppError("NOT_FOUND", "Event not found", { status: 404 });
  }
  if (event.status !== "published" && event.status !== "closed") {
    throw new AppError("NOT_FOUND", "Event not available", { status: 404 });
  }

  const { data: soldRows } = await client
    .from("marketplace_bookings")
    .select("quantity,status")
    .eq("event_id", eventId)
    .in("status", ["pending_payment", "paid", "confirmed", "refund_pending"]);
  const sold = (soldRows ?? []).reduce(
    (n, r) => n + Number(r.quantity ?? 0),
    0
  );
  const remaining =
    event.capacity > 0 ? Math.max(0, Number(event.capacity) - sold) : null;

  return {
    ...event,
    venue: Array.isArray(event.marketplace_venues)
      ? event.marketplace_venues[0]
      : event.marketplace_venues,
    marketplace_venues: undefined,
    remainingCapacity: remaining,
    soldOut: remaining === 0,
    policySummary: {
      defaultCutoffHours: EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
      cutoffHours: event.cancel_cutoff_hours,
      policyVersion: event.cancel_policy_version,
      note: "Refund economics pending OD-006 / professional validation",
    },
  };
}

export async function discoverOffers(
  client: SupabaseClient,
  input: {
    city?: string | null;
    q?: string | null;
    limit?: number;
    offset?: number;
  } = {}
) {
  const limit = Math.min(input.limit ?? 20, 50);
  const offset = input.offset ?? 0;
  const now = new Date().toISOString();

  let query = client
    .from("marketplace_offer_events")
    .select(
      "id,title,description,campaign_starts_at,campaign_ends_at,customer_cap,claims_count,claim_validity_hours,status,venue_id,marketplace_venues!inner(id,display_name,city,status)",
      { count: "exact" }
    )
    .eq("status", "published")
    .eq("marketplace_venues.status", "active")
    .lte("campaign_starts_at", now)
    .gte("campaign_ends_at", now)
    .order("campaign_ends_at", { ascending: true })
    .range(offset, offset + limit - 1);

  if (input.city) {
    query = query.ilike("marketplace_venues.city", input.city);
  }
  if (input.q) {
    query = query.ilike("title", `%${input.q}%`);
  }

  const { data, error, count } = await query;
  if (error) {
    throw new AppError("DATABASE_ERROR", "Offer discovery failed", {
      cause: error,
    });
  }

  const items = (data ?? [])
    .filter((o) => Number(o.claims_count) < Number(o.customer_cap))
    .map((o) => ({
      id: o.id,
      title: o.title,
      description: o.description,
      campaignStartsAt: o.campaign_starts_at,
      campaignEndsAt: o.campaign_ends_at,
      customerCap: o.customer_cap,
      claimsCount: o.claims_count,
      remainingClaims: Number(o.customer_cap) - Number(o.claims_count),
      claimValidityHours: o.claim_validity_hours ?? OFFER_CLAIM_VALIDITY_HOURS,
      // never expose planned_commercial_value as customer GMV
      venue: Array.isArray(o.marketplace_venues)
        ? o.marketplace_venues[0]
        : o.marketplace_venues,
    }));

  return { items, total: count ?? items.length, limit, offset };
}

export async function getOfferDetail(client: SupabaseClient, offerId: string) {
  const { data: offer, error } = await client
    .from("marketplace_offer_events")
    .select(
      "id,title,description,campaign_starts_at,campaign_ends_at,customer_cap,claims_count,claim_validity_hours,status,venue_id,marketplace_venues(id,display_name,city,address,status)"
    )
    .eq("id", offerId)
    .maybeSingle();
  if (error || !offer) {
    throw new AppError("NOT_FOUND", "Offer not found", { status: 404 });
  }
  if (offer.status !== "published") {
    throw new AppError("NOT_FOUND", "Offer not available", { status: 404 });
  }
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description,
    campaignStartsAt: offer.campaign_starts_at,
    campaignEndsAt: offer.campaign_ends_at,
    customerCap: offer.customer_cap,
    claimsCount: offer.claims_count,
    remainingClaims: Math.max(
      0,
      Number(offer.customer_cap) - Number(offer.claims_count)
    ),
    claimValidityHours: offer.claim_validity_hours ?? OFFER_CLAIM_VALIDITY_HOURS,
    venue: Array.isArray(offer.marketplace_venues)
      ? offer.marketplace_venues[0]
      : offer.marketplace_venues,
    isRevenue: false,
  };
}

export async function createCustomerBooking(
  client: SupabaseClient,
  input: {
    eventId: string;
    buyerUserId: string;
    quantity: number;
    idempotencyKey?: string;
    acceptPolicyVersion?: string;
    correlationId?: string;
  }
) {
  await assertFeatureEnabled(client, "customer_booking");
  await assertMoneyFlagsOff(client);

  if (input.quantity < 1) {
    throw new AppError("VALIDATION_ERROR", "Quantity must be ≥ 1", {
      status: 400,
    });
  }

  const detail = await getEventDetail(client, input.eventId);
  if (
    input.acceptPolicyVersion &&
    input.acceptPolicyVersion !== detail.cancel_policy_version
  ) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Policy version mismatch — refresh booking",
      { status: 400 }
    );
  }

  const { data, error } = await client.rpc("gce_marketplace_create_booking", {
    p_event_id: input.eventId,
    p_buyer: input.buyerUserId,
    p_quantity: input.quantity,
    p_idempotency_key: input.idempotencyKey ?? null,
  });
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "Booking failed", {
      status: 409,
      cause: error,
    });
  }

  await emitCxEvent(
    client,
    "booking_created",
    input.buyerUserId,
    "marketplace_booking",
    String(data.id),
    { quantity: input.quantity, eventId: input.eventId }
  );
  await writeAuditEvent(client, {
    actorUserId: input.buyerUserId,
    action: "cx.booking.create",
    resourceType: "marketplace_booking",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

/** Create payment_intent boundary (capture remains gated OFF). */
export async function attachPaymentIntent(
  client: SupabaseClient,
  input: {
    bookingId: string;
    buyerUserId: string;
    correlationId?: string;
  }
) {
  await assertMoneyFlagsOff(client);
  const { data: booking } = await client
    .from("marketplace_bookings")
    .select("*")
    .eq("id", input.bookingId)
    .maybeSingle();
  if (!booking || booking.buyer_user_id !== input.buyerUserId) {
    throw new AppError("FORBIDDEN", "Booking not accessible", { status: 403 });
  }
  if (booking.payment_intent_id) {
    const { data: existing } = await client
      .from("payment_intents")
      .select("*")
      .eq("id", booking.payment_intent_id)
      .maybeSingle();
    return { booking, paymentIntent: existing };
  }

  const { data: intent, error } = await client
    .from("payment_intents")
    .insert({
      provider: "razorpay_candidate",
      amount_minor: booking.total_minor,
      currency: booking.currency ?? "INR",
      payer_user_id: input.buyerUserId,
      status: "created",
      business_purpose: "marketplace_event_ticket",
      metadata: {
        bookingId: booking.id,
        eventId: booking.event_id,
        marketplaceTicketPayments: false,
        morIntended: "Logixia Solutions Private Limited",
      },
    })
    .select("*")
    .single();
  if (error || !intent) {
    throw new AppError("INTERNAL_ERROR", "Failed to create payment intent", {
      cause: error,
    });
  }

  const { data: updated } = await client
    .from("marketplace_bookings")
    .update({ payment_intent_id: intent.id })
    .eq("id", booking.id)
    .select("*")
    .single();

  await emitCxEvent(
    client,
    "payment_state_change",
    input.buyerUserId,
    "payment_intent",
    String(intent.id),
    { status: intent.status, bookingId: booking.id }
  );

  return { booking: updated ?? booking, paymentIntent: intent };
}

/**
 * Sandbox/test confirmation when live ticket payments are OFF.
 * Issues tickets idempotently via Phase 7 issuer.
 */
export async function confirmBookingSandbox(
  client: SupabaseClient,
  input: {
    bookingId: string;
    buyerUserId: string;
    correlationId?: string;
  }
) {
  await assertMoneyFlagsOff(client);
  const live = await isFeatureEnabled(client, "marketplace_ticket_payments");
  if (live) {
    throw new AppError(
      "FEATURE_DISABLED",
      "Use live payment confirmation path when marketplace_ticket_payments is ON",
      { status: 403 }
    );
  }

  const attached = await attachPaymentIntent(client, input);
  if (attached.paymentIntent) {
    await client
      .from("payment_intents")
      .update({ status: "succeeded" })
      .eq("id", attached.paymentIntent.id)
      .in("status", ["created", "requires_action", "processing"]);
  }

  await client
    .from("marketplace_bookings")
    .update({ status: "paid" })
    .eq("id", input.bookingId)
    .eq("buyer_user_id", input.buyerUserId)
    .in("status", ["pending_payment", "paid"]);

  const issued = await issueTicketsForBooking(client, {
    bookingId: input.bookingId,
    actorUserId: input.buyerUserId,
    correlationId: input.correlationId,
  });

  await emitCxEvent(
    client,
    "booking_confirmed",
    input.buyerUserId,
    "marketplace_booking",
    input.bookingId,
    { ticketCount: issued.tickets.length, sandbox: true }
  );
  await emitCxEvent(
    client,
    "ticket_issued",
    input.buyerUserId,
    "marketplace_booking",
    input.bookingId,
    { count: issued.tickets.length }
  );

  // Rank foundation event with delta 0 — formula unresolved
  await postCustomerRankEvent(client, {
    userId: input.buyerUserId,
    eventType: "booking_confirmed",
    delta: 0,
    sourceType: "marketplace_booking",
    sourceId: input.bookingId,
    actorUserId: input.buyerUserId,
  });

  return {
    ...issued,
    // return one-time tokens only on fresh issue
    paymentMode: "sandbox_flag_off",
  };
}

export function evaluateCancellationEligibility(input: {
  eventStartsAt: string;
  cancelCutoffHours: number;
  bookingStatus: string;
  now?: Date;
}): {
  eligible: boolean;
  reason: string;
  cutoffAt: string;
} {
  const now = input.now ?? new Date();
  const starts = new Date(input.eventStartsAt);
  const cutoffAt = new Date(
    starts.getTime() - input.cancelCutoffHours * 60 * 60 * 1000
  );
  if (
    !["confirmed", "paid", "pending_payment"].includes(input.bookingStatus)
  ) {
    return {
      eligible: false,
      reason: "booking_not_cancellable_state",
      cutoffAt: cutoffAt.toISOString(),
    };
  }
  if (now.getTime() > cutoffAt.getTime()) {
    return {
      eligible: false,
      reason: "after_cutoff",
      cutoffAt: cutoffAt.toISOString(),
    };
  }
  return {
    eligible: true,
    reason: "within_cutoff",
    cutoffAt: cutoffAt.toISOString(),
  };
}

export async function cancelBooking(
  client: SupabaseClient,
  input: {
    bookingId: string;
    buyerUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  const { data: booking } = await client
    .from("marketplace_bookings")
    .select("*, marketplace_events(starts_at,cancel_cutoff_hours,cancel_policy_version)")
    .eq("id", input.bookingId)
    .maybeSingle();
  if (!booking || booking.buyer_user_id !== input.buyerUserId) {
    throw new AppError("FORBIDDEN", "Booking not accessible", { status: 403 });
  }

  const event = Array.isArray(booking.marketplace_events)
    ? booking.marketplace_events[0]
    : booking.marketplace_events;
  if (!event) {
    throw new AppError("NOT_FOUND", "Event missing for booking", {
      status: 404,
    });
  }

  const eligibility = evaluateCancellationEligibility({
    eventStartsAt: event.starts_at,
    cancelCutoffHours:
      booking.cancel_cutoff_hours ??
      event.cancel_cutoff_hours ??
      EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
    bookingStatus: booking.status,
  });

  if (!eligibility.eligible) {
    throw new AppError(
      "FORBIDDEN",
      `Cancellation not allowed: ${eligibility.reason}`,
      { status: 403, details: eligibility }
    );
  }

  const { data: updated, error } = await client
    .from("marketplace_bookings")
    .update({
      status: "refund_pending",
      metadata: {
        ...(typeof booking.metadata === "object" && booking.metadata
          ? booking.metadata
          : {}),
        cancelReason: input.reason,
        cancelledAt: new Date().toISOString(),
      },
    })
    .eq("id", input.bookingId)
    .eq("buyer_user_id", input.buyerUserId)
    .select("*")
    .single();
  if (error || !updated) {
    throw new AppError("CONFLICT", "Cancel race", { status: 409, cause: error });
  }

  await client
    .from("marketplace_tickets")
    .update({ status: "cancelled" })
    .eq("booking_id", input.bookingId)
    .eq("status", "issued");

  await emitCxEvent(
    client,
    "cancellation_request",
    input.buyerUserId,
    "marketplace_booking",
    input.bookingId,
    eligibility
  );

  // Always create refund request boundary (economics unresolved)
  const refund = await requestRefund(client, {
    bookingId: input.bookingId,
    requesterUserId: input.buyerUserId,
    reason: input.reason,
    eligibleUnderCutoff: true,
    correlationId: input.correlationId,
  });

  return { booking: updated, eligibility, refund };
}

export async function requestRefund(
  client: SupabaseClient,
  input: {
    bookingId: string;
    requesterUserId: string;
    reason: string;
    eligibleUnderCutoff?: boolean;
    correlationId?: string;
  }
) {
  await assertMoneyFlagsOff(client);

  const { data: booking } = await client
    .from("marketplace_bookings")
    .select("*")
    .eq("id", input.bookingId)
    .maybeSingle();
  if (!booking || booking.buyer_user_id !== input.requesterUserId) {
    throw new AppError("FORBIDDEN", "Booking not accessible", { status: 403 });
  }

  const { data: existing } = await client
    .from("customer_refund_requests")
    .select("*")
    .eq("booking_id", input.bookingId)
    .in("status", ["requested", "under_review"])
    .maybeSingle();
  if (existing) return existing;

  const { data, error } = await client
    .from("customer_refund_requests")
    .insert({
      booking_id: input.bookingId,
      requester_user_id: input.requesterUserId,
      reason: input.reason,
      status: "requested",
      policy_version: booking.cancel_policy_version,
      cutoff_hours: booking.cancel_cutoff_hours,
      eligible_under_cutoff: input.eligibleUnderCutoff ?? false,
      requested_amount_minor: null,
      amount_determination: "manual_review_required",
      metadata: {
        od006: true,
        note: "Refund % / fee treatment unresolved — Finance review",
      },
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("CONFLICT", "Refund request failed", {
      status: 409,
      cause: error,
    });
  }

  await emitCxEvent(
    client,
    "refund_request",
    input.requesterUserId,
    "customer_refund_request",
    String(data.id),
    { bookingId: input.bookingId }
  );
  await writeAuditEvent(client, {
    actorUserId: input.requesterUserId,
    action: "cx.refund.request",
    resourceType: "customer_refund_request",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return data;
}

export async function claimCustomerOffer(
  client: SupabaseClient,
  input: {
    offerEventId: string;
    claimantUserId: string;
    correlationId?: string;
  }
) {
  await assertFeatureEnabled(client, "offer_claims");
  await getOfferDetail(client, input.offerEventId);

  const raw = randomBytes(24).toString("base64url");
  const expires = claimExpiresAt(new Date());
  const { data, error } = await client.rpc("gce_marketplace_claim_offer", {
    p_offer_id: input.offerEventId,
    p_claimant: input.claimantUserId,
    p_token_hash: tokenHash(raw),
    p_expires_at: expires.toISOString(),
  });
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "Claim failed", {
      status: 409,
      cause: error,
    });
  }

  await emitCxEvent(
    client,
    "offer_claimed",
    input.claimantUserId,
    "marketplace_offer_claim",
    String(data.id),
    { isRevenue: false, expiresAt: expires.toISOString() }
  );
  await writeAuditEvent(client, {
    actorUserId: input.claimantUserId,
    action: "cx.offer.claim",
    resourceType: "marketplace_offer_claim",
    resourceId: String(data.id),
    after: { ...data, note: "claim_is_not_revenue" },
    correlationId: input.correlationId,
  });

  // Never recognise revenue on claim
  const { count } = await client
    .from("revenue_components")
    .select("id", { count: "exact", head: true })
    .eq("domain_object_type", "offer_claim")
    .eq("domain_object_id", data.id);
  if ((count ?? 0) > 0) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Invariant violation: claim created revenue",
      { status: 500 }
    );
  }

  await postCustomerRankEvent(client, {
    userId: input.claimantUserId,
    eventType: "offer_claimed",
    delta: 0,
    sourceType: "marketplace_offer_claim",
    sourceId: String(data.id),
    actorUserId: input.claimantUserId,
  });

  return { claim: data, rawClaimToken: raw, isRevenue: false as const };
}

export async function redeemOffer(
  client: SupabaseClient,
  input: {
    claimId: string;
    presentedToken: string;
    actorUserId: string;
    saleConfirmed?: boolean;
    saleReference?: string | null;
    correlationId?: string;
  }
) {
  const { data: claimRow } = await client
    .from("marketplace_offer_claims")
    .select("id,offer_event_id,marketplace_offer_events(venue_id)")
    .eq("id", input.claimId)
    .maybeSingle();
  const offer = Array.isArray(claimRow?.marketplace_offer_events)
    ? claimRow?.marketplace_offer_events[0]
    : claimRow?.marketplace_offer_events;
  const venueId = (offer as { venue_id?: string } | null)?.venue_id;
  if (!venueId) {
    throw new AppError("NOT_FOUND", "Claim not found", { status: 404 });
  }
  await assertVenueStaffScope(client, input.actorUserId, venueId);

  const hash = tokenHash(input.presentedToken);
  const { data, error } = await client.rpc("gce_marketplace_redeem_claim", {
    p_claim_id: input.claimId,
    p_redemption_token_hash: hash,
    p_actor: input.actorUserId,
    p_sale_confirmed: input.saleConfirmed ?? false,
    p_sale_reference: input.saleReference ?? null,
  });
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "Redemption failed", {
      status: 409,
      cause: error,
    });
  }

  await emitCxEvent(
    client,
    "redemption",
    input.actorUserId,
    "marketplace_redemption",
    String(data.id),
    {
      claimId: input.claimId,
      saleConfirmed: input.saleConfirmed ?? false,
      autoRevenue: false,
    }
  );

  return { redemption: data, createsRevenue: false as const };
}

export async function checkInTicket(
  client: SupabaseClient,
  input: {
    ticketId: string;
    presentedToken: string;
    actorUserId: string;
  }
) {
  const { data: ticketRow } = await client
    .from("marketplace_tickets")
    .select("id,event_id,marketplace_events(venue_id)")
    .eq("id", input.ticketId)
    .maybeSingle();
  const event = Array.isArray(ticketRow?.marketplace_events)
    ? ticketRow?.marketplace_events[0]
    : ticketRow?.marketplace_events;
  const venueId = (event as { venue_id?: string } | null)?.venue_id;
  if (!venueId) {
    throw new AppError("NOT_FOUND", "Ticket not found", { status: 404 });
  }
  await assertVenueStaffScope(client, input.actorUserId, venueId);

  const { data, error } = await client.rpc("gce_marketplace_ticket_check_in", {
    p_ticket_id: input.ticketId,
    p_presented_token_hash: tokenHash(input.presentedToken),
    p_actor: input.actorUserId,
  });
  if (error || !data) {
    throw new AppError("CONFLICT", error?.message || "Check-in failed", {
      status: 409,
      cause: error,
    });
  }
  await emitCxEvent(
    client,
    "ticket_checked_in",
    input.actorUserId,
    "marketplace_ticket",
    input.ticketId,
    {}
  );
  return data;
}

export async function submitNonPurchaseReason(
  client: SupabaseClient,
  input: {
    userId: string;
    contextType: string;
    contextId?: string | null;
    offerEventId?: string | null;
    eventId?: string | null;
    reasonCode: NonPurchaseReasonCode;
    note?: string | null;
  }
) {
  const { data, error } = await client
    .from("customer_non_purchase_reasons")
    .insert({
      user_id: input.userId,
      context_type: input.contextType,
      context_id: input.contextId ?? null,
      offer_event_id: input.offerEventId ?? null,
      event_id: input.eventId ?? null,
      reason_code: input.reasonCode,
      note: input.note ?? null,
      penalty_exempt: true,
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to record reason", {
      cause: error,
    });
  }
  await emitCxEvent(
    client,
    "non_purchase_reason",
    input.userId,
    "customer_non_purchase_reason",
    String(data.id),
    { reasonCode: input.reasonCode, penaltyExempt: true }
  );
  return data;
}

export async function submitFeedback(
  client: SupabaseClient,
  input: {
    userId: string;
    subjectType: string;
    subjectId: string;
    bookingId?: string | null;
    claimId?: string | null;
    rating?: number | null;
    dimensions?: Record<string, unknown>;
    freeText?: string | null;
  }
) {
  const { data, error } = await client
    .from("customer_feedback")
    .upsert(
      {
        user_id: input.userId,
        subject_type: input.subjectType,
        subject_id: input.subjectId,
        booking_id: input.bookingId ?? null,
        claim_id: input.claimId ?? null,
        rating: input.rating ?? null,
        dimensions: input.dimensions ?? {},
        free_text: input.freeText ?? null,
      },
      { onConflict: "user_id,subject_type,subject_id" }
    )
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to submit feedback", {
      cause: error,
    });
  }
  await emitCxEvent(
    client,
    "feedback_submitted",
    input.userId,
    "customer_feedback",
    String(data.id),
    { subjectType: input.subjectType }
  );
  return data;
}

export async function postCustomerRankEvent(
  client: SupabaseClient,
  input: {
    userId: string;
    eventType: string;
    delta: number;
    sourceType?: string | null;
    sourceId?: string | null;
    actorUserId?: string | null;
  }
) {
  // Formula unresolved: store event; keep default score unless delta explicitly approved later
  const { data: snap } = await client
    .from("customer_trust_rank_snapshots")
    .select("*")
    .eq("user_id", input.userId)
    .maybeSingle();

  const current = snap?.score ?? DEFAULT_TRUST_SCORE;
  // Do not invent weights — delta 0 keeps foundation; non-zero only when future FD activates
  const next = Math.max(0, Math.min(100, current + input.delta));

  const { error } = await client.from("customer_trust_rank_events").insert({
    user_id: input.userId,
    event_type: input.eventType,
    delta: input.delta,
    resulting_score: next,
    source_type: input.sourceType ?? null,
    source_id: input.sourceId ?? null,
    actor_user_id: input.actorUserId ?? null,
    rule_version: "phase11-display-foundation-v1",
    metadata: { formulaStatus: "unresolved" },
  });
  if (error) {
    if (error.code === "23505") return snap; // duplicate source — idempotent
    throw new AppError("INTERNAL_ERROR", "Failed to post rank event", {
      cause: error,
    });
  }

  await client.from("customer_trust_rank_snapshots").upsert({
    user_id: input.userId,
    score: next,
    level_label: "unresolved",
    event_count: (snap?.event_count ?? 0) + 1,
    formula_status: "unresolved",
    updated_at: new Date().toISOString(),
  });

  await emitCxEvent(
    client,
    "customer_rank_event",
    input.actorUserId ?? input.userId,
    "customer_trust_rank",
    input.userId,
    { eventType: input.eventType, delta: input.delta, formulaStatus: "unresolved" }
  );

  return { score: next, levelLabel: "unresolved", formulaStatus: "unresolved" };
}

export async function getCustomerTrustRank(
  client: SupabaseClient,
  userId: string
) {
  const displayOn = await isFeatureEnabled(client, "customer_rank_display");
  const { data: snap } = await client
    .from("customer_trust_rank_snapshots")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  return {
    enabled: displayOn,
    score: snap?.score ?? DEFAULT_TRUST_SCORE,
    levelLabel: snap?.level_label ?? "unresolved",
    formulaStatus: "unresolved",
    note: "Exact Trust Rank formula is Unresolved — display foundation only (FD / Phase 11 plan)",
  };
}

export async function getVenuePerformanceRank(
  client: SupabaseClient,
  venueId: string
) {
  const publicOn = await isFeatureEnabled(client, "venue_rank_display");
  const { data: snap } = await client
    .from("venue_performance_rank_snapshots")
    .select("*")
    .eq("venue_id", venueId)
    .maybeSingle();
  return {
    venueId,
    publicDisplay: publicOn && (snap?.public_display_allowed ?? false),
    score: snap?.score ?? null,
    formulaStatus: "unresolved",
    eventCount: snap?.event_count ?? 0,
    note: "Venue Performance Rank weights unresolved — event foundation only",
  };
}

export async function getMyBookings(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("marketplace_bookings")
    .select(
      "*, marketplace_events(id,title,starts_at,cancel_cutoff_hours,cancel_policy_version)"
    )
    .eq("buyer_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to list bookings", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function getMyTickets(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("marketplace_tickets")
    .select(
      "id,ticket_ref,status,issued_at,checked_in_at,event_id,booking_id,marketplace_events(id,title,starts_at)"
    )
    .eq("holder_user_id", userId)
    .order("issued_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to list tickets", {
      cause: error,
    });
  }
  // Never return qr_token_hash
  return data ?? [];
}

export async function getMyClaims(client: SupabaseClient, userId: string) {
  const { data, error } = await client
    .from("marketplace_offer_claims")
    .select(
      "id,status,claimed_at,expires_at,offer_event_id,marketplace_offer_events(id,title)"
    )
    .eq("claimant_user_id", userId)
    .order("claimed_at", { ascending: false })
    .limit(50);
  if (error) {
    throw new AppError("DATABASE_ERROR", "Failed to list claims", {
      cause: error,
    });
  }
  return (data ?? []).map((c) => ({
    ...c,
    isRevenue: false,
    expired:
      c.status === "expired" ||
      (c.expires_at ? new Date(c.expires_at).getTime() < Date.now() : false),
  }));
}

export async function getCustomerDashboard(
  client: SupabaseClient,
  userId: string
) {
  const [bookings, tickets, claims, trust, prefs] = await Promise.all([
    getMyBookings(client, userId),
    getMyTickets(client, userId),
    getMyClaims(client, userId),
    getCustomerTrustRank(client, userId),
    client
      .from("customer_cx_preferences")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle()
      .then((r) => r.data),
  ]);

  const { data: refunds } = await client
    .from("customer_refund_requests")
    .select("*")
    .eq("requester_user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);

  const now = Date.now();
  const upcoming = bookings.filter((b) => {
    const ev = Array.isArray(b.marketplace_events)
      ? b.marketplace_events[0]
      : b.marketplace_events;
    return (
      ["confirmed", "paid", "pending_payment"].includes(b.status) &&
      ev?.starts_at &&
      new Date(ev.starts_at).getTime() >= now
    );
  });

  const activeClaims = claims.filter(
    (c) => c.status === "claimed" && !c.expired
  );
  const expiringClaims = activeClaims.filter((c) => {
    if (!c.expires_at) return false;
    const ms = new Date(c.expires_at).getTime() - now;
    return ms > 0 && ms < 12 * 60 * 60 * 1000;
  });

  return {
    upcomingBookings: upcoming.slice(0, 10),
    tickets: tickets.slice(0, 20),
    activeClaims: activeClaims.slice(0, 10),
    expiringClaims,
    refundRequests: refunds ?? [],
    trustRank: trust,
    preferences: prefs,
    leadAssistHint: "/dashboard/connect-member",
    moneyFlags: await assertMoneyFlagsOff(client),
  };
}

export async function upsertCustomerPreferences(
  client: SupabaseClient,
  input: {
    userId: string;
    preferredCity?: string | null;
    preferredCategories?: string[];
    locationLabel?: string | null;
  }
) {
  const { data, error } = await client
    .from("customer_cx_preferences")
    .upsert({
      user_id: input.userId,
      preferred_city: input.preferredCity ?? null,
      preferred_categories: input.preferredCategories ?? [],
      location_label: input.locationLabel ?? null,
      updated_at: new Date().toISOString(),
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to save preferences", {
      cause: error,
    });
  }
  return data;
}

export async function createSupportSignal(
  client: SupabaseClient,
  input: {
    userId: string;
    message: string;
    bookingId?: string | null;
    claimId?: string | null;
    eventId?: string | null;
  }
) {
  const { data, error } = await client
    .from("customer_support_signals")
    .insert({
      user_id: input.userId,
      message: input.message,
      booking_id: input.bookingId ?? null,
      claim_id: input.claimId ?? null,
      event_id: input.eventId ?? null,
      status: "queued_for_phase13",
    })
    .select("*")
    .single();
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to queue support signal", {
      cause: error,
    });
  }
  return data;
}
