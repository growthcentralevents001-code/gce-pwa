import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  actorHasFinancePermission,
  applyRecoveryToEntitlement,
  approveEntitlement,
  approveSettlementBatch,
  attemptSettlementExecution,
  buildFinanceDashboard,
  createFinancialCorrection,
  createReconciliationRecord,
  generateSettlementBatch,
  markSettlementEligible,
  openChargebackCase,
  placeFinancialHold,
  postConnectCommission,
  postEnterpriseCommission,
  postMarketplaceCommission,
  recogniseRevenueComponent,
  recordOfflinePayment,
  releaseFinancialHold,
  reverseEntitlement,
  verifyOfflinePayment,
} from "@/lib/architecture/finance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (_request, ctx) => {
  const admin = createPrivilegedSupabaseClient();
  if (
    !actorHasFinancePermission(
      ctx.entitlements.activeAssignments,
      "finance.report.read"
    )
  ) {
    throw new AppError("FORBIDDEN", "Finance report access required", {
      status: 403,
    });
  }
  const report =
    (await buildFinanceDashboard(ctx.supabase)) ??
    (await buildFinanceDashboard(admin));
  return jsonSuccess({ report }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  const requirePerm = (
    perm: Parameters<typeof actorHasFinancePermission>[1]
  ) => {
    if (!actorHasFinancePermission(assignments, perm)) {
      throw new AppError("FORBIDDEN", `Missing permission ${perm}`, {
        status: 403,
      });
    }
  };

  switch (action) {
    case "recognise_revenue": {
      requirePerm("finance.revenue.write");
      const parsed = z
        .object({
          action: z.literal("recognise_revenue"),
          revenueComponentKey: z.string().min(1).max(200),
          vertical: z.enum([
            "connect",
            "marketplace",
            "enterprise",
            "platform",
            "other",
          ]),
          domainObjectType: z.string().min(1).max(100),
          domainObjectId: z.string().uuid().optional().nullable(),
          grossAmountMinor: z.number().int().nonnegative(),
          excludedAmountMinor: z.number().int().nonnegative().optional(),
          taxAmountMinor: z.number().int().nonnegative().optional(),
          eligibleBaseMinor: z.number().int().nonnegative(),
          paymentIntentId: z.string().uuid().optional().nullable(),
          markRecognised: z.boolean().optional(),
        })
        .parse(body);
      const component = await recogniseRevenueComponent(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ component }, ctx, 201);
    }
    case "post_connect_commission": {
      requirePerm("finance.revenue.write");
      const parsed = z
        .object({
          action: z.literal("post_connect_commission"),
          revenueComponentKey: z.string().min(1).max(200),
          eligibleAttributedSubscriptionMinor: z.number().int().nonnegative(),
          hasValidAttribution: z.boolean(),
          stakeholderUserId: z.string().uuid().optional().nullable(),
          attributionRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const entitlement = await postConnectCommission(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ entitlement }, ctx, 201);
    }
    case "post_marketplace_commission": {
      requirePerm("finance.revenue.write");
      const parsed = z
        .object({
          action: z.literal("post_marketplace_commission"),
          revenueComponentKey: z.string().min(1).max(200),
          eligibleEventRevenueMinor: z.number().int().nonnegative(),
          hasValidMbdpAttribution: z.boolean(),
          venueOrgId: z.string().uuid().optional().nullable(),
          mbdpUserId: z.string().uuid().optional().nullable(),
          attributionRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const result = await postMarketplaceCommission(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx, 201);
    }
    case "post_enterprise_commission": {
      requirePerm("finance.revenue.write");
      const parsed = z
        .object({
          action: z.literal("post_enterprise_commission"),
          revenueComponentKey: z.string().min(1).max(200),
          eligibleEventRevenueMinor: z.number().int().nonnegative(),
          hasValidAttribution: z.boolean(),
          ebdpUserId: z.string().uuid().optional().nullable(),
          attributionRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const result = await postEnterpriseCommission(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx, 201);
    }
    case "apply_recovery": {
      requirePerm("finance.entitlement.review");
      assertPermission(ctx, "finance");
      const parsed = z
        .object({
          action: z.literal("apply_recovery"),
          entitlementId: z.string().uuid(),
          cycleKey: z.string().min(1).max(100),
          remainingRecoverableMinor: z.number().int().nonnegative(),
          packOrUnitRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const result = await applyRecoveryToEntitlement(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "place_hold": {
      requirePerm("finance.hold.manage");
      const parsed = z
        .object({
          action: z.literal("place_hold"),
          scopeType: z.string().min(1).max(50),
          scopeId: z.string().uuid(),
          reason: z.string().min(1).max(1000),
          amountMinor: z.number().int().nonnegative().optional().nullable(),
        })
        .parse(body);
      const hold = await placeFinancialHold(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ hold }, ctx, 201);
    }
    case "release_hold": {
      requirePerm("finance.hold.manage");
      const parsed = z
        .object({
          action: z.literal("release_hold"),
          holdId: z.string().uuid(),
          restoreStatus: z.string().max(50).optional(),
        })
        .parse(body);
      const hold = await releaseFinancialHold(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ hold }, ctx);
    }
    case "reverse_entitlement": {
      requirePerm("finance.entitlement.review");
      assertPermission(ctx, "finance");
      const parsed = z
        .object({
          action: z.literal("reverse_entitlement"),
          entitlementId: z.string().uuid(),
          amountMinor: z.number().int().positive(),
          reason: z.string().min(1).max(1000),
          refundRef: z.string().max(200).optional().nullable(),
          chargebackRef: z.string().max(200).optional().nullable(),
        })
        .parse(body);
      const result = await reverseEntitlement(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess(result, ctx);
    }
    case "mark_settlement_eligible": {
      requirePerm("finance.entitlement.review");
      const parsed = z
        .object({
          action: z.literal("mark_settlement_eligible"),
          entitlementId: z.string().uuid(),
        })
        .parse(body);
      const entitlement = await markSettlementEligible(admin, {
        entitlementId: parsed.entitlementId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ entitlement }, ctx);
    }
    case "approve_entitlement": {
      requirePerm("finance.entitlement.approve");
      const parsed = z
        .object({
          action: z.literal("approve_entitlement"),
          entitlementId: z.string().uuid(),
        })
        .parse(body);
      const entitlement = await approveEntitlement(admin, {
        entitlementId: parsed.entitlementId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ entitlement }, ctx);
    }
    case "generate_settlement_batch": {
      requirePerm("finance.settlement.manage");
      const parsed = z
        .object({
          action: z.literal("generate_settlement_batch"),
          periodStart: z.string(),
          periodEnd: z.string(),
          vertical: z
            .enum(["connect", "marketplace", "enterprise", "cross_vertical"])
            .optional(),
        })
        .parse(body);
      const batch = await generateSettlementBatch(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ batch }, ctx, 201);
    }
    case "approve_settlement_batch": {
      requirePerm("finance.settlement.manage");
      const parsed = z
        .object({
          action: z.literal("approve_settlement_batch"),
          batchId: z.string().uuid(),
        })
        .parse(body);
      const batch = await approveSettlementBatch(admin, {
        batchId: parsed.batchId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ batch }, ctx);
    }
    case "attempt_settlement_execution": {
      requirePerm("finance.settlement.manage");
      const parsed = z
        .object({
          action: z.literal("attempt_settlement_execution"),
          batchId: z.string().uuid(),
        })
        .parse(body);
      const batch = await attemptSettlementExecution(admin, {
        batchId: parsed.batchId,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ batch }, ctx);
    }
    case "record_offline_payment": {
      requirePerm("finance.offline.manage");
      const parsed = z
        .object({
          action: z.literal("record_offline_payment"),
          sourceDomain: z.string().min(1).max(100),
          sourceId: z.string().uuid().optional().nullable(),
          payerUserId: z.string().uuid().optional().nullable(),
          amountMinor: z.number().int().positive(),
          method: z.enum(["neft", "rtgs", "cheque", "bank_transfer"]),
          bankReference: z.string().min(1).max(200),
          receivedOn: z.string(),
          proofRef: z.string().max(500).optional().nullable(),
        })
        .parse(body);
      const offline = await recordOfflinePayment(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ offline }, ctx, 201);
    }
    case "verify_offline_payment": {
      requirePerm("finance.offline.manage");
      const parsed = z
        .object({
          action: z.literal("verify_offline_payment"),
          offlinePaymentId: z.string().uuid(),
          matchedPaymentIntentId: z.string().uuid().optional().nullable(),
        })
        .parse(body);
      const offline = await verifyOfflinePayment(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ offline }, ctx);
    }
    case "open_chargeback": {
      requirePerm("finance.entitlement.review");
      const parsed = z
        .object({
          action: z.literal("open_chargeback"),
          providerDisputeRef: z.string().min(1).max(200),
          paymentIntentId: z.string().uuid().optional().nullable(),
          revenueComponentId: z.string().uuid().optional().nullable(),
          amountMinor: z.number().int().positive(),
        })
        .parse(body);
      const chargeback = await openChargebackCase(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ chargeback }, ctx, 201);
    }
    case "create_correction": {
      requirePerm("finance.correction.create");
      const parsed = z
        .object({
          action: z.literal("create_correction"),
          correctionKey: z.string().min(1).max(200),
          subjectType: z.string().min(1).max(100),
          subjectId: z.string().uuid(),
          reason: z.string().min(1).max(1000),
          amountMinor: z.number().int(),
          approverUserId: z.string().uuid(),
        })
        .parse(body);
      const correction = await createFinancialCorrection(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ correction }, ctx, 201);
    }
    case "create_reconciliation": {
      requirePerm("finance.reconciliation.manage");
      const parsed = z
        .object({
          action: z.literal("create_reconciliation"),
          domain: z.string().min(1).max(100),
          leftRef: z.string().min(1).max(200),
          rightRef: z.string().max(200).optional().nullable(),
          status: z.enum([
            "matched",
            "unmatched",
            "mismatch",
            "duplicate",
            "under_review",
            "resolved",
          ]),
          amountMinor: z.number().int().optional().nullable(),
          notes: z.string().max(2000).optional().nullable(),
        })
        .parse(body);
      const record = await createReconciliationRecord(admin, {
        ...parsed,
        actorUserId: ctx.user.id,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ record }, ctx, 201);
    }
    default:
      throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
        status: 400,
      });
  }
});
