import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import {
  actorHasOpsPermission,
  assertPhase12ProviderSafety,
  createComplianceHold,
  createNotificationIntent,
  createPrivacyRequest,
  createRiskSignal,
  createRetentionReview,
  disposeDeadLetter,
  dispatchNotificationIntent,
  getKpiFoundation,
  getNotificationPreferences,
  ingestDomainEventToPipelines,
  listInAppNotifications,
  listRetentionPolicies,
  logSensitiveAccess,
  markInAppRead,
  recordSecurityEvent,
  registerPushSubscription,
  releaseComplianceHold,
  reviewPrivacyRequest,
  searchAuditEvents,
  upsertNotificationPreferences,
  upsertOperationalAlert,
} from "@/lib/architecture/ops-governance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "inbox";
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (view === "inbox") {
    if (!actorHasOpsPermission(assignments, "notif.read_own")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const items = await listInAppNotifications(admin, ctx.user.id, {
      unreadOnly: url.searchParams.get("unread") === "1",
    });
    return jsonSuccess({ items }, ctx);
  }

  if (view === "preferences") {
    if (!actorHasOpsPermission(assignments, "notif.prefs_own")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const prefs = await getNotificationPreferences(admin, ctx.user.id);
    return jsonSuccess({ prefs }, ctx);
  }

  if (view === "flags") {
    const status = await assertPhase12ProviderSafety(admin);
    return jsonSuccess({ status }, ctx);
  }

  if (view === "kpi") {
    if (!actorHasOpsPermission(assignments, "analytics.read")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    return jsonSuccess(await getKpiFoundation(admin), ctx);
  }

  if (view === "audit") {
    if (!actorHasOpsPermission(assignments, "audit.search")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const rows = await searchAuditEvents(admin, {
      actorUserId: url.searchParams.get("actor"),
      action: url.searchParams.get("action"),
      resourceType: url.searchParams.get("resourceType"),
      resourceId: url.searchParams.get("resourceId"),
      correlationId: url.searchParams.get("correlationId"),
      from: url.searchParams.get("from"),
      to: url.searchParams.get("to"),
      limit: Number(url.searchParams.get("limit") ?? 50),
    });
    return jsonSuccess({ rows }, ctx);
  }

  if (view === "security") {
    if (!actorHasOpsPermission(assignments, "security.read")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("security_events")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [] }, ctx);
  }

  if (view === "risk") {
    if (!actorHasOpsPermission(assignments, "risk.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("risk_signals")
      .select("*")
      .eq("review_status", "open")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [] }, ctx);
  }

  if (view === "alerts") {
    if (!actorHasOpsPermission(assignments, "alerts.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("operational_alerts")
      .select("*")
      .eq("status", "open")
      .order("last_seen_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [] }, ctx);
  }

  if (view === "dead_letters") {
    if (!actorHasOpsPermission(assignments, "notif.dead_letter")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("notification_dead_letters")
      .select("*")
      .eq("disposition", "open")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [] }, ctx);
  }

  if (view === "holds") {
    if (!actorHasOpsPermission(assignments, "compliance.hold")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data } = await admin
      .from("compliance_holds")
      .select("*")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [] }, ctx);
  }

  if (view === "privacy") {
    if (!actorHasOpsPermission(assignments, "privacy.review")) {
      // own requests still readable via requester path
      const { data } = await admin
        .from("privacy_requests")
        .select("*")
        .eq("requester_user_id", ctx.user.id)
        .order("created_at", { ascending: false });
      return jsonSuccess({ rows: data ?? [], scope: "own" }, ctx);
    }
    const { data } = await admin
      .from("privacy_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);
    return jsonSuccess({ rows: data ?? [], scope: "ops" }, ctx);
  }

  if (view === "retention") {
    if (!actorHasOpsPermission(assignments, "retention.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    return jsonSuccess({ policies: await listRetentionPolicies(admin) }, ctx);
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

  if (action === "update_preferences") {
    if (!actorHasOpsPermission(assignments, "notif.prefs_own")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const schema = z.object({
      inAppEnabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      smsEnabled: z.boolean().optional(),
      pushEnabled: z.boolean().optional(),
      marketingOptIn: z.boolean().optional(),
    });
    const parsed = schema.parse(body);
    const prefs = await upsertNotificationPreferences(admin, ctx.user.id, parsed);
    return jsonSuccess({ prefs }, ctx);
  }

  if (action === "mark_read") {
    await markInAppRead(admin, ctx.user.id, body.notificationId);
    return jsonSuccess({ ok: true }, ctx);
  }

  if (action === "register_push") {
    const endpoint = z.string().url().parse(body.endpoint);
    const sub = await registerPushSubscription(admin, ctx.user.id, endpoint);
    return jsonSuccess({ subscription: sub }, ctx);
  }

  if (action === "create_privacy_request") {
    const requestType = z
      .enum(["access", "correction", "erasure", "restricted_processing"])
      .parse(body.requestType);
    const row = await createPrivacyRequest(admin, {
      requesterUserId: ctx.user.id,
      requestType,
      details: body.details,
    });
    return jsonSuccess({ request: row }, ctx);
  }

  if (action === "enqueue_test_notification") {
    // Dev/verification helper — always recipient = self
    const result = await createNotificationIntent(admin, {
      recipientUserId: ctx.user.id,
      templateKey: String(body.templateKey ?? "security.notice"),
      channel: (body.channel ?? "in_app") as "in_app",
      category: (body.category ?? "security") as "security",
      payload: { summary: String(body.summary ?? "Phase 12 verification notice") },
      deepLink: "/ops/notifications",
      sourceDomain: "phase12",
      sourceEventId: `selftest:${ctx.user.id}:${Date.now()}`,
      idempotencyKey: String(
        body.idempotencyKey ?? `selftest:${ctx.user.id}:${body.templateKey ?? "security.notice"}`
      ),
    });
    if (!result.suppressed && result.intent?.id) {
      await dispatchNotificationIntent(admin, result.intent.id);
    }
    return jsonSuccess({ result }, ctx);
  }

  if (action === "ingest_domain_event") {
    if (!actorHasOpsPermission(assignments, "analytics.read") &&
        !actorHasOpsPermission(assignments, "security.read")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const result = await ingestDomainEventToPipelines(admin, {
      family: String(body.family),
      eventName: String(body.eventName),
      actorUserId: ctx.user.id,
      subjectType: body.subjectType,
      subjectId: body.subjectId,
      vertical: body.vertical,
      payload: body.payload,
      sourceDomain: String(body.sourceDomain ?? "ops"),
      sourceEventId: String(body.sourceEventId),
      notify: body.notify,
    });
    return jsonSuccess({ result }, ctx);
  }

  if (action === "record_security_event") {
    if (!actorHasOpsPermission(assignments, "security.read")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const event = await recordSecurityEvent(admin, {
      eventType: String(body.eventType),
      severity: body.severity ?? "medium",
      summary: String(body.summary),
      actorUserId: ctx.user.id,
      subjectType: body.subjectType,
      subjectId: body.subjectId,
      details: body.details,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess({ event }, ctx);
  }

  if (action === "create_risk_signal") {
    if (!actorHasOpsPermission(assignments, "risk.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const signal = await createRiskSignal(admin, {
      signalType: String(body.signalType),
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      actorUserId: ctx.user.id,
      recommendation: body.recommendation ?? "review",
      details: body.details,
      idempotencyKey: String(body.idempotencyKey),
    });
    return jsonSuccess({ signal }, ctx);
  }

  if (action === "create_hold") {
    if (!actorHasOpsPermission(assignments, "compliance.hold")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const hold = await createComplianceHold(admin, {
      subjectType: String(body.subjectType),
      subjectId: String(body.subjectId),
      reason: String(body.reason),
      createdBy: ctx.user.id,
      releaseConditions: body.releaseConditions,
    });
    return jsonSuccess({ hold }, ctx);
  }

  if (action === "release_hold") {
    if (!actorHasOpsPermission(assignments, "compliance.hold")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const hold = await releaseComplianceHold(admin, String(body.holdId), ctx.user.id);
    return jsonSuccess({ hold }, ctx);
  }

  if (action === "review_privacy") {
    if (!actorHasOpsPermission(assignments, "privacy.review")) {
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

  if (action === "retention_review") {
    if (!actorHasOpsPermission(assignments, "retention.review")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await createRetentionReview(admin, {
      policyKey: String(body.policyKey),
      subjectRef: body.subjectRef,
    });
    return jsonSuccess({ review: row }, ctx);
  }

  if (action === "log_sensitive_access") {
    const row = await logSensitiveAccess(admin, {
      actorUserId: ctx.user.id,
      recordType: String(body.recordType),
      recordId: String(body.recordId),
      purpose: body.purpose,
      workspaceKey: body.workspaceKey,
      accessResult: body.accessResult ?? "success",
    });
    return jsonSuccess({ event: row }, ctx);
  }

  if (action === "dispose_dead_letter") {
    if (!actorHasOpsPermission(assignments, "notif.dead_letter")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const row = await disposeDeadLetter(admin, {
      deadLetterId: String(body.deadLetterId),
      actorUserId: ctx.user.id,
      disposition: body.disposition,
    });
    return jsonSuccess({ deadLetter: row }, ctx);
  }

  if (action === "ack_alert") {
    if (!actorHasOpsPermission(assignments, "alerts.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const { data, error } = await admin
      .from("operational_alerts")
      .update({
        status: "acknowledged",
        acknowledged_by: ctx.user.id,
        acknowledged_at: new Date().toISOString(),
      })
      .eq("id", String(body.alertId))
      .eq("status", "open")
      .select("*")
      .maybeSingle();
    if (error) throw new AppError("INTERNAL_ERROR", "Failed to ack alert", { cause: error });
    return jsonSuccess({ alert: data }, ctx);
  }

  if (action === "raise_alert") {
    if (!actorHasOpsPermission(assignments, "alerts.manage")) {
      throw new AppError("FORBIDDEN", "Not allowed", { status: 403 });
    }
    const alert = await upsertOperationalAlert(admin, {
      alertKey: String(body.alertKey),
      severity: body.severity ?? "medium",
      title: String(body.title),
      summary: String(body.summary),
      details: body.details,
    });
    return jsonSuccess({ alert }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
    status: 400,
  });
});
