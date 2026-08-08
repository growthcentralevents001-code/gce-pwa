import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import {
  actorHasOpsAdminPermission,
  addCaseNote,
  applyModerationAction,
  applyScopedSuspension,
  assertPhase13SafetyFlags,
  assignCase,
  createCase,
  createOperationalOverride,
  enqueueApproval,
  enqueueException,
  getApprovalQueue,
  getEntityTimeline,
  getExceptionQueue,
  getOpsDashboard,
  listCases,
  notifyCaseAssigned,
  processRefundReview,
  promoteSupportSignalToCase,
  requestTermination,
  resolveException,
  resolveIncident,
  reviewApproval,
  reviewOperationalOverride,
  reviewRiskSignalOps,
  searchOpsEntities,
  transitionCase,
  acknowledgeIncident,
} from "@/lib/architecture/ops-admin";
import {
  createComplianceHold,
  releaseComplianceHold,
  reviewPrivacyRequest,
} from "@/lib/architecture/ops-governance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "dashboard";
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (view === "dashboard") {
    if (!actorHasOpsAdminPermission(assignments, "ops.dashboard")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const vertical = url.searchParams.get("vertical") as
      | "platform"
      | "connect"
      | "marketplace"
      | "enterprise"
      | "finance"
      | "compliance"
      | "support"
      | null;
    return jsonSuccess(await getOpsDashboard(admin, { vertical }), ctx);
  }

  if (view === "flags") {
    return jsonSuccess({ status: await assertPhase13SafetyFlags(admin) }, ctx);
  }

  if (view === "search") {
    if (!actorHasOpsAdminPermission(assignments, "ops.search")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const q = url.searchParams.get("q") ?? "";
    return jsonSuccess(await searchOpsEntities(admin, q), ctx);
  }

  if (view === "approvals") {
    if (!actorHasOpsAdminPermission(assignments, "ops.approvals.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const vertical = url.searchParams.get("vertical") as never;
    return jsonSuccess(
      { items: await getApprovalQueue(admin, { vertical }) },
      ctx
    );
  }

  if (view === "exceptions") {
    if (!actorHasOpsAdminPermission(assignments, "ops.exceptions.resolve")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const vertical = url.searchParams.get("vertical") as never;
    return jsonSuccess(
      { items: await getExceptionQueue(admin, { vertical }) },
      ctx
    );
  }

  if (view === "cases") {
    if (!actorHasOpsAdminPermission(assignments, "ops.cases.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    return jsonSuccess(
      {
        items: await listCases(admin, {
          vertical: url.searchParams.get("vertical") as never,
          status: url.searchParams.get("status"),
        }),
      },
      ctx
    );
  }

  if (view === "timeline") {
    if (!actorHasOpsAdminPermission(assignments, "ops.search")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    return jsonSuccess(
      {
        items: await getEntityTimeline(admin, {
          resourceType: String(url.searchParams.get("resourceType")),
          resourceId: String(url.searchParams.get("resourceId")),
        }),
      },
      ctx
    );
  }

  if (view === "refunds") {
    if (!actorHasOpsAdminPermission(assignments, "ops.refund.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("customer_refund_requests")
      .select("id, booking_id, status, amount_determination, reason, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ items: data ?? [] }, ctx);
  }

  if (view === "support_signals") {
    if (!actorHasOpsAdminPermission(assignments, "ops.support")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("customer_support_signals")
      .select("id, user_id, message, status, ops_case_id, created_at")
      .eq("status", "queued_for_phase13")
      .order("created_at", { ascending: true })
      .limit(50);
    return jsonSuccess({ items: data ?? [] }, ctx);
  }

  if (view === "incidents") {
    if (!actorHasOpsAdminPermission(assignments, "ops.incident.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("incident_signals")
      .select("*")
      .in("status", ["candidate", "acknowledged", "investigating"])
      .order("last_seen_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ items: data ?? [] }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown view: ${view}`, {
    status: 400,
  });
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = String(body.action ?? "");
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (action === "enqueue_approval") {
    if (!actorHasOpsAdminPermission(assignments, "ops.approvals.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await enqueueApproval(admin, {
      queueKey: String(body.queueKey),
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      vertical: body.vertical ?? "platform",
      title: String(body.title),
      requesterUserId: body.requesterUserId ?? ctx.user.id,
      policyVersion: body.policyVersion,
      domainAction: body.domainAction,
      metadata: body.metadata,
      idempotencyKey: String(body.idempotencyKey),
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "review_approval") {
    if (!actorHasOpsAdminPermission(assignments, "ops.approvals.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await reviewApproval(admin, {
      approvalId: String(body.approvalId),
      actorUserId: ctx.user.id,
      decision: body.decision,
      decisionReason: String(body.decisionReason),
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "enqueue_exception") {
    if (!actorHasOpsAdminPermission(assignments, "ops.exceptions.resolve")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await enqueueException(admin, {
      exceptionKey: String(body.exceptionKey),
      source: String(body.source),
      title: String(body.title),
      summary: String(body.summary),
      vertical: body.vertical,
      severity: body.severity,
      subjectType: body.subjectType,
      subjectId: body.subjectId,
      metadata: body.metadata,
      idempotencyKey: String(body.idempotencyKey),
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "resolve_exception") {
    if (!actorHasOpsAdminPermission(assignments, "ops.exceptions.resolve")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const item = await resolveException(admin, {
      exceptionId: String(body.exceptionId),
      actorUserId: ctx.user.id,
      resolution: String(body.resolution),
      status: body.status,
    });
    return jsonSuccess({ item }, ctx);
  }

  if (action === "create_case") {
    if (!actorHasOpsAdminPermission(assignments, "ops.cases.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await createCase(admin, {
      caseType: body.caseType,
      vertical: body.vertical ?? "support",
      summary: String(body.summary),
      requesterUserId: body.requesterUserId,
      subjectUserId: body.subjectUserId,
      ownerUserId: body.ownerUserId,
      priority: body.priority,
      severity: body.severity,
      linkedDomainTable: body.linkedDomainTable,
      linkedDomainId: body.linkedDomainId,
      metadata: body.metadata,
      actorUserId: ctx.user.id,
    });
    if (row.owner_user_id) await notifyCaseAssigned(admin, row);
    return jsonSuccess({ case: row }, ctx);
  }

  if (action === "assign_case") {
    if (!actorHasOpsAdminPermission(assignments, "ops.cases.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await assignCase(admin, {
      caseId: String(body.caseId),
      actorUserId: ctx.user.id,
      ownerUserId: String(body.ownerUserId),
      reason: body.reason,
    });
    await notifyCaseAssigned(admin, row);
    return jsonSuccess({ case: row }, ctx);
  }

  if (action === "transition_case") {
    if (!actorHasOpsAdminPermission(assignments, "ops.cases.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await transitionCase(admin, {
      caseId: String(body.caseId),
      actorUserId: ctx.user.id,
      toStatus: body.toStatus,
      reason: body.reason,
      resolutionSummary: body.resolutionSummary,
    });
    return jsonSuccess({ case: row }, ctx);
  }

  if (action === "add_case_note") {
    const visibility = body.visibility === "customer_visible"
      ? "customer_visible"
      : "internal";
    if (
      visibility === "internal" &&
      !actorHasOpsAdminPermission(assignments, "ops.cases.internal_notes")
    ) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const note = await addCaseNote(admin, {
      caseId: String(body.caseId),
      authorUserId: ctx.user.id,
      body: String(body.body),
      visibility,
    });
    return jsonSuccess({ note }, ctx);
  }

  if (action === "create_override") {
    if (!actorHasOpsAdminPermission(assignments, "ops.overrides.request")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await createOperationalOverride(admin, {
      category: body.category,
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      reason: String(body.reason),
      previousState: body.previousState,
      intendedState: body.intendedState,
      requesterUserId: ctx.user.id,
      requiresSecondApprover: body.requiresSecondApprover,
    });
    return jsonSuccess({ override: row }, ctx);
  }

  if (action === "review_override") {
    if (!actorHasOpsAdminPermission(assignments, "ops.overrides.approve")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await reviewOperationalOverride(admin, {
      overrideId: String(body.overrideId),
      actorUserId: ctx.user.id,
      decision: body.decision,
      reason: String(body.reason),
    });
    return jsonSuccess({ override: row }, ctx);
  }

  if (action === "moderate") {
    if (!actorHasOpsAdminPermission(assignments, "ops.moderation")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await applyModerationAction(admin, {
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      action: body.moderationAction,
      reason: String(body.reason),
      actorUserId: ctx.user.id,
      metadata: body.metadata,
    });
    return jsonSuccess({ moderation: row }, ctx);
  }

  if (action === "suspend_scoped") {
    if (!actorHasOpsAdminPermission(assignments, "ops.suspend.scoped")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await applyScopedSuspension(admin, {
      scope: body.scope,
      targetId: String(body.targetId),
      actorUserId: ctx.user.id,
      reason: String(body.reason),
      actorAssignments: assignments,
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "terminate_assignment") {
    if (!actorHasOpsAdminPermission(assignments, "ops.suspend.scoped")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await requestTermination(admin, {
      assignmentId: String(body.assignmentId),
      actorUserId: ctx.user.id,
      reason: String(body.reason),
      actorAssignments: assignments,
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "ack_incident") {
    if (!actorHasOpsAdminPermission(assignments, "ops.incident.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await acknowledgeIncident(admin, {
      incidentId: String(body.incidentId),
      actorUserId: ctx.user.id,
      note: body.note,
    });
    return jsonSuccess({ incident: row }, ctx);
  }

  if (action === "resolve_incident") {
    if (!actorHasOpsAdminPermission(assignments, "ops.incident.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await resolveIncident(admin, {
      incidentId: String(body.incidentId),
      actorUserId: ctx.user.id,
      resolutionRef: String(body.resolutionRef),
      note: body.note,
    });
    return jsonSuccess({ incident: row }, ctx);
  }

  if (action === "review_risk") {
    if (!actorHasOpsAdminPermission(assignments, "ops.compliance")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await reviewRiskSignalOps(admin, {
      signalId: String(body.signalId),
      actorUserId: ctx.user.id,
      reviewStatus: body.reviewStatus,
      note: String(body.note),
      applyHold: body.applyHold,
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "refund_review") {
    if (!actorHasOpsAdminPermission(assignments, "ops.refund.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await processRefundReview(admin, {
      refundRequestId: String(body.refundRequestId),
      actorUserId: ctx.user.id,
      decision: body.decision,
      reason: String(body.reason),
    });
    return jsonSuccess({ refund: row }, ctx);
  }

  if (action === "promote_support_signal") {
    if (!actorHasOpsAdminPermission(assignments, "ops.support")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await promoteSupportSignalToCase(admin, {
      signalId: String(body.signalId),
      actorUserId: ctx.user.id,
    });
    return jsonSuccess({ case: row }, ctx);
  }

  if (action === "create_hold") {
    if (!actorHasOpsAdminPermission(assignments, "ops.compliance")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const hold = await createComplianceHold(admin, {
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      reason: String(body.reason),
      createdBy: ctx.user.id,
    });
    return jsonSuccess({ hold }, ctx);
  }

  if (action === "release_hold") {
    if (!actorHasOpsAdminPermission(assignments, "ops.compliance")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const hold = await releaseComplianceHold(
      admin,
      String(body.holdId),
      ctx.user.id
    );
    return jsonSuccess({ hold }, ctx);
  }

  if (action === "review_privacy") {
    if (!actorHasOpsAdminPermission(assignments, "ops.compliance")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await reviewPrivacyRequest(admin, {
      requestId: String(body.requestId),
      reviewerId: ctx.user.id,
      status: body.status,
      reviewNotes: body.reviewNotes,
    });
    return jsonSuccess({ request: row }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
    status: 400,
  });
});
