import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { createRevenueEntitlement } from "./operations";
import { MARKETPLACE_RULE_VERSION } from "./constants";

/** Paid/confirmed bookings may generate revenue; claims/views/drafts do not. */
export const MARKETPLACE_ELIGIBLE_BOOKING_STATUSES = [
  "paid",
  "confirmed",
] as const;

export type MarketplaceEligibleBookingStatus =
  (typeof MARKETPLACE_ELIGIBLE_BOOKING_STATUSES)[number];

export function marketplaceBookingEarningEventKey(bookingId: string): string {
  return `mkt:booking:${bookingId}`;
}

export function isEligibleMarketplaceBookingStatus(
  status: string
): status is MarketplaceEligibleBookingStatus {
  return (MARKETPLACE_ELIGIBLE_BOOKING_STATUSES as readonly string[]).includes(
    status
  );
}

/**
 * Resolve MBDP attribution from trusted backend records only.
 * Uses the booking/event attribution snapshot — never frontend input.
 * Inactive or missing attribution → unattributed (0% MBDP, not pending).
 */
export async function resolveMarketplaceAttribution(
  client: SupabaseClient,
  input: { venueId: string; snapshotAttributionId?: string | null }
): Promise<{
  hasValidAttribution: boolean;
  attributionId: string | null;
  unitId: string | null;
  bdpUserId: string | null;
  evidence: Record<string, unknown>;
}> {
  if (!input.snapshotAttributionId) {
    return {
      hasValidAttribution: false,
      attributionId: null,
      unitId: null,
      bdpUserId: null,
      evidence: { reason: "no_attribution_snapshot" },
    };
  }

  const { data: attr, error } = await client
    .from("marketplace_venue_attributions")
    .select("id, venue_id, unit_id, bdp_user_id, status, provenance, basis")
    .eq("id", input.snapshotAttributionId)
    .maybeSingle();

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to resolve attribution", {
      cause: error,
    });
  }

  if (
    !attr ||
    attr.status !== "active" ||
    String(attr.venue_id) !== input.venueId
  ) {
    return {
      hasValidAttribution: false,
      attributionId: input.snapshotAttributionId,
      unitId: null,
      bdpUserId: null,
      evidence: {
        reason: "attribution_not_active_for_venue",
        snapshotAttributionId: input.snapshotAttributionId,
        status: attr?.status ?? null,
      },
    };
  }

  return {
    hasValidAttribution: true,
    attributionId: String(attr.id),
    unitId: attr.unit_id ? String(attr.unit_id) : null,
    bdpUserId: attr.bdp_user_id ? String(attr.bdp_user_id) : null,
    evidence: {
      reason: "active_attribution_snapshot",
      attributionId: attr.id,
      provenance: attr.provenance,
      basis: attr.basis ?? null,
    },
  };
}

export async function allocateMarketplaceBookingRevenue(
  client: SupabaseClient,
  input: {
    bookingId: string;
    actorUserId: string;
    correlationId?: string;
  }
) {
  const { data: booking, error } = await client
    .from("marketplace_bookings")
    .select("*, marketplace_events(id, venue_id, title)")
    .eq("id", input.bookingId)
    .single();

  if (error || !booking) {
    throw new AppError("NOT_FOUND", "Booking not found", { status: 404 });
  }

  if (!isEligibleMarketplaceBookingStatus(String(booking.status))) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Booking is not eligible for revenue allocation",
      { status: 400, details: { status: booking.status } }
    );
  }

  const eligibleRevenueMinor = Number(booking.total_minor ?? 0);
  if (eligibleRevenueMinor <= 0) {
    throw new AppError(
      "VALIDATION_ERROR",
      "Eligible revenue must be positive",
      { status: 400 }
    );
  }

  const event = Array.isArray(booking.marketplace_events)
    ? booking.marketplace_events[0]
    : booking.marketplace_events;
  if (!event?.venue_id) {
    throw new AppError("NOT_FOUND", "Event venue missing for booking", {
      status: 404,
    });
  }

  const venueId = String(event.venue_id);
  const attribution = await resolveMarketplaceAttribution(client, {
    venueId,
    snapshotAttributionId: booking.attribution_id
      ? String(booking.attribution_id)
      : null,
  });

  const entitlement = await createRevenueEntitlement(client, {
    earningEventKey: marketplaceBookingEarningEventKey(input.bookingId),
    sourceType: "booking",
    sourceId: input.bookingId,
    venueId,
    attributionId: attribution.attributionId,
    unitId: attribution.unitId,
    eligibleRevenueMinor,
    hasValidAttribution: attribution.hasValidAttribution,
    actorUserId: input.actorUserId,
    state: "earned",
    correlationId: input.correlationId,
  });

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_allocation.booking",
    resourceType: "marketplace_revenue_entitlement",
    resourceId: String(entitlement.id),
    after: {
      bookingId: input.bookingId,
      venueId,
      eligibleRevenueMinor,
      hasValidAttribution: attribution.hasValidAttribution,
      ruleVersion: MARKETPLACE_RULE_VERSION,
      attributionEvidence: attribution.evidence,
    },
    correlationId: input.correlationId,
  });

  return { entitlement, attribution };
}

/**
 * Customer cancellation creates a refund *request* — not an approved refund.
 * Hold commercial entitlement pending Finance resolution; do not mark reversed
 * until an approved financial reversal exists (FD-039 / Phase 11).
 */
export async function holdMarketplaceBookingAllocationForRefundPending(
  client: SupabaseClient,
  input: {
    bookingId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  const key = marketplaceBookingEarningEventKey(input.bookingId);
  const { data: existing, error } = await client
    .from("marketplace_revenue_entitlements")
    .select("*")
    .eq("earning_event_key", key)
    .maybeSingle();

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load allocation", {
      cause: error,
    });
  }
  if (!existing || existing.state === "reversed" || existing.state === "on_hold") {
    return existing;
  }

  const metadata =
    typeof existing.metadata === "object" && existing.metadata
      ? (existing.metadata as Record<string, unknown>)
      : {};

  const { data: updated, error: upErr } = await client
    .from("marketplace_revenue_entitlements")
    .update({
      state: "on_hold",
      metadata: {
        ...metadata,
        refundPendingAt: new Date().toISOString(),
        refundPendingReason: input.reason,
        holdReason: "customer_refund_request_pending",
      },
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to hold allocation", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_allocation.refund_pending_hold",
    resourceType: "marketplace_revenue_entitlement",
    resourceId: String(updated.id),
    before: existing,
    after: updated,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return updated;
}

/**
 * Finance-approved reversal only. Preserves allocation history.
 * Does not invent refund percentages — caller supplies approved amount context.
 */
export async function reverseMarketplaceBookingAllocation(
  client: SupabaseClient,
  input: {
    bookingId: string;
    actorUserId: string;
    reason: string;
    correlationId?: string;
  }
) {
  const key = marketplaceBookingEarningEventKey(input.bookingId);
  const { data: existing, error } = await client
    .from("marketplace_revenue_entitlements")
    .select("*")
    .eq("earning_event_key", key)
    .maybeSingle();

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load allocation", {
      cause: error,
    });
  }
  if (!existing || existing.state === "reversed") {
    return existing;
  }

  const metadata =
    typeof existing.metadata === "object" && existing.metadata
      ? (existing.metadata as Record<string, unknown>)
      : {};

  const { data: updated, error: upErr } = await client
    .from("marketplace_revenue_entitlements")
    .update({
      state: "reversed",
      metadata: {
        ...metadata,
        reversedAt: new Date().toISOString(),
        reversalReason: input.reason,
      },
    })
    .eq("id", existing.id)
    .select("*")
    .single();

  if (upErr || !updated) {
    throw new AppError("INTERNAL_ERROR", "Failed to reverse allocation", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "marketplace_allocation.reversed",
    resourceType: "marketplace_revenue_entitlement",
    resourceId: String(updated.id),
    before: existing,
    after: updated,
    reason: input.reason,
    correlationId: input.correlationId,
  });

  return updated;
}
