import { withAuthedRoute, jsonSuccess, jsonPrivateSuccess } from "@/lib/api/context";
import {
  getClaimDisplayCredential,
  getTicketDisplayCredential,
} from "@/lib/architecture/credentials";
import {
  actorHasCxPermission,
  assertMoneyFlagsOff,
  attachPaymentIntent,
  cancelBooking,
  checkInTicket,
  claimCustomerOffer,
  confirmBookingSandbox,
  createCustomerBooking,
  createSupportSignal,
  discoverEvents,
  discoverOffers,
  evaluateCancellationEligibility,
  getCustomerDashboard,
  getCustomerTrustRank,
  getEventDetail,
  getMyBookings,
  getMyClaims,
  getMyTickets,
  getOfferDetail,
  getVenuePerformanceRank,
  redeemOffer,
  confirmOfferVisit,
  requestRefund,
  submitFeedback,
  submitNonPurchaseReason,
  upsertCustomerPreferences,
} from "@/lib/architecture/customer-cx";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "dashboard";
  const admin = createPrivilegedSupabaseClient();

  if (view === "events") {
    const result = await discoverEvents(admin, {
      city: url.searchParams.get("city"),
      category: url.searchParams.get("category"),
      q: url.searchParams.get("q"),
      dateFrom: url.searchParams.get("dateFrom"),
      dateTo: url.searchParams.get("dateTo"),
      minPriceMinor: url.searchParams.get("minPrice")
        ? Number(url.searchParams.get("minPrice"))
        : null,
      maxPriceMinor: url.searchParams.get("maxPrice")
        ? Number(url.searchParams.get("maxPrice"))
        : null,
      limit: url.searchParams.get("limit")
        ? Number(url.searchParams.get("limit"))
        : 20,
      offset: url.searchParams.get("offset")
        ? Number(url.searchParams.get("offset"))
        : 0,
    });
    return jsonSuccess(result, ctx);
  }

  if (view === "event") {
    const id = url.searchParams.get("id");
    if (!id) {
      throw new AppError("VALIDATION_ERROR", "id required", { status: 400 });
    }
    const event = await getEventDetail(admin, id);
    return jsonSuccess({ event }, ctx);
  }

  if (view === "offers") {
    const result = await discoverOffers(admin, {
      city: url.searchParams.get("city"),
      q: url.searchParams.get("q"),
      limit: url.searchParams.get("limit")
        ? Number(url.searchParams.get("limit"))
        : 20,
      offset: url.searchParams.get("offset")
        ? Number(url.searchParams.get("offset"))
        : 0,
    });
    return jsonSuccess(result, ctx);
  }

  if (view === "offer") {
    const id = url.searchParams.get("id");
    if (!id) {
      throw new AppError("VALIDATION_ERROR", "id required", { status: 400 });
    }
    const offer = await getOfferDetail(admin, id);
    return jsonSuccess({ offer }, ctx);
  }

  if (view === "bookings") {
    const bookings = await getMyBookings(admin, ctx.user.id);
    return jsonSuccess({ bookings }, ctx);
  }

  if (view === "tickets") {
    const tickets = await getMyTickets(admin, ctx.user.id);
    return jsonSuccess({ tickets }, ctx);
  }

  if (view === "ticket_credential") {
    const id = url.searchParams.get("id");
    if (!id) {
      throw new AppError("VALIDATION_ERROR", "id required", { status: 400 });
    }
    const credential = await getTicketDisplayCredential(admin, {
      ticketId: id,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonPrivateSuccess({ credential }, ctx);
  }

  if (view === "claims") {
    const claims = await getMyClaims(admin, ctx.user.id);
    return jsonSuccess({ claims }, ctx);
  }

  if (view === "claim_credential") {
    const id = url.searchParams.get("id");
    if (!id) {
      throw new AppError("VALIDATION_ERROR", "id required", { status: 400 });
    }
    const credential = await getClaimDisplayCredential(admin, {
      claimId: id,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonPrivateSuccess({ credential }, ctx);
  }

  if (view === "trust_rank") {
    const rank = await getCustomerTrustRank(admin, ctx.user.id);
    return jsonSuccess({ rank }, ctx);
  }

  if (view === "venue_rank") {
    const venueId = url.searchParams.get("venueId");
    if (!venueId) {
      throw new AppError("VALIDATION_ERROR", "venueId required", {
        status: 400,
      });
    }
    const rank = await getVenuePerformanceRank(admin, venueId);
    return jsonSuccess({ rank }, ctx);
  }

  const dashboard = await getCustomerDashboard(admin, ctx.user.id);
  return jsonSuccess({ dashboard }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  const requirePerm = (
    perm: Parameters<typeof actorHasCxPermission>[1]
  ) => {
    if (!actorHasCxPermission(assignments, perm)) {
      throw new AppError("FORBIDDEN", `Missing permission ${perm}`, {
        status: 403,
      });
    }
  };

  switch (action) {
    case "create_booking": {
      requirePerm("cx.book");
      const parsed = z
        .object({
          action: z.literal("create_booking"),
          eventId: z.string().uuid(),
          quantity: z.number().int().positive().max(20),
          idempotencyKey: z.string().min(8).max(100).optional(),
          acceptPolicyVersion: z.string().max(100).optional(),
        })
        .parse(body);
      const booking = await createCustomerBooking(admin, {
        ...parsed,
        buyerUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ booking }, ctx, 201);
    }
    case "attach_payment": {
      requirePerm("cx.book");
      const parsed = z
        .object({
          action: z.literal("attach_payment"),
          bookingId: z.string().uuid(),
        })
        .parse(body);
      const result = await attachPaymentIntent(admin, {
        bookingId: parsed.bookingId,
        buyerUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "confirm_booking_sandbox": {
      requirePerm("cx.book");
      const parsed = z
        .object({
          action: z.literal("confirm_booking_sandbox"),
          bookingId: z.string().uuid(),
        })
        .parse(body);
      const result = await confirmBookingSandbox(admin, {
        bookingId: parsed.bookingId,
        buyerUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      // Return raw tokens once for QR display
      return jsonSuccess(
        {
          booking: result.booking,
          tickets: result.tickets,
          qrTokens: result.rawTokens,
          paymentMode: result.paymentMode,
        },
        ctx
      );
    }
    case "cancel_booking": {
      requirePerm("cx.cancel_own");
      const parsed = z
        .object({
          action: z.literal("cancel_booking"),
          bookingId: z.string().uuid(),
          reason: z.string().min(1).max(500),
        })
        .parse(body);
      const result = await cancelBooking(admin, {
        bookingId: parsed.bookingId,
        buyerUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "request_refund": {
      requirePerm("cx.refund_request");
      const parsed = z
        .object({
          action: z.literal("request_refund"),
          bookingId: z.string().uuid(),
          reason: z.string().min(1).max(500),
        })
        .parse(body);
      const refund = await requestRefund(admin, {
        bookingId: parsed.bookingId,
        requesterUserId: ctx.user.id,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ refund }, ctx, 201);
    }
    case "claim_offer": {
      requirePerm("cx.offer_claim");
      const parsed = z
        .object({
          action: z.literal("claim_offer"),
          offerEventId: z.string().uuid(),
        })
        .parse(body);
      const result = await claimCustomerOffer(admin, {
        offerEventId: parsed.offerEventId,
        claimantUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx, 201);
    }
    case "confirm_offer_visit": {
      requirePerm("cx.check_in.venue");
      const parsed = z
        .object({
          action: z.literal("confirm_offer_visit"),
          claimId: z.string().uuid(),
          presentedToken: z.string().min(8),
        })
        .parse(body);
      const result = await confirmOfferVisit(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "redeem_offer": {
      requirePerm("cx.redeem.venue");
      const parsed = z
        .object({
          action: z.literal("redeem_offer"),
          claimId: z.string().uuid(),
          presentedToken: z.string().min(8),
          saleConfirmed: z.boolean().optional(),
          saleReference: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const result = await redeemOffer(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "check_in_ticket": {
      requirePerm("cx.check_in.venue");
      const parsed = z
        .object({
          action: z.literal("check_in_ticket"),
          ticketId: z.string().uuid(),
          presentedToken: z.string().min(8),
        })
        .parse(body);
      const ticket = await checkInTicket(admin, {
        ticketId: parsed.ticketId,
        presentedToken: parsed.presentedToken,
        actorUserId: ctx.user.id,
      });
      return jsonSuccess({ ticket }, ctx);
    }
    case "non_purchase_reason": {
      requirePerm("cx.feedback");
      const parsed = z
        .object({
          action: z.literal("non_purchase_reason"),
          contextType: z.string().min(1).max(80),
          contextId: z.string().uuid().optional().nullable(),
          offerEventId: z.string().uuid().optional().nullable(),
          eventId: z.string().uuid().optional().nullable(),
          reasonCode: z.enum([
            "out_of_stock",
            "price_too_high",
            "quality_issue",
            "changed_mind",
            "timing",
            "other",
          ]),
          note: z.string().max(1000).optional().nullable(),
        })
        .parse(body);
      const row = await submitNonPurchaseReason(admin, {
        ...parsed,
        userId: ctx.user.id,
      });
      return jsonSuccess({ reason: row }, ctx, 201);
    }
    case "submit_feedback": {
      requirePerm("cx.feedback");
      const parsed = z
        .object({
          action: z.literal("submit_feedback"),
          subjectType: z.string().min(1).max(80),
          subjectId: z.string().uuid(),
          bookingId: z.string().uuid().optional().nullable(),
          claimId: z.string().uuid().optional().nullable(),
          rating: z.number().int().min(1).max(5).optional().nullable(),
          dimensions: z.record(z.string(), z.unknown()).optional(),
          freeText: z.string().max(2000).optional().nullable(),
        })
        .parse(body);
      const feedback = await submitFeedback(admin, {
        ...parsed,
        userId: ctx.user.id,
      });
      return jsonSuccess({ feedback }, ctx, 201);
    }
    case "save_preferences": {
      const parsed = z
        .object({
          action: z.literal("save_preferences"),
          preferredCity: z.string().max(120).optional().nullable(),
          preferredCategories: z.array(z.string()).max(20).optional(),
          locationLabel: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const preferences = await upsertCustomerPreferences(admin, {
        ...parsed,
        userId: ctx.user.id,
      });
      return jsonSuccess({ preferences }, ctx);
    }
    case "support_signal": {
      const parsed = z
        .object({
          action: z.literal("support_signal"),
          message: z.string().min(3).max(2000),
          bookingId: z.string().uuid().optional().nullable(),
          claimId: z.string().uuid().optional().nullable(),
          eventId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const signal = await createSupportSignal(admin, {
        ...parsed,
        userId: ctx.user.id,
      });
      return jsonSuccess({ signal }, ctx, 201);
    }
    case "evaluate_cancel": {
      const parsed = z
        .object({
          action: z.literal("evaluate_cancel"),
          eventStartsAt: z.string(),
          cancelCutoffHours: z.number().int().nonnegative(),
          bookingStatus: z.string(),
        })
        .parse(body);
      return jsonSuccess(
        {
          eligibility: evaluateCancellationEligibility(parsed),
        },
        ctx
      );
    }
    case "assert_money_flags": {
      const flags = await assertMoneyFlagsOff(admin);
      return jsonSuccess({ flags }, ctx);
    }
    default:
      throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
        status: 400,
      });
  }
});
