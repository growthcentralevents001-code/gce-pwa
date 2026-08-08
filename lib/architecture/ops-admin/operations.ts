import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import { isFeatureEnabled } from "../feature-flags/flags";
import { suspendIdentity } from "../identity/suspension";
import {
  suspendRoleAssignment,
  terminateRoleAssignment,
} from "../identity/assignments";
import {
  createComplianceHold,
  releaseComplianceHold,
  reviewPrivacyRequest,
  createRiskSignal,
  ingestAnalyticsEvent,
  createNotificationIntent,
  dispatchNotificationIntent,
  minimiseAnalyticsPayload,
} from "../ops-governance";
import {
  ALLOWED_CASE_TRANSITIONS,
  MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF,
  PHASE13_RULE_VERSION,
  type OpsCaseStatus,
  type OpsCaseType,
  type OpsVertical,
  type OverrideCategory,
} from "./constants";
import { assertOpsNotSelfApproval } from "./permissions";

type Json = Record<string, unknown>;

export async function assertPhase13SafetyFlags(client: SupabaseClient) {
  const status: Record<string, boolean> = {};
  for (const key of MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF) {
    status[key] = await isFeatureEnabled(
      client,
      key as Parameters<typeof isFeatureEnabled>[1]
    );
    if (status[key]) {
      throw new AppError(
        "CONFIGURATION_ERROR",
        `Unsafe flag must remain OFF: ${key}`,
        { details: status }
      );
    }
  }
  return status;
}

async function requireFlag(client: SupabaseClient, key: string) {
  if (!(await isFeatureEnabled(client, key as never))) {
    throw new AppError("FEATURE_DISABLED", `Feature disabled: ${key}`, {
      status: 403,
    });
  }
}

function requireReason(reason: string, min = 8) {
  if (!reason || reason.trim().length < min) {
    throw new AppError("VALIDATION_ERROR", "A detailed reason is required", {
      status: 400,
    });
  }
}

async function emitOpsAnalytics(
  client: SupabaseClient,
  eventName: string,
  payload: Json,
  actorUserId?: string | null
) {
  await ingestAnalyticsEvent(client, {
    eventFamily: "ops_admin",
    eventName,
    actorUserId,
    payload: minimiseAnalyticsPayload(payload),
    sourceDomain: "phase13",
    sourceEventId: `${eventName}:${payload.id ?? payload.caseId ?? Date.now()}`,
    idempotencyKey: `ops13:${eventName}:${payload.id ?? payload.caseId ?? Date.now()}:${actorUserId ?? "sys"}`,
  });
}

export async function getOpsDashboard(
  client: SupabaseClient,
  options?: { vertical?: OpsVertical | null }
) {
  const vertical = options?.vertical ?? null;
  let approvals = client
    .from("ops_approval_queue")
    .select("id", { count: "exact", head: true })
    .in("status", ["pending", "assigned", "held", "escalated"]);
  let exceptions = client
    .from("ops_exception_queue")
    .select("id", { count: "exact", head: true })
    .in("status", ["open", "assigned", "investigating", "escalated"]);
  let cases = client
    .from("ops_cases")
    .select("id", { count: "exact", head: true })
    .not("status", "in", '("resolved","closed")');
  if (vertical) {
    approvals = approvals.eq("vertical", vertical);
    exceptions = exceptions.eq("vertical", vertical);
    cases = cases.eq("vertical", vertical);
  }

  const [
    { count: pendingApprovals },
    { count: openExceptions },
    { count: openCases },
    { count: openIncidents },
    { count: openRisk },
    { count: openHolds },
    { count: privacyOpen },
    { count: deadLetters },
    { count: supportSignals },
  ] = await Promise.all([
    approvals,
    exceptions,
    cases,
    client
      .from("incident_signals")
      .select("id", { count: "exact", head: true })
      .in("status", ["candidate", "acknowledged", "investigating"]),
    client
      .from("risk_signals")
      .select("id", { count: "exact", head: true })
      .eq("review_status", "open"),
    client
      .from("compliance_holds")
      .select("id", { count: "exact", head: true })
      .eq("status", "active"),
    client
      .from("privacy_requests")
      .select("id", { count: "exact", head: true })
      .in("status", ["received", "under_review", "needs_info"]),
    client
      .from("notification_dead_letters")
      .select("id", { count: "exact", head: true })
      .eq("disposition", "open"),
    client
      .from("customer_support_signals")
      .select("id", { count: "exact", head: true })
      .eq("status", "queued_for_phase13"),
  ]);

  return {
    ruleVersion: PHASE13_RULE_VERSION,
    vertical,
    cards: {
      pendingApprovals: pendingApprovals ?? 0,
      openExceptions: openExceptions ?? 0,
      openCases: openCases ?? 0,
      openIncidents: openIncidents ?? 0,
      openRiskSignals: openRisk ?? 0,
      activeComplianceHolds: openHolds ?? 0,
      privacyRequests: privacyOpen ?? 0,
      notificationDeadLetters: deadLetters ?? 0,
      supportSignalsQueued: supportSignals ?? 0,
    },
  };
}

export async function searchOpsEntities(
  client: SupabaseClient,
  query: string,
  limit = 20
) {
  const q = query.trim();
  if (q.length < 2) {
    throw new AppError("VALIDATION_ERROR", "Search query too short", {
      status: 400,
    });
  }
  // Permission-scoped safe lookup — IDs / titles only, no KYC/bank/email dump.
  const [cases, approvals, exceptions] = await Promise.all([
    client
      .from("ops_cases")
      .select("id, case_number, case_type, status, summary, vertical, created_at")
      .or(`case_number.ilike.%${q}%,summary.ilike.%${q}%`)
      .limit(limit),
    client
      .from("ops_approval_queue")
      .select("id, queue_key, title, status, subject_type, subject_id, vertical")
      .or(`title.ilike.%${q}%,subject_id.ilike.%${q}%`)
      .limit(limit),
    client
      .from("ops_exception_queue")
      .select("id, exception_key, title, status, severity, vertical")
      .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
      .limit(limit),
  ]);

  return {
    cases: cases.data ?? [],
    approvals: approvals.data ?? [],
    exceptions: exceptions.data ?? [],
  };
}

export async function enqueueApproval(
  client: SupabaseClient,
  input: {
    queueKey: string;
    subjectType: string;
    subjectId: string;
    vertical: OpsVertical;
    title: string;
    requesterUserId?: string | null;
    policyVersion?: string | null;
    domainAction?: string | null;
    metadata?: Json;
    idempotencyKey: string;
  }
) {
  await requireFlag(client, "ops_approval_queues");
  const { data, error } = await client
    .from("ops_approval_queue")
    .upsert(
      {
        queue_key: input.queueKey,
        subject_type: input.subjectType,
        subject_id: input.subjectId,
        vertical: input.vertical,
        title: input.title,
        requester_user_id: input.requesterUserId ?? null,
        policy_version: input.policyVersion ?? null,
        domain_action: input.domainAction ?? null,
        metadata: input.metadata ?? {},
        idempotency_key: input.idempotencyKey,
        status: "pending",
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();
  if (error) {
    const existing = await client
      .from("ops_approval_queue")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data) return { item: existing.data, created: false };
    throw new AppError("INTERNAL_ERROR", "Failed to enqueue approval", {
      cause: error,
    });
  }
  if (!data) {
    const existing = await client
      .from("ops_approval_queue")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .single();
    return { item: existing.data!, created: false };
  }
  return { item: data, created: true };
}

export async function getApprovalQueue(
  client: SupabaseClient,
  filters?: { vertical?: OpsVertical | null; status?: string | null }
) {
  let q = client
    .from("ops_approval_queue")
    .select("*")
    .order("created_at", { ascending: true })
    .limit(100);
  if (filters?.vertical) q = q.eq("vertical", filters.vertical);
  if (filters?.status) q = q.eq("status", filters.status);
  else q = q.in("status", ["pending", "assigned", "held", "escalated"]);
  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load approval queue", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function reviewApproval(
  client: SupabaseClient,
  input: {
    approvalId: string;
    actorUserId: string;
    decision: "approve" | "reject" | "request_changes" | "hold" | "escalate";
    decisionReason: string;
  }
) {
  await requireFlag(client, "ops_approval_queues");
  requireReason(input.decisionReason);

  const { data: item, error } = await client
    .from("ops_approval_queue")
    .select("*")
    .eq("id", input.approvalId)
    .single();
  if (error || !item) throw new AppError("NOT_FOUND", "Approval item not found");

  assertOpsNotSelfApproval(input.actorUserId, item.requester_user_id);

  if (["approved", "rejected", "cancelled"].includes(item.status)) {
    return { item, alreadyDecided: true };
  }

  const statusMap = {
    approve: "approved",
    reject: "rejected",
    request_changes: "changes_requested",
    hold: "held",
    escalate: "escalated",
  } as const;

  const { data: updated, error: upErr } = await client
    .from("ops_approval_queue")
    .update({
      status: statusMap[input.decision],
      decision_reason: input.decisionReason,
      decided_by: input.actorUserId,
      decided_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.approvalId)
    .select("*")
    .single();
  if (upErr) {
    throw new AppError("INTERNAL_ERROR", "Failed to review approval", {
      cause: upErr,
    });
  }

  await writeAuditEvent(client, {
    action: `ops.approval.${input.decision}`,
    resourceType: "ops_approval_queue",
    resourceId: input.approvalId,
    actorUserId: input.actorUserId,
    before: { status: item.status },
    after: { status: updated.status },
    reason: input.decisionReason,
    source: "phase13",
  });
  await emitOpsAnalytics(
    client,
    "approval_completed",
    { id: input.approvalId, decision: input.decision, queueKey: item.queue_key },
    input.actorUserId
  );
  return { item: updated, alreadyDecided: false };
}

export async function enqueueException(
  client: SupabaseClient,
  input: {
    exceptionKey: string;
    source: string;
    title: string;
    summary: string;
    vertical?: OpsVertical;
    severity?: string;
    subjectType?: string | null;
    subjectId?: string | null;
    metadata?: Json;
    idempotencyKey: string;
  }
) {
  await requireFlag(client, "ops_exception_queues");
  const { data, error } = await client
    .from("ops_exception_queue")
    .upsert(
      {
        exception_key: input.exceptionKey,
        source: input.source,
        title: input.title,
        summary: input.summary,
        vertical: input.vertical ?? "platform",
        severity: input.severity ?? "medium",
        subject_type: input.subjectType ?? null,
        subject_id: input.subjectId ?? null,
        metadata: input.metadata ?? {},
        idempotency_key: input.idempotencyKey,
        status: "open",
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();
  if (error) {
    const existing = await client
      .from("ops_exception_queue")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data) return { item: existing.data, created: false };
    throw new AppError("INTERNAL_ERROR", "Failed to enqueue exception", {
      cause: error,
    });
  }
  return { item: data, created: Boolean(data) };
}

export async function getExceptionQueue(
  client: SupabaseClient,
  filters?: { vertical?: OpsVertical | null }
) {
  let q = client
    .from("ops_exception_queue")
    .select("*")
    .in("status", ["open", "assigned", "investigating", "escalated"])
    .order("created_at", { ascending: true })
    .limit(100);
  if (filters?.vertical) q = q.eq("vertical", filters.vertical);
  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load exceptions", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function resolveException(
  client: SupabaseClient,
  input: {
    exceptionId: string;
    actorUserId: string;
    resolution: string;
    status?: "resolved" | "dismissed" | "escalated";
  }
) {
  requireReason(input.resolution);
  const { data, error } = await client
    .from("ops_exception_queue")
    .update({
      status: input.status ?? "resolved",
      resolution: input.resolution,
      resolved_by: input.actorUserId,
      resolved_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.exceptionId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to resolve exception", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: "ops.exception.resolved",
    resourceType: "ops_exception_queue",
    resourceId: input.exceptionId,
    actorUserId: input.actorUserId,
    reason: input.resolution,
    source: "phase13",
  });
  await emitOpsAnalytics(
    client,
    "exception_resolved",
    { id: input.exceptionId, status: data.status },
    input.actorUserId
  );
  return data;
}

export async function createCase(
  client: SupabaseClient,
  input: {
    caseType: OpsCaseType;
    vertical: OpsVertical;
    summary: string;
    requesterUserId?: string | null;
    subjectUserId?: string | null;
    ownerUserId?: string | null;
    priority?: string;
    severity?: string;
    linkedDomainTable?: string | null;
    linkedDomainId?: string | null;
    organisationId?: string | null;
    metadata?: Json;
    actorUserId: string;
  }
) {
  await requireFlag(client, "ops_case_management");
  requireReason(input.summary, 5);

  const { data: numberRow } = await client.rpc("gce_next_ops_case_number");
  const caseNumber =
    (numberRow as string | null) ?? `OPS-${Date.now()}`;

  const { data, error } = await client
    .from("ops_cases")
    .insert({
      case_number: caseNumber,
      case_type: input.caseType,
      vertical: input.vertical,
      summary: input.summary,
      requester_user_id: input.requesterUserId ?? input.actorUserId,
      subject_user_id: input.subjectUserId ?? null,
      owner_user_id: input.ownerUserId ?? null,
      priority: input.priority ?? "normal",
      severity: input.severity ?? "informational",
      linked_domain_table: input.linkedDomainTable ?? null,
      linked_domain_id: input.linkedDomainId ?? null,
      organisation_id: input.organisationId ?? null,
      metadata: input.metadata ?? {},
      status: input.ownerUserId ? "assigned" : "open",
      sla_label: "operational_recommendation",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create case", {
      cause: error,
    });
  }

  await client.from("ops_case_events").insert({
    case_id: data.id,
    event_type: "case_created",
    actor_user_id: input.actorUserId,
    to_status: data.status,
    details: { caseType: input.caseType },
  });
  await writeAuditEvent(client, {
    action: "ops.case.created",
    resourceType: "ops_case",
    resourceId: data.id,
    actorUserId: input.actorUserId,
    after: { caseNumber: data.case_number, status: data.status },
    source: "phase13",
  });
  await emitOpsAnalytics(
    client,
    "case_created",
    { id: data.id, caseType: input.caseType, vertical: input.vertical },
    input.actorUserId
  );
  return data;
}

export async function listCases(
  client: SupabaseClient,
  filters?: {
    vertical?: OpsVertical | null;
    status?: string | null;
    ownerUserId?: string | null;
  }
) {
  let q = client
    .from("ops_cases")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(100);
  if (filters?.vertical) q = q.eq("vertical", filters.vertical);
  if (filters?.status) q = q.eq("status", filters.status);
  if (filters?.ownerUserId) q = q.eq("owner_user_id", filters.ownerUserId);
  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list cases", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function assignCase(
  client: SupabaseClient,
  input: {
    caseId: string;
    actorUserId: string;
    ownerUserId: string;
    reason?: string;
  }
) {
  const { data: current } = await client
    .from("ops_cases")
    .select("*")
    .eq("id", input.caseId)
    .single();
  if (!current) throw new AppError("NOT_FOUND", "Case not found");

  const { data, error } = await client
    .from("ops_cases")
    .update({
      owner_user_id: input.ownerUserId,
      status: current.status === "open" ? "assigned" : current.status,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.caseId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to assign case", {
      cause: error,
    });
  }
  await client.from("ops_case_events").insert({
    case_id: input.caseId,
    event_type: "case_assigned",
    actor_user_id: input.actorUserId,
    from_status: current.status,
    to_status: data.status,
    details: { ownerUserId: input.ownerUserId, reason: input.reason ?? null },
  });
  await writeAuditEvent(client, {
    action: "ops.case.assigned",
    resourceType: "ops_case",
    resourceId: input.caseId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    source: "phase13",
  });
  return data;
}

export async function transitionCase(
  client: SupabaseClient,
  input: {
    caseId: string;
    actorUserId: string;
    toStatus: OpsCaseStatus;
    reason?: string;
    resolutionSummary?: string | null;
  }
) {
  const { data: current } = await client
    .from("ops_cases")
    .select("*")
    .eq("id", input.caseId)
    .single();
  if (!current) throw new AppError("NOT_FOUND", "Case not found");

  const from = current.status as OpsCaseStatus;
  const allowed = ALLOWED_CASE_TRANSITIONS[from] ?? [];
  if (!allowed.includes(input.toStatus)) {
    throw new AppError(
      "VALIDATION_ERROR",
      `Invalid transition ${from} → ${input.toStatus}`,
      { status: 400 }
    );
  }

  const patch: Record<string, unknown> = {
    status: input.toStatus,
    updated_at: new Date().toISOString(),
  };
  if (input.toStatus === "resolved") {
    patch.resolved_at = new Date().toISOString();
    patch.resolution_summary = input.resolutionSummary ?? input.reason ?? null;
  }
  if (input.toStatus === "closed") {
    patch.closed_at = new Date().toISOString();
  }
  if (input.toStatus === "escalated") {
    patch.escalation_level = (current.escalation_level ?? 0) + 1;
  }

  const { data, error } = await client
    .from("ops_cases")
    .update(patch)
    .eq("id", input.caseId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to transition case", {
      cause: error,
    });
  }
  await client.from("ops_case_events").insert({
    case_id: input.caseId,
    event_type: "case_status_changed",
    actor_user_id: input.actorUserId,
    from_status: from,
    to_status: input.toStatus,
    details: { reason: input.reason ?? null },
  });
  await writeAuditEvent(client, {
    action: "ops.case.transitioned",
    resourceType: "ops_case",
    resourceId: input.caseId,
    actorUserId: input.actorUserId,
    before: { status: from },
    after: { status: input.toStatus },
    reason: input.reason,
    source: "phase13",
  });
  if (input.toStatus === "resolved" || input.toStatus === "closed") {
    await emitOpsAnalytics(
      client,
      "case_resolved",
      { id: input.caseId, status: input.toStatus },
      input.actorUserId
    );
  }
  return data;
}

export async function addCaseNote(
  client: SupabaseClient,
  input: {
    caseId: string;
    authorUserId: string;
    body: string;
    visibility?: "internal" | "customer_visible";
  }
) {
  requireReason(input.body, 3);
  const visibility = input.visibility ?? "internal";
  const { data, error } = await client
    .from("ops_case_notes")
    .insert({
      case_id: input.caseId,
      author_user_id: input.authorUserId,
      body: input.body,
      visibility,
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to add case note", {
      cause: error,
    });
  }
  await client.from("ops_case_events").insert({
    case_id: input.caseId,
    event_type: "note_added",
    actor_user_id: input.authorUserId,
    details: { visibility, noteId: data.id },
  });
  return data;
}

export async function createOperationalOverride(
  client: SupabaseClient,
  input: {
    category: OverrideCategory;
    subjectType: string;
    subjectId: string;
    reason: string;
    previousState?: Json;
    intendedState?: Json;
    requesterUserId: string;
    requiresSecondApprover?: boolean;
  }
) {
  await requireFlag(client, "ops_manual_overrides");
  requireReason(input.reason);
  // Never a generic force-update — typed categories only; finance remains immutable.
  const { data, error } = await client
    .from("ops_overrides")
    .insert({
      override_category: input.category,
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      reason: input.reason,
      previous_state: input.previousState ?? {},
      intended_state: input.intendedState ?? {},
      requester_user_id: input.requesterUserId,
      requires_second_approver: input.requiresSecondApprover ?? true,
      finance_immutable: true,
      status: "requested",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create override request", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: "ops.override.requested",
    resourceType: "ops_override",
    resourceId: data.id,
    actorUserId: input.requesterUserId,
    reason: input.reason,
    metadata: { category: input.category },
    source: "phase13",
  });
  return data;
}

export async function reviewOperationalOverride(
  client: SupabaseClient,
  input: {
    overrideId: string;
    actorUserId: string;
    decision: "approve" | "reject";
    reason: string;
  }
) {
  requireReason(input.reason);
  const { data: item } = await client
    .from("ops_overrides")
    .select("*")
    .eq("id", input.overrideId)
    .single();
  if (!item) throw new AppError("NOT_FOUND", "Override not found");
  assertOpsNotSelfApproval(input.actorUserId, item.requester_user_id);

  const { data, error } = await client
    .from("ops_overrides")
    .update({
      status: input.decision === "approve" ? "approved" : "rejected",
      approver_user_id: input.actorUserId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.overrideId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to review override", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: `ops.override.${input.decision}`,
    resourceType: "ops_override",
    resourceId: input.overrideId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    source: "phase13",
  });
  return data;
}

export async function applyModerationAction(
  client: SupabaseClient,
  input: {
    subjectType: string;
    subjectId: string;
    action: "flag" | "review" | "hide" | "suspend" | "restore" | "dismiss";
    reason: string;
    actorUserId: string;
    metadata?: Json;
  }
) {
  await requireFlag(client, "ops_moderation");
  requireReason(input.reason, 5);
  const { data, error } = await client
    .from("ops_moderation_actions")
    .insert({
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      action: input.action,
      reason: input.reason,
      actor_user_id: input.actorUserId,
      metadata: input.metadata ?? {},
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to record moderation", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: `ops.moderation.${input.action}`,
    resourceType: input.subjectType,
    resourceId: input.subjectId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    source: "phase13",
  });
  return data;
}

export async function applyScopedSuspension(
  client: SupabaseClient,
  input: {
    scope: "identity" | "role_assignment";
    targetId: string;
    actorUserId: string;
    reason: string;
    actorAssignments?: import("../types").RoleAssignment[];
  }
) {
  requireReason(input.reason);
  if (input.scope === "identity") {
    if (input.targetId === input.actorUserId) {
      throw new AppError("FORBIDDEN", "Self-suspension is not permitted", {
        status: 403,
      });
    }
    return suspendIdentity(client, {
      userId: input.targetId,
      actorUserId: input.actorUserId,
      reason: input.reason,
    });
  }
  if (!input.actorAssignments) {
    throw new AppError(
      "VALIDATION_ERROR",
      "actorAssignments required for role suspension",
      { status: 400 }
    );
  }
  return suspendRoleAssignment(client, {
    assignmentId: input.targetId,
    actorUserId: input.actorUserId,
    actorAssignments: input.actorAssignments,
    reason: input.reason,
  });
}

export async function requestTermination(
  client: SupabaseClient,
  input: {
    assignmentId: string;
    actorUserId: string;
    reason: string;
    actorAssignments: import("../types").RoleAssignment[];
  }
) {
  requireReason(input.reason);
  const result = await terminateRoleAssignment(client, {
    assignmentId: input.assignmentId,
    actorUserId: input.actorUserId,
    actorAssignments: input.actorAssignments,
    reason: input.reason,
  });
  await writeAuditEvent(client, {
    action: "ops.termination.requested",
    resourceType: "role_assignment",
    resourceId: input.assignmentId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    source: "phase13",
  });
  return result;
}

export async function acknowledgeIncident(
  client: SupabaseClient,
  input: {
    incidentId: string;
    actorUserId: string;
    note?: string | null;
  }
) {
  await requireFlag(client, "ops_incident_console");
  const { data, error } = await client
    .from("incident_signals")
    .update({
      status: "acknowledged",
      owner_user_id: input.actorUserId,
      acknowledged_at: new Date().toISOString(),
      last_seen_at: new Date().toISOString(),
    })
    .eq("id", input.incidentId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to acknowledge incident", {
      cause: error,
    });
  }
  await client.from("ops_incident_actions").insert({
    incident_id: input.incidentId,
    action: "acknowledge",
    actor_user_id: input.actorUserId,
    note: input.note ?? null,
  });
  await writeAuditEvent(client, {
    action: "ops.incident.acknowledged",
    resourceType: "incident_signal",
    resourceId: input.incidentId,
    actorUserId: input.actorUserId,
    source: "phase13",
  });
  await emitOpsAnalytics(
    client,
    "incident_acknowledged",
    { id: input.incidentId },
    input.actorUserId
  );
  return data;
}

export async function resolveIncident(
  client: SupabaseClient,
  input: {
    incidentId: string;
    actorUserId: string;
    resolutionRef: string;
    note?: string | null;
  }
) {
  requireReason(input.resolutionRef, 3);
  const { data, error } = await client
    .from("incident_signals")
    .update({
      status: "resolved",
      resolved_at: new Date().toISOString(),
      resolution_ref: input.resolutionRef,
      last_seen_at: new Date().toISOString(),
    })
    .eq("id", input.incidentId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to resolve incident", {
      cause: error,
    });
  }
  await client.from("ops_incident_actions").insert({
    incident_id: input.incidentId,
    action: "resolve",
    actor_user_id: input.actorUserId,
    note: input.note ?? input.resolutionRef,
  });
  await writeAuditEvent(client, {
    action: "ops.incident.resolved",
    resourceType: "incident_signal",
    resourceId: input.incidentId,
    actorUserId: input.actorUserId,
    reason: input.resolutionRef,
    source: "phase13",
  });
  return data;
}

export async function reviewRiskSignalOps(
  client: SupabaseClient,
  input: {
    signalId: string;
    actorUserId: string;
    reviewStatus: "in_review" | "cleared" | "actioned" | "escalated";
    note: string;
    applyHold?: {
      subjectType: string;
      subjectId: string;
      reason: string;
    } | null;
  }
) {
  requireReason(input.note);
  const { data, error } = await client
    .from("risk_signals")
    .update({
      review_status: input.reviewStatus,
      reviewed_by: input.actorUserId,
      reviewed_at: new Date().toISOString(),
      // Never escalate auto action beyond flag_only
      auto_action_applied: "flag_only",
    })
    .eq("id", input.signalId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to review risk signal", {
      cause: error,
    });
  }

  let hold = null;
  if (input.applyHold && input.reviewStatus === "actioned") {
    hold = await createComplianceHold(client, {
      subjectType: input.applyHold.subjectType,
      subjectId: input.applyHold.subjectId,
      reason: input.applyHold.reason,
      createdBy: input.actorUserId,
    });
  }

  await writeAuditEvent(client, {
    action: "ops.risk.reviewed",
    resourceType: "risk_signal",
    resourceId: input.signalId,
    actorUserId: input.actorUserId,
    reason: input.note,
    after: { reviewStatus: input.reviewStatus, holdId: hold?.id ?? null },
    source: "phase13",
  });
  return { signal: data, hold };
}

export async function processRefundReview(
  client: SupabaseClient,
  input: {
    refundRequestId: string;
    actorUserId: string;
    decision: "under_review" | "approved_for_finance" | "rejected";
    reason: string;
  }
) {
  requireReason(input.reason);
  // Do not invent refund % — route to Finance/manual review boundary only.
  const statusMap = {
    under_review: "under_review",
    approved_for_finance: "approved",
    rejected: "rejected",
  } as const;

  const { data: current } = await client
    .from("customer_refund_requests")
    .select("*")
    .eq("id", input.refundRequestId)
    .maybeSingle();
  if (!current) throw new AppError("NOT_FOUND", "Refund request not found");

  const { data, error } = await client
    .from("customer_refund_requests")
    .update({
      status: statusMap[input.decision],
      amount_determination: "manual_review_required",
      review_notes: input.reason,
      reviewed_by: input.actorUserId,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.refundRequestId)
    .select("*")
    .maybeSingle();

  if (error) {
    // Column set may differ; fall back to status-only if needed
    throw new AppError("INTERNAL_ERROR", "Failed to review refund request", {
      cause: error,
      details: {
        note: "Refund economics remain OD-006 manual_review_required",
      },
    });
  }

  await writeAuditEvent(client, {
    action: `ops.refund.${input.decision}`,
    resourceType: "customer_refund_request",
    resourceId: input.refundRequestId,
    actorUserId: input.actorUserId,
    reason: input.reason,
    metadata: { amountDetermination: "manual_review_required" },
    source: "phase13",
  });
  return data ?? current;
}

export async function promoteSupportSignalToCase(
  client: SupabaseClient,
  input: { signalId: string; actorUserId: string }
) {
  const { data: signal } = await client
    .from("customer_support_signals")
    .select("*")
    .eq("id", input.signalId)
    .single();
  if (!signal) throw new AppError("NOT_FOUND", "Support signal not found");
  if (signal.ops_case_id) {
    const existing = await client
      .from("ops_cases")
      .select("*")
      .eq("id", signal.ops_case_id)
      .single();
    return existing.data;
  }

  const created = await createCase(client, {
    caseType: "general_support",
    vertical: "support",
    summary: String(signal.message ?? "Customer support signal"),
    requesterUserId: signal.user_id,
    actorUserId: input.actorUserId,
    linkedDomainTable: "customer_support_signals",
    linkedDomainId: signal.id,
    metadata: {
      bookingId: signal.booking_id,
      claimId: signal.claim_id,
      eventId: signal.event_id,
    },
  });

  await client
    .from("customer_support_signals")
    .update({ status: "promoted_to_case", ops_case_id: created.id })
    .eq("id", input.signalId);

  return created;
}

export async function getEntityTimeline(
  client: SupabaseClient,
  input: { resourceType: string; resourceId: string; limit?: number }
) {
  const { data, error } = await client
    .from("audit_events")
    .select(
      "id, occurred_at, actor_user_id, action, resource_type, resource_id, reason, source, correlation_id"
    )
    .eq("resource_type", input.resourceType)
    .eq("resource_id", input.resourceId)
    .order("occurred_at", { ascending: false })
    .limit(input.limit ?? 50);
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load timeline", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function notifyCaseAssigned(
  client: SupabaseClient,
  caseRow: { id: string; owner_user_id: string | null; case_number: string }
) {
  if (!caseRow.owner_user_id) return null;
  const intent = await createNotificationIntent(client, {
    recipientUserId: caseRow.owner_user_id,
    templateKey: "security.notice",
    channel: "in_app",
    category: "operational",
    payload: { summary: `Case ${caseRow.case_number} assigned to you` },
    deepLink: `/ops/cases/${caseRow.id}`,
    sourceDomain: "phase13",
    sourceEventId: caseRow.id,
    idempotencyKey: `ops13:case-assigned:${caseRow.id}:${caseRow.owner_user_id}`,
  });
  if (!intent.suppressed && intent.intent?.id) {
    await dispatchNotificationIntent(client, intent.intent.id);
  }
  return intent;
}

// Re-export compliance helpers used by API
export {
  createComplianceHold,
  releaseComplianceHold,
  reviewPrivacyRequest,
  createRiskSignal,
};
