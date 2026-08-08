import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  acceptMbdpTerms,
  activateMarketplaceBdpUnit,
  activateVenueAttribution,
  approveMarketplaceEvent,
  approveMarketplaceVenue,
  approveOfferEvent,
  actorHasMarketplacePermission,
  buildMbdpDashboard,
  buildVenueDashboard,
  claimOffer,
  createBooking,
  createMarketplaceBdpApplication,
  createMarketplaceEvent,
  createMarketplaceVenue,
  createOfferEvent,
  createRevenueEntitlement,
  handoverVenueAttribution,
  issueTicketsForBooking,
  listMbdpUnitsForUser,
  proposeVenueAttribution,
  recordMbdpPackPayment,
  setVenueInactive,
  submitMarketplaceEvent,
  suspendMarketplaceBdpUnit,
} from "@/lib/architecture/marketplace";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const unitId = url.searchParams.get("unitId");
  const venueId = url.searchParams.get("venueId");
  const units = await listMbdpUnitsForUser(ctx.supabase, ctx.user.id);
  const admin = createPrivilegedSupabaseClient();

  let mbdpReport = null;
  if (unitId) {
    mbdpReport =
      (await buildMbdpDashboard(ctx.supabase, unitId)) ??
      (await buildMbdpDashboard(admin, unitId));
  }
  let venueReport = null;
  if (venueId) {
    venueReport =
      (await buildVenueDashboard(ctx.supabase, venueId)) ??
      (await buildVenueDashboard(admin, venueId));
  }
  return jsonSuccess({ units, mbdpReport, venueReport }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  switch (action) {
    case "apply": {
      const parsed = z
        .object({
          action: z.literal("apply"),
          packageOption: z
            .enum(["direct_50000", "finance_recovery_60000"])
            .optional(),
        })
        .parse(body);
      const unit = await createMarketplaceBdpApplication(ctx.supabase, {
        userId: ctx.user.id,
        packageOption: parsed.packageOption,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx, 201);
    }
    case "accept_terms": {
      const parsed = z
        .object({ action: z.literal("accept_terms"), unitId: z.string().uuid() })
        .parse(body);
      const unit = await acceptMbdpTerms(ctx.supabase, {
        unitId: parsed.unitId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx);
    }
    case "record_payment": {
      const parsed = z
        .object({
          action: z.literal("record_payment"),
          unitId: z.string().uuid(),
          paymentIntentId: z.string().uuid().optional().nullable(),
          offlinePaymentRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const unit = await recordMbdpPackPayment(admin, {
        unitId: parsed.unitId,
        paymentIntentId: parsed.paymentIntentId,
        offlinePaymentRef: parsed.offlinePaymentRef,
        offlineRecordedBy: parsed.offlinePaymentRef ? ctx.user.id : null,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx);
    }
    case "activate": {
      const parsed = z
        .object({
          action: z.literal("activate"),
          unitId: z.string().uuid(),
          secondUnitApproved: z.boolean().optional(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      if (
        !actorHasMarketplacePermission(
          assignments,
          "marketplace_bdp.unit.approve"
        )
      ) {
        assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      }
      const unit = await activateMarketplaceBdpUnit(admin, {
        unitId: parsed.unitId,
        actorUserId: ctx.user.id,
        actorAssignments: assignments,
        secondUnitApproved: parsed.secondUnitApproved,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx);
    }
    case "suspend": {
      const parsed = z
        .object({
          action: z.literal("suspend"),
          unitId: z.string().uuid(),
          reason: z.string().min(3).max(1000),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const unit = await suspendMarketplaceBdpUnit(admin, {
        unitId: parsed.unitId,
        actorUserId: ctx.user.id,
        actorAssignments: assignments,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx);
    }
    case "create_venue": {
      const parsed = z
        .object({
          action: z.literal("create_venue"),
          organisationId: z.string().uuid(),
          displayName: z.string().min(1).max(200),
          city: z.string().min(1).max(120),
          state: z.string().max(120).optional().nullable(),
          address: z.string().max(500).optional().nullable(),
          category: z.string().max(120).optional().nullable(),
          recommendUnitId: z.string().uuid().optional().nullable(),
          legacyVenueId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const venue = await createMarketplaceVenue(admin, {
        organisationId: parsed.organisationId,
        displayName: parsed.displayName,
        city: parsed.city,
        state: parsed.state,
        address: parsed.address,
        category: parsed.category,
        recommendUnitId: parsed.recommendUnitId,
        legacyVenueId: parsed.legacyVenueId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ venue }, ctx, 201);
    }
    case "approve_venue": {
      const parsed = z
        .object({
          action: z.literal("approve_venue"),
          venueId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const venue = await approveMarketplaceVenue(admin, {
        venueId: parsed.venueId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ venue }, ctx);
    }
    case "propose_attribution": {
      const parsed = z
        .object({
          action: z.literal("propose_attribution"),
          venueId: z.string().uuid(),
          unitId: z.string().uuid(),
          provenance: z.string().max(80).optional(),
          basis: z.string().max(500).optional(),
        })
        .parse(body);
      const attribution = await proposeVenueAttribution(admin, {
        venueId: parsed.venueId,
        unitId: parsed.unitId,
        bdpUserId: ctx.user.id,
        actorUserId: ctx.user.id,
        provenance: parsed.provenance,
        basis: parsed.basis,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ attribution }, ctx, 201);
    }
    case "activate_attribution": {
      const parsed = z
        .object({
          action: z.literal("activate_attribution"),
          attributionId: z.string().uuid(),
          reason: z.string().max(1000).optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const attribution = await activateVenueAttribution(admin, {
        attributionId: parsed.attributionId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ attribution }, ctx);
    }
    case "create_event": {
      const parsed = z
        .object({
          action: z.literal("create_event"),
          venueId: z.string().uuid(),
          title: z.string().min(1).max(200),
          startsAt: z.string(),
          endsAt: z.string().optional().nullable(),
          capacity: z.number().int().nonnegative(),
          priceMinor: z.number().int().nonnegative(),
          category: z.string().max(120).optional().nullable(),
          description: z.string().max(4000).optional().nullable(),
        })
        .parse(body);
      const event = await createMarketplaceEvent(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ event }, ctx, 201);
    }
    case "submit_event": {
      const parsed = z
        .object({
          action: z.literal("submit_event"),
          eventId: z.string().uuid(),
        })
        .parse(body);
      const event = await submitMarketplaceEvent(admin, {
        eventId: parsed.eventId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ event }, ctx);
    }
    case "approve_event": {
      const parsed = z
        .object({
          action: z.literal("approve_event"),
          eventId: z.string().uuid(),
          publish: z.boolean().optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const event = await approveMarketplaceEvent(admin, {
        eventId: parsed.eventId,
        actorUserId: ctx.user.id,
        publish: parsed.publish,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ event }, ctx);
    }
    case "create_offer": {
      const parsed = z
        .object({
          action: z.literal("create_offer"),
          venueId: z.string().uuid(),
          title: z.string().min(1).max(200),
          plannedCommercialValueMinor: z.number().int().positive(),
          campaignStartsAt: z.string(),
          campaignEndsAt: z.string(),
          customerCap: z.number().int().min(1).max(100).optional(),
          description: z.string().max(4000).optional().nullable(),
        })
        .parse(body);
      const offer = await createOfferEvent(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ offer }, ctx, 201);
    }
    case "approve_offer": {
      const parsed = z
        .object({
          action: z.literal("approve_offer"),
          offerId: z.string().uuid(),
          publish: z.boolean().optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const offer = await approveOfferEvent(admin, {
        offerId: parsed.offerId,
        actorUserId: ctx.user.id,
        publish: parsed.publish,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ offer }, ctx);
    }
    case "create_booking": {
      const parsed = z
        .object({
          action: z.literal("create_booking"),
          eventId: z.string().uuid(),
          quantity: z.number().int().positive().max(20),
          idempotencyKey: z.string().max(120).optional(),
        })
        .parse(body);
      const booking = await createBooking(admin, {
        eventId: parsed.eventId,
        buyerUserId: ctx.user.id,
        quantity: parsed.quantity,
        idempotencyKey: parsed.idempotencyKey,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ booking }, ctx, 201);
    }
    case "issue_tickets": {
      const parsed = z
        .object({
          action: z.literal("issue_tickets"),
          bookingId: z.string().uuid(),
        })
        .parse(body);
      // Sandbox ticket issue; production money still gated separately
      const result = await issueTicketsForBooking(admin, {
        bookingId: parsed.bookingId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "claim_offer": {
      const parsed = z
        .object({
          action: z.literal("claim_offer"),
          offerEventId: z.string().uuid(),
        })
        .parse(body);
      const result = await claimOffer(admin, {
        offerEventId: parsed.offerEventId,
        claimantUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx, 201);
    }
    case "record_entitlement": {
      const parsed = z
        .object({
          action: z.literal("record_entitlement"),
          earningEventKey: z.string().min(3).max(200),
          sourceType: z.string().min(1).max(80),
          sourceId: z.string().uuid().optional().nullable(),
          venueId: z.string().uuid(),
          attributionId: z.string().uuid().optional().nullable(),
          unitId: z.string().uuid().optional().nullable(),
          eligibleRevenueMinor: z.number().int().nonnegative(),
          hasValidAttribution: z.boolean(),
          state: z
            .enum(["estimated", "earned", "settlement_eligible"])
            .optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const entitlement = await createRevenueEntitlement(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ entitlement }, ctx, 201);
    }
    case "set_venue_inactive": {
      const parsed = z
        .object({
          action: z.literal("set_venue_inactive"),
          venueId: z.string().uuid(),
          reason: z.string().min(3).max(1000),
          temporary: z.boolean().optional(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const venue = await setVenueInactive(admin, {
        venueId: parsed.venueId,
        actorUserId: ctx.user.id,
        reason: parsed.reason,
        temporary: parsed.temporary,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ venue }, ctx);
    }
    case "handover": {
      const parsed = z
        .object({
          action: z.literal("handover"),
          venueId: z.string().uuid(),
          fromUnitId: z.string().uuid(),
          toUnitId: z.string().uuid(),
          notes: z.string().max(2000).optional().nullable(),
        })
        .parse(body);
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
      const handover = await handoverVenueAttribution(admin, {
        venueId: parsed.venueId,
        fromUnitId: parsed.fromUnitId,
        toUnitId: parsed.toUnitId,
        actorUserId: ctx.user.id,
        notes: parsed.notes,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ handover }, ctx);
    }
    default:
      throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
        status: 400,
      });
  }
});
