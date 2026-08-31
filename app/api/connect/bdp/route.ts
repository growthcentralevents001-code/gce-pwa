import {
  withAuthedRoute,
  jsonSuccess,
  assertPermission,
} from "@/lib/api/context";
import {
  acceptConnectBdpTerms,
  activateConnectBdpUnit,
  createConnectBdpApplication,
  listConnectBdpUnitsForUser,
  recordConnectBdpPackPayment,
  suspendConnectBdpUnit,
  terminateConnectBdpUnit,
  buildConnectBdpDashboard,
  upsertCityConfig,
  assignUnitToCity,
  proposeMemberAttribution,
  activateMemberAttribution,
  assignCircleToUnit,
  createCommissionEntitlement,
  applyPackageRecovery,
  openConnectBdpDispute,
  escalateDisputeToPrm,
  resolveConnectBdpDispute,
  createConnectBdpHandover,
  actorHasConnectBdpPermission,
} from "@/lib/architecture/connect-bdp";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";
import { connectBdpApplicationFieldsSchema } from "@/lib/architecture/connect-bdp/application";

const applySchema = z.object({
  action: z.literal("apply"),
  packageOption: z
    .enum(["direct_50000", "finance_recovery_60000"])
    .optional(),
  application: connectBdpApplicationFieldsSchema,
});

const termsSchema = z.object({
  action: z.literal("accept_terms"),
  unitId: z.string().uuid(),
});

const paySchema = z.object({
  action: z.literal("record_payment"),
  unitId: z.string().uuid(),
  paymentIntentId: z.string().uuid().optional().nullable(),
  offlinePaymentRef: z.string().max(200).optional().nullable(),
});

const activateSchema = z.object({
  action: z.literal("activate"),
  unitId: z.string().uuid(),
  reason: z.string().min(3).max(1000).optional(),
});

const suspendSchema = z.object({
  action: z.enum(["suspend", "terminate"]),
  unitId: z.string().uuid(),
  reason: z.string().min(3).max(1000),
});

const citySchema = z.object({
  action: z.literal("upsert_city"),
  city: z.string().min(1).max(120),
  state: z.string().max(120).optional().nullable(),
  tier: z.enum(["tier_1", "tier_2", "tier_3"]),
});

const cityAssignSchema = z.object({
  action: z.literal("assign_city"),
  unitId: z.string().uuid(),
  cityConfigId: z.string().uuid(),
  zoneCode: z.string().max(40).optional().nullable(),
});

const attrProposeSchema = z.object({
  action: z.literal("propose_attribution"),
  membershipId: z.string().uuid(),
  unitId: z.string().uuid(),
  provenance: z.string().max(80).optional(),
  basis: z.string().max(500).optional(),
});

const attrActivateSchema = z.object({
  action: z.literal("activate_attribution"),
  attributionId: z.string().uuid(),
  reason: z.string().max(1000).optional(),
});

const circleAssignSchema = z.object({
  action: z.literal("assign_circle"),
  unitId: z.string().uuid(),
  circleId: z.string().uuid(),
  reason: z.string().max(1000).optional(),
});

const entitlementSchema = z.object({
  action: z.literal("record_entitlement"),
  unitId: z.string().uuid(),
  membershipId: z.string().uuid().optional().nullable(),
  attributionId: z.string().uuid().optional().nullable(),
  earningEventKey: z.string().min(3).max(200),
  eligibleRevenueMinor: z.number().int().nonnegative(),
  hasValidAttribution: z.boolean(),
  state: z.enum(["estimated", "earned", "settlement_eligible"]).optional(),
});

const recoverySchema = z.object({
  action: z.literal("apply_recovery"),
  unitId: z.string().uuid(),
  entitlementId: z.string().uuid(),
  cycleKey: z.string().min(1).max(120),
});

const disputeOpenSchema = z.object({
  action: z.literal("open_dispute"),
  unitId: z.string().uuid(),
  subject: z.string().min(3).max(200),
  details: z.string().max(4000).optional().nullable(),
  circleId: z.string().uuid().optional().nullable(),
  membershipId: z.string().uuid().optional().nullable(),
});

const disputeEscalateSchema = z.object({
  action: z.literal("escalate_dispute"),
  disputeId: z.string().uuid(),
  prmUserId: z.string().uuid(),
  notes: z.string().max(2000).optional(),
});

const disputeResolveSchema = z.object({
  action: z.literal("resolve_dispute"),
  disputeId: z.string().uuid(),
  resolutionNotes: z.string().min(3).max(4000),
});

const handoverSchema = z.object({
  action: z.literal("handover"),
  fromUnitId: z.string().uuid(),
  toUnitId: z.string().uuid(),
  circleId: z.string().uuid().optional().nullable(),
  notes: z.string().max(2000).optional().nullable(),
  approve: z.boolean().optional(),
});

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const unitId = url.searchParams.get("unitId");
  const units = await listConnectBdpUnitsForUser(ctx.supabase, ctx.user.id);
  if (unitId) {
    const owned = units.some((u) => String(u.id) === unitId);
    const canOps = actorHasConnectBdpPermission(
      ctx.entitlements.activeAssignments,
      "connect_bdp.unit.approve"
    );
    if (!owned && !canOps) {
      throw new AppError("FORBIDDEN", "Not allowed to read this unit", {
        status: 403,
      });
    }
    const report = owned
      ? await buildConnectBdpDashboard(ctx.supabase, unitId)
      : await buildConnectBdpDashboard(
          createPrivilegedSupabaseClient(),
          unitId
        );
    return jsonSuccess({ units, report }, ctx);
  }
  return jsonSuccess({ units }, ctx);
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = body?.action as string | undefined;
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (action === "apply") {
    const parsed = applySchema.parse(body);
    const unit = await createConnectBdpApplication(ctx.supabase, {
      userId: ctx.user.id,
      packageOption: parsed.packageOption,
      application: parsed.application,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ unit }, ctx, 201);
  }

  if (action === "accept_terms") {
    const parsed = termsSchema.parse(body);
    const unit = await acceptConnectBdpTerms(ctx.supabase, {
      unitId: parsed.unitId,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ unit }, ctx);
  }

  if (action === "record_payment") {
    const parsed = paySchema.parse(body);
    // Production money movement gated by feature flags — record state only
    const unit = await recordConnectBdpPackPayment(admin, {
      unitId: parsed.unitId,
      paymentIntentId: parsed.paymentIntentId,
      offlinePaymentRef: parsed.offlinePaymentRef,
      offlineRecordedBy: parsed.offlinePaymentRef ? ctx.user.id : null,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ unit }, ctx);
  }

  if (action === "activate") {
    const parsed = activateSchema.parse(body);
    if (!actorHasConnectBdpPermission(assignments, "connect_bdp.unit.approve")) {
      assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    }
    const unit = await activateConnectBdpUnit(admin, {
      unitId: parsed.unitId,
      actorUserId: ctx.user.id,
      actorAssignments: assignments,
      reason: parsed.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ unit }, ctx);
  }

  if (action === "suspend" || action === "terminate") {
    const parsed = suspendSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    if (parsed.action === "suspend") {
      const unit = await suspendConnectBdpUnit(admin, {
        unitId: parsed.unitId,
        actorUserId: ctx.user.id,
        actorAssignments: assignments,
        reason: parsed.reason,
        correlationId: ctx.correlationId,
      });
      return jsonSuccess({ unit }, ctx);
    }
    const unit = await terminateConnectBdpUnit(admin, {
      unitId: parsed.unitId,
      actorUserId: ctx.user.id,
      reason: parsed.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ unit }, ctx);
  }

  if (action === "upsert_city") {
    const parsed = citySchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const city = await upsertCityConfig(admin, {
      city: parsed.city,
      state: parsed.state,
      tier: parsed.tier,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ city }, ctx);
  }

  if (action === "assign_city") {
    const parsed = cityAssignSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const assignment = await assignUnitToCity(admin, {
      unitId: parsed.unitId,
      cityConfigId: parsed.cityConfigId,
      zoneCode: parsed.zoneCode,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ assignment }, ctx);
  }

  if (action === "propose_attribution") {
    const parsed = attrProposeSchema.parse(body);
    const units = await listConnectBdpUnitsForUser(ctx.supabase, ctx.user.id);
    const owned = units.find((u) => String(u.id) === parsed.unitId);
    const isOps = actorHasConnectBdpPermission(
      assignments,
      "connect_bdp.attribution.approve"
    );
    if (!owned && !isOps) {
      throw new AppError("FORBIDDEN", "Not your Connect BDP unit", {
        status: 403,
      });
    }
    const bdpUserId = owned
      ? ctx.user.id
      : String(
          (
            await admin
              .from("connect_bdp_units")
              .select("user_id")
              .eq("id", parsed.unitId)
              .single()
          ).data?.user_id ?? ""
        );
    if (!bdpUserId) {
      throw new AppError("NOT_FOUND", "Connect BDP unit not found", {
        status: 404,
      });
    }
    const attribution = await proposeMemberAttribution(admin, {
      membershipId: parsed.membershipId,
      unitId: parsed.unitId,
      bdpUserId,
      provenance: parsed.provenance,
      basis: parsed.basis,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ attribution }, ctx, 201);
  }

  if (action === "activate_attribution") {
    const parsed = attrActivateSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const attribution = await activateMemberAttribution(admin, {
      attributionId: parsed.attributionId,
      actorUserId: ctx.user.id,
      reason: parsed.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ attribution }, ctx);
  }

  if (action === "assign_circle") {
    const parsed = circleAssignSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const assignment = await assignCircleToUnit(admin, {
      unitId: parsed.unitId,
      circleId: parsed.circleId,
      actorUserId: ctx.user.id,
      reason: parsed.reason,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ assignment }, ctx);
  }

  if (action === "record_entitlement") {
    const parsed = entitlementSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const entitlement = await createCommissionEntitlement(admin, {
      unitId: parsed.unitId,
      membershipId: parsed.membershipId ?? null,
      attributionId: parsed.attributionId ?? null,
      earningEventKey: parsed.earningEventKey,
      eligibleRevenueMinor: parsed.eligibleRevenueMinor,
      hasValidAttribution: parsed.hasValidAttribution,
      state: parsed.state,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ entitlement }, ctx, 201);
  }

  if (action === "apply_recovery") {
    const parsed = recoverySchema.parse(body);
    if (
      !actorHasConnectBdpPermission(assignments, "connect_bdp.recovery.apply")
    ) {
      throw new AppError("FORBIDDEN", "Finance/platform recovery only", {
        status: 403,
      });
    }
    const recovery = await applyPackageRecovery(admin, {
      unitId: parsed.unitId,
      entitlementId: parsed.entitlementId,
      cycleKey: parsed.cycleKey,
      actorUserId: ctx.user.id,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ recovery }, ctx);
  }

  if (action === "open_dispute") {
    const parsed = disputeOpenSchema.parse(body);
    const dispute = await openConnectBdpDispute(admin, {
      unitId: parsed.unitId,
      openedBy: ctx.user.id,
      subject: parsed.subject,
      details: parsed.details,
      circleId: parsed.circleId,
      membershipId: parsed.membershipId,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ dispute }, ctx, 201);
  }

  if (action === "escalate_dispute") {
    const parsed = disputeEscalateSchema.parse(body);
    const dispute = await escalateDisputeToPrm(admin, {
      disputeId: parsed.disputeId,
      prmUserId: parsed.prmUserId,
      actorUserId: ctx.user.id,
      notes: parsed.notes,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ dispute }, ctx);
  }

  if (action === "resolve_dispute") {
    const parsed = disputeResolveSchema.parse(body);
    const dispute = await resolveConnectBdpDispute(admin, {
      disputeId: parsed.disputeId,
      actorUserId: ctx.user.id,
      resolutionNotes: parsed.resolutionNotes,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ dispute }, ctx);
  }

  if (action === "handover") {
    const parsed = handoverSchema.parse(body);
    assertPermission(ctx, "approve", { requirePlatformAdmin: true });
    const handover = await createConnectBdpHandover(admin, {
      fromUnitId: parsed.fromUnitId,
      toUnitId: parsed.toUnitId,
      circleId: parsed.circleId,
      actorUserId: ctx.user.id,
      notes: parsed.notes,
      approve: parsed.approve ?? true,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ handover }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
    status: 400,
  });
});
