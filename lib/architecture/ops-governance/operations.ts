import type { SupabaseClient } from "@supabase/supabase-js";
import { createHash } from "crypto";
import { AppError } from "../errors";
import { isFeatureEnabled } from "../feature-flags/flags";
import { writeAuditEvent } from "../audit/write";
import { enqueueBackgroundJob } from "../jobs/queue";
import {
  ANALYTICS_FORBIDDEN_PAYLOAD_KEYS,
  JOB_TYPES,
  LIVE_PROVIDER_FLAGS_MUST_STAY_OFF,
  MAX_NOTIFICATION_ATTEMPTS,
  PHASE12_MONEY_FLAGS_MUST_STAY_OFF,
  NON_OPTIONAL_CATEGORIES,
  PHASE12_RULE_VERSION,
  RETRY_BACKOFF_BASE_MS,
  type NotificationCategory,
  type NotificationChannel,
  type SecuritySeverity,
} from "./constants";
import type { EmailProvider, PushProvider, SmsProvider } from "./providers";
import {
  createEmailProvider,
  createPushProvider,
  createSmsProvider,
} from "./providers";

type Json = Record<string, unknown>;

function renderTemplate(template: string, vars: Json): string {
  return template.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key: string) => {
    const value = vars[key];
    if (value == null) return "";
    return String(value).slice(0, 500);
  });
}

function sanitizeDeepLink(link: string | null | undefined): string | null {
  if (!link) return null;
  if (link.startsWith("/") && !link.startsWith("//")) return link.slice(0, 500);
  return null;
}

export function minimiseAnalyticsPayload(input: Json): Json {
  const out: Json = {};
  for (const [k, v] of Object.entries(input)) {
    if (
      ANALYTICS_FORBIDDEN_PAYLOAD_KEYS.some((f) =>
        k.toLowerCase().includes(f.toLowerCase())
      )
    ) {
      continue;
    }
    if (typeof v === "string" && v.length > 200) {
      out[k] = v.slice(0, 200);
      continue;
    }
    if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = minimiseAnalyticsPayload(v as Json);
      continue;
    }
    out[k] = v;
  }
  return out;
}

export async function assertPhase12ProviderSafety(client: SupabaseClient) {
  const status: Record<string, boolean> = {};
  for (const key of [
    ...LIVE_PROVIDER_FLAGS_MUST_STAY_OFF,
    ...PHASE12_MONEY_FLAGS_MUST_STAY_OFF,
  ]) {
    status[key] = await isFeatureEnabled(
      client,
      key as Parameters<typeof isFeatureEnabled>[1]
    );
    if (status[key]) {
      throw new AppError(
        "CONFIGURATION_ERROR",
        `Unsafe Phase 12/money flag must remain OFF: ${key}`,
        { details: status }
      );
    }
  }
  return status;
}

export async function upsertNotificationPreferences(
  client: SupabaseClient,
  userId: string,
  patch: {
    inAppEnabled?: boolean;
    emailEnabled?: boolean;
    smsEnabled?: boolean;
    pushEnabled?: boolean;
    marketingOptIn?: boolean;
    categoryOverrides?: Json;
  }
) {
  const { data: before } = await client
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();

  const next = {
    user_id: userId,
    in_app_enabled: patch.inAppEnabled ?? before?.in_app_enabled ?? true,
    email_enabled: patch.emailEnabled ?? before?.email_enabled ?? true,
    sms_enabled: patch.smsEnabled ?? before?.sms_enabled ?? false,
    push_enabled: patch.pushEnabled ?? before?.push_enabled ?? false,
    marketing_opt_in: patch.marketingOptIn ?? before?.marketing_opt_in ?? false,
    category_overrides:
      patch.categoryOverrides ?? before?.category_overrides ?? {},
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from("notification_preferences")
    .upsert(next, { onConflict: "user_id" })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to upsert preferences", {
      cause: error,
    });
  }

  await client.from("notification_preference_events").insert({
    user_id: userId,
    actor_user_id: userId,
    before_data: before ?? null,
    after_data: data,
  });
  await writeAuditEvent(client, {
    action: "notification.preferences.updated",
    resourceType: "notification_preferences",
    resourceId: userId,
    actorUserId: userId,
    before: before ?? undefined,
    after: data,
    source: "phase12",
  });
  return data;
}

export async function getNotificationPreferences(
  client: SupabaseClient,
  userId: string
) {
  const { data } = await client
    .from("notification_preferences")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (data) return data;
  return upsertNotificationPreferences(client, userId, {});
}

function channelAllowedByPrefs(
  channel: NotificationChannel,
  category: NotificationCategory,
  prefs: {
    in_app_enabled: boolean;
    email_enabled: boolean;
    sms_enabled: boolean;
    push_enabled: boolean;
    marketing_opt_in: boolean;
  }
): { allowed: boolean; reason?: string } {
  if (NON_OPTIONAL_CATEGORIES.includes(category)) {
    if (channel === "in_app") return { allowed: true };
    // Security/transactional may still use email/SMS when enabled, but not marketing rules.
  }
  if (category === "marketing") {
    if (!prefs.marketing_opt_in) {
      return { allowed: false, reason: "marketing_opt_out" };
    }
  }
  if (channel === "in_app" && !prefs.in_app_enabled && category === "marketing") {
    return { allowed: false, reason: "in_app_disabled" };
  }
  if (channel === "email" && !prefs.email_enabled && category !== "security") {
    return { allowed: false, reason: "email_disabled" };
  }
  if (channel === "sms" && !prefs.sms_enabled && category !== "security") {
    return { allowed: false, reason: "sms_disabled" };
  }
  if (channel === "push" && !prefs.push_enabled && category !== "security") {
    return { allowed: false, reason: "push_disabled" };
  }
  return { allowed: true };
}

export async function createNotificationIntent(
  client: SupabaseClient,
  input: {
    recipientUserId: string;
    templateKey: string;
    channel: NotificationChannel;
    category: NotificationCategory;
    payload?: Json;
    deepLink?: string | null;
    sourceEventId?: string | null;
    sourceDomain?: string | null;
    priority?: "low" | "normal" | "high" | "critical";
    idempotencyKey: string;
    correlationId?: string;
    locale?: string;
  }
) {
  if (input.category === "marketing") {
    const marketingOn = await isFeatureEnabled(client, "marketing_notifications");
    if (!marketingOn) {
      return { suppressed: true as const, reason: "marketing_flag_off" };
    }
  }

  const channelFlag =
    input.channel === "in_app"
      ? "notifications_in_app"
      : input.channel === "email"
        ? "notifications_email_sandbox"
        : input.channel === "sms"
          ? "notifications_sms_sandbox"
          : "notifications_push_sandbox";
  if (!(await isFeatureEnabled(client, channelFlag as never))) {
    return { suppressed: true as const, reason: `flag_off:${channelFlag}` };
  }

  const prefs = await getNotificationPreferences(client, input.recipientUserId);
  const gate = channelAllowedByPrefs(input.channel, input.category, prefs);
  if (!gate.allowed) {
    const { data: suppressed } = await client
      .from("notification_intents")
      .upsert(
        {
          recipient_user_id: input.recipientUserId,
          template_key: input.templateKey,
          channel: input.channel,
          category: input.category,
          payload: input.payload ?? {},
          deep_link: sanitizeDeepLink(input.deepLink),
          source_event_id: input.sourceEventId ?? null,
          source_domain: input.sourceDomain ?? null,
          priority: input.priority ?? "normal",
          status: "suppressed",
          idempotency_key: input.idempotencyKey,
          correlation_id: input.correlationId ?? null,
          locale: input.locale ?? "en-IN",
          last_error: gate.reason,
        },
        { onConflict: "idempotency_key", ignoreDuplicates: true }
      )
      .select("*")
      .maybeSingle();
    return { suppressed: true as const, reason: gate.reason, intent: suppressed };
  }

  const { data, error } = await client
    .from("notification_intents")
    .upsert(
      {
        recipient_user_id: input.recipientUserId,
        template_key: input.templateKey,
        channel: input.channel,
        category: input.category,
        payload: input.payload ?? {},
        deep_link: sanitizeDeepLink(input.deepLink),
        source_event_id: input.sourceEventId ?? null,
        source_domain: input.sourceDomain ?? null,
        priority: input.priority ?? "normal",
        status: "pending",
        idempotency_key: input.idempotencyKey,
        correlation_id: input.correlationId ?? null,
        locale: input.locale ?? "en-IN",
        next_attempt_at: new Date().toISOString(),
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();

  if (error) {
    const existing = await client
      .from("notification_intents")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data) return { suppressed: false as const, intent: existing.data, created: false };
    throw new AppError("INTERNAL_ERROR", "Failed to create notification intent", {
      cause: error,
    });
  }

  let intent = data;
  if (!intent) {
    const existing = await client
      .from("notification_intents")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .single();
    intent = existing.data;
  }

  await enqueueBackgroundJob(client, {
    jobType: JOB_TYPES.notificationDispatch,
    idempotencyKey: `dispatch:${input.idempotencyKey}`,
    payload: { intentId: intent!.id },
  });

  return { suppressed: false as const, intent: intent!, created: true };
}

async function loadActiveTemplate(
  client: SupabaseClient,
  templateKey: string,
  channel: string,
  locale: string
) {
  const { data } = await client
    .from("notification_templates")
    .select("*")
    .eq("template_key", templateKey)
    .eq("channel", channel)
    .eq("locale", locale)
    .eq("is_active", true)
    .order("version", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function dispatchNotificationIntent(
  client: SupabaseClient,
  intentId: string,
  providers?: {
    email?: EmailProvider;
    sms?: SmsProvider;
    push?: PushProvider;
  }
) {
  await assertPhase12ProviderSafety(client);

  const { data: intent, error } = await client
    .from("notification_intents")
    .select("*")
    .eq("id", intentId)
    .single();
  if (error || !intent) {
    throw new AppError("NOT_FOUND", "Notification intent not found");
  }
  if (["delivered", "suppressed", "cancelled", "dead_letter"].includes(intent.status)) {
    return { skipped: true, status: intent.status };
  }

  const template = await loadActiveTemplate(
    client,
    intent.template_key,
    intent.channel,
    intent.locale
  );
  if (!template) {
    await failIntent(client, intent, "template_missing", true);
    return { skipped: false, status: "dead_letter" };
  }

  const vars = (intent.payload ?? {}) as Json;
  const title = renderTemplate(template.title_template, vars);
  const body = renderTemplate(template.body_template, vars);
  const subject = template.subject_template
    ? renderTemplate(template.subject_template, vars)
    : title;

  await client
    .from("notification_intents")
    .update({
      status: "dispatching",
      template_version: template.version,
      provider:
        intent.channel === "in_app"
          ? "in_app"
          : intent.channel === "email"
            ? "sandbox_email"
            : intent.channel === "sms"
              ? "sandbox_sms"
              : "sandbox_push",
      attempt_count: intent.attempt_count + 1,
      updated_at: new Date().toISOString(),
    })
    .eq("id", intentId);

  try {
    if (intent.channel === "in_app") {
      await client.from("in_app_notifications").insert({
        recipient_user_id: intent.recipient_user_id,
        intent_id: intent.id,
        notification_type: intent.template_key,
        category: intent.category,
        title,
        body,
        deep_link: intent.deep_link,
        source_entity_type: intent.source_domain,
        source_entity_id: intent.source_event_id,
        priority: intent.priority,
      });
      await client.from("notification_deliveries").insert({
        intent_id: intent.id,
        channel: "in_app",
        provider: "in_app",
        status: "delivered",
        response: { ok: true },
      });
    } else if (intent.channel === "email") {
      const email = providers?.email ?? createEmailProvider("sandbox");
      const result = await email.send({
        toUserId: intent.recipient_user_id,
        subject,
        body,
        idempotencyKey: intent.idempotency_key,
        templateKey: intent.template_key,
      });
      await client.from("notification_deliveries").insert({
        intent_id: intent.id,
        channel: "email",
        provider: result.provider,
        provider_message_id: result.messageId,
        status: result.ok ? "sent" : "failed",
        response: result.response,
      });
      if (!result.ok) throw new Error(result.error ?? "email_failed");
    } else if (intent.channel === "sms") {
      const sms = providers?.sms ?? createSmsProvider("sandbox");
      const result = await sms.send({
        toUserId: intent.recipient_user_id,
        body,
        idempotencyKey: intent.idempotency_key,
        templateKey: intent.template_key,
      });
      await client.from("notification_deliveries").insert({
        intent_id: intent.id,
        channel: "sms",
        provider: result.provider,
        provider_message_id: result.messageId,
        status: result.ok ? "sent" : "failed",
        response: result.response,
      });
      if (!result.ok) throw new Error(result.error ?? "sms_failed");
    } else if (intent.channel === "push") {
      const push = providers?.push ?? createPushProvider("sandbox");
      const result = await push.send({
        toUserId: intent.recipient_user_id,
        title,
        body,
        deepLink: intent.deep_link,
        idempotencyKey: intent.idempotency_key,
      });
      await client.from("notification_deliveries").insert({
        intent_id: intent.id,
        channel: "push",
        provider: result.provider,
        provider_message_id: result.messageId,
        status: result.ok ? "sent" : "failed",
        response: result.response,
      });
      if (!result.ok) throw new Error(result.error ?? "push_failed");
    }

    await client
      .from("notification_intents")
      .update({
        status: "delivered",
        delivered_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", intentId);

    return { skipped: false, status: "delivered" };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    const permanent =
      message.includes("template_") ||
      message.includes("invalid_recipient") ||
      message.includes("revoked");
    await failIntent(client, intent, message, permanent);
    return { skipped: false, status: permanent ? "dead_letter" : "failed" };
  }
}

async function failIntent(
  client: SupabaseClient,
  intent: { id: string; attempt_count: number; max_attempts?: number },
  errorMessage: string,
  permanent: boolean
) {
  const attempts = intent.attempt_count + 1;
  const max = intent.max_attempts ?? MAX_NOTIFICATION_ATTEMPTS;
  if (permanent || attempts >= max) {
    await client
      .from("notification_intents")
      .update({
        status: "dead_letter",
        last_error: errorMessage,
        attempt_count: attempts,
        updated_at: new Date().toISOString(),
      })
      .eq("id", intent.id);
    await client.from("notification_dead_letters").upsert(
      {
        intent_id: intent.id,
        reason: permanent ? "permanent_failure" : "max_attempts",
        last_error: errorMessage,
        attempt_count: attempts,
        disposition: "open",
      },
      { onConflict: "intent_id" }
    );
    return;
  }
  const backoff = RETRY_BACKOFF_BASE_MS * 2 ** Math.min(attempts - 1, 4);
  const next = new Date(Date.now() + backoff).toISOString();
  await client
    .from("notification_intents")
    .update({
      status: "failed",
      last_error: errorMessage,
      attempt_count: attempts,
      next_attempt_at: next,
      updated_at: new Date().toISOString(),
    })
    .eq("id", intent.id);
  await enqueueBackgroundJob(client, {
    jobType: JOB_TYPES.notificationRetry,
    idempotencyKey: `retry:${intent.id}:${attempts}`,
    availableAt: next,
    payload: { intentId: intent.id },
  });
}

export async function listInAppNotifications(
  client: SupabaseClient,
  userId: string,
  options?: { unreadOnly?: boolean; limit?: number }
) {
  let q = client
    .from("in_app_notifications")
    .select("*")
    .eq("recipient_user_id", userId)
    .is("archived_at", null)
    .order("created_at", { ascending: false })
    .limit(options?.limit ?? 50);
  if (options?.unreadOnly) q = q.is("read_at", null);
  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list notifications", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function markInAppRead(
  client: SupabaseClient,
  userId: string,
  notificationId?: string
) {
  const now = new Date().toISOString();
  let q = client
    .from("in_app_notifications")
    .update({ read_at: now })
    .eq("recipient_user_id", userId)
    .is("read_at", null);
  if (notificationId) q = q.eq("id", notificationId);
  const { error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to mark notifications read", {
      cause: error,
    });
  }
  return { ok: true };
}

export async function ingestAnalyticsEvent(
  client: SupabaseClient,
  input: {
    eventFamily: string;
    eventName: string;
    actorUserId?: string | null;
    subjectType?: string | null;
    subjectId?: string | null;
    organisationId?: string | null;
    vertical?: string | null;
    payload?: Json;
    sourceDomain?: string | null;
    sourceEventId?: string | null;
    idempotencyKey: string;
    occurredAt?: string;
  }
) {
  if (!(await isFeatureEnabled(client, "analytics_pipeline"))) {
    return { skipped: true as const, reason: "analytics_pipeline_off" };
  }
  const payload = minimiseAnalyticsPayload(input.payload ?? {});
  const { data, error } = await client
    .from("analytics_events")
    .upsert(
      {
        event_family: input.eventFamily,
        event_name: input.eventName,
        actor_user_id: input.actorUserId ?? null,
        subject_type: input.subjectType ?? null,
        subject_id: input.subjectId ?? null,
        organisation_id: input.organisationId ?? null,
        vertical: input.vertical ?? null,
        payload,
        source_domain: input.sourceDomain ?? null,
        source_event_id: input.sourceEventId ?? null,
        idempotency_key: input.idempotencyKey,
        occurred_at: input.occurredAt ?? new Date().toISOString(),
        schema_version: 1,
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("id")
    .maybeSingle();
  if (error) {
    const existing = await client
      .from("analytics_events")
      .select("id")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data) return { skipped: false as const, id: existing.data.id, created: false };
    throw new AppError("INTERNAL_ERROR", "Failed to ingest analytics event", {
      cause: error,
    });
  }
  return { skipped: false as const, id: data?.id, created: Boolean(data?.id) };
}

export async function recordSecurityEvent(
  client: SupabaseClient,
  input: {
    eventType: string;
    severity: SecuritySeverity;
    summary: string;
    actorUserId?: string | null;
    subjectType?: string | null;
    subjectId?: string | null;
    workspaceKey?: string | null;
    organisationId?: string | null;
    details?: Json;
    correlationId?: string | null;
    source?: string;
  }
) {
  if (!(await isFeatureEnabled(client, "security_monitoring"))) {
    return { skipped: true as const };
  }
  const details = minimiseAnalyticsPayload(input.details ?? {});
  const { data, error } = await client
    .from("security_events")
    .insert({
      event_type: input.eventType,
      severity: input.severity,
      summary: input.summary.slice(0, 500),
      actor_user_id: input.actorUserId ?? null,
      subject_type: input.subjectType ?? null,
      subject_id: input.subjectId ?? null,
      workspace_key: input.workspaceKey ?? null,
      organisation_id: input.organisationId ?? null,
      details,
      correlation_id: input.correlationId ?? null,
      source: input.source ?? "platform",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to record security event", {
      cause: error,
    });
  }
  if (input.severity === "high" || input.severity === "critical") {
    await upsertOperationalAlert(client, {
      alertKey: `security:${input.eventType}`,
      severity: input.severity,
      title: `Security: ${input.eventType}`,
      summary: input.summary,
      details: { securityEventId: data.id },
    });
  }
  return { skipped: false as const, event: data };
}

export async function createRiskSignal(
  client: SupabaseClient,
  input: {
    signalType: string;
    category?: string;
    subjectType: string;
    subjectId: string;
    actorUserId?: string | null;
    scoreBps?: number;
    recommendation?: "flag" | "hold" | "review" | "escalate" | "ignore";
    details?: Json;
    idempotencyKey: string;
  }
) {
  if (!(await isFeatureEnabled(client, "fraud_review"))) {
    return { skipped: true as const };
  }
  // Never auto-ban / forfeit — flag_only only
  const { data, error } = await client
    .from("risk_signals")
    .upsert(
      {
        signal_type: input.signalType,
        category: input.category ?? "fraud",
        subject_type: input.subjectType,
        subject_id: input.subjectId,
        actor_user_id: input.actorUserId ?? null,
        score_bps: input.scoreBps ?? 0,
        recommendation: input.recommendation ?? "review",
        review_status: "open",
        auto_action_applied: "flag_only",
        details: minimiseAnalyticsPayload(input.details ?? {}),
        idempotency_key: input.idempotencyKey,
      },
      { onConflict: "idempotency_key", ignoreDuplicates: true }
    )
    .select("*")
    .maybeSingle();
  if (error) {
    const existing = await client
      .from("risk_signals")
      .select("*")
      .eq("idempotency_key", input.idempotencyKey)
      .maybeSingle();
    if (existing.data) return { skipped: false as const, signal: existing.data, created: false };
    throw new AppError("INTERNAL_ERROR", "Failed to create risk signal", {
      cause: error,
    });
  }
  return { skipped: false as const, signal: data, created: true };
}

export async function upsertOperationalAlert(
  client: SupabaseClient,
  input: {
    alertKey: string;
    severity: SecuritySeverity;
    title: string;
    summary: string;
    details?: Json;
    thresholdConfig?: Json;
  }
) {
  const { data: existing } = await client
    .from("operational_alerts")
    .select("*")
    .eq("alert_key", input.alertKey)
    .eq("status", "open")
    .maybeSingle();

  if (existing) {
    const { data } = await client
      .from("operational_alerts")
      .update({
        last_seen_at: new Date().toISOString(),
        occurrence_count: existing.occurrence_count + 1,
        summary: input.summary,
        details: { ...(existing.details as Json), ...(input.details ?? {}) },
      })
      .eq("id", existing.id)
      .select("*")
      .single();
    return data;
  }

  const { data, error } = await client
    .from("operational_alerts")
    .insert({
      alert_key: input.alertKey,
      severity: input.severity,
      title: input.title,
      summary: input.summary,
      threshold_config: input.thresholdConfig ?? {},
      details: input.details ?? {},
      status: "open",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create operational alert", {
      cause: error,
    });
  }
  return data;
}

export async function createIncidentSignal(
  client: SupabaseClient,
  input: {
    source: string;
    severity: SecuritySeverity;
    title: string;
    summary: string;
    relatedEventIds?: string[];
  }
) {
  const { data, error } = await client
    .from("incident_signals")
    .insert({
      source: input.source,
      severity: input.severity,
      title: input.title,
      summary: input.summary,
      related_event_ids: input.relatedEventIds ?? [],
      status: "candidate",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create incident signal", {
      cause: error,
    });
  }
  return data;
}

export async function createComplianceHold(
  client: SupabaseClient,
  input: {
    subjectType: string;
    subjectId: string;
    reason: string;
    scope?: string;
    releaseConditions?: string | null;
    createdBy: string;
    metadata?: Json;
  }
) {
  if (!(await isFeatureEnabled(client, "compliance_holds"))) {
    throw new AppError("FEATURE_DISABLED", "Compliance holds disabled");
  }
  const { data, error } = await client
    .from("compliance_holds")
    .insert({
      subject_type: input.subjectType,
      subject_id: input.subjectId,
      reason: input.reason,
      scope: input.scope ?? "scoped",
      release_conditions: input.releaseConditions ?? null,
      created_by: input.createdBy,
      metadata: input.metadata ?? {},
      status: "active",
    })
    .select("*")
    .single();
  if (error) {
    if (error.code === "23505") {
      throw new AppError("CONFLICT", "Active compliance hold already exists", {
        status: 409,
      });
    }
    throw new AppError("INTERNAL_ERROR", "Failed to create compliance hold", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: "compliance.hold.created",
    resourceType: "compliance_hold",
    resourceId: data.id,
    actorUserId: input.createdBy,
    after: { subjectType: input.subjectType, subjectId: input.subjectId },
    source: "phase12",
  });
  return data;
}

export async function releaseComplianceHold(
  client: SupabaseClient,
  holdId: string,
  releasedBy: string
) {
  const { data, error } = await client
    .from("compliance_holds")
    .update({
      status: "released",
      released_by: releasedBy,
      released_at: new Date().toISOString(),
    })
    .eq("id", holdId)
    .eq("status", "active")
    .select("*")
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to release compliance hold", {
      cause: error,
    });
  }
  if (!data) throw new AppError("NOT_FOUND", "Active hold not found");
  await writeAuditEvent(client, {
    action: "compliance.hold.released",
    resourceType: "compliance_hold",
    resourceId: holdId,
    actorUserId: releasedBy,
    source: "phase12",
  });
  return data;
}

export async function logSensitiveAccess(
  client: SupabaseClient,
  input: {
    actorUserId: string;
    recordType: string;
    recordId: string;
    purpose?: string | null;
    workspaceKey?: string | null;
    accessResult?: "success" | "denied";
  }
) {
  const { data, error } = await client
    .from("sensitive_access_events")
    .insert({
      actor_user_id: input.actorUserId,
      record_type: input.recordType,
      record_id: input.recordId,
      purpose: input.purpose ?? null,
      workspace_key: input.workspaceKey ?? null,
      access_result: input.accessResult ?? "success",
    })
    .select("id")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to log sensitive access", {
      cause: error,
    });
  }
  return data;
}

export async function createPrivacyRequest(
  client: SupabaseClient,
  input: {
    requesterUserId: string;
    requestType: "access" | "correction" | "erasure" | "restricted_processing";
    details?: Json;
  }
) {
  const { data, error } = await client
    .from("privacy_requests")
    .insert({
      requester_user_id: input.requesterUserId,
      request_type: input.requestType,
      details: minimiseAnalyticsPayload(input.details ?? {}),
      status: "received",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create privacy request", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: "privacy.request.created",
    resourceType: "privacy_request",
    resourceId: data.id,
    actorUserId: input.requesterUserId,
    metadata: { requestType: input.requestType },
    source: "phase12",
  });
  return data;
}

export async function reviewPrivacyRequest(
  client: SupabaseClient,
  input: {
    requestId: string;
    reviewerId: string;
    status:
      | "under_review"
      | "needs_info"
      | "approved"
      | "rejected"
      | "completed"
      | "blocked_legal_hold";
    reviewNotes?: string | null;
  }
) {
  // Erasure never auto-deletes ledger/audit — only workflow state.
  const { data, error } = await client
    .from("privacy_requests")
    .update({
      status: input.status,
      review_notes: input.reviewNotes ?? null,
      reviewed_by: input.reviewerId,
      reviewed_at: new Date().toISOString(),
      completed_at:
        input.status === "completed" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", input.requestId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to review privacy request", {
      cause: error,
    });
  }
  await writeAuditEvent(client, {
    action: "privacy.request.reviewed",
    resourceType: "privacy_request",
    resourceId: input.requestId,
    actorUserId: input.reviewerId,
    after: { status: input.status },
    source: "phase12",
  });
  return data;
}

export async function listRetentionPolicies(client: SupabaseClient) {
  const { data, error } = await client.from("retention_policies").select("*");
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list retention policies", {
      cause: error,
    });
  }
  return data ?? [];
}

export async function createRetentionReview(
  client: SupabaseClient,
  input: {
    policyKey: string;
    subjectRef?: string | null;
    eligibility?: string;
  }
) {
  if (await isFeatureEnabled(client, "retention_enforcement")) {
    throw new AppError(
      "CONFIGURATION_ERROR",
      "retention_enforcement must remain OFF — destructive purge gated"
    );
  }
  const { data, error } = await client
    .from("retention_reviews")
    .insert({
      policy_key: input.policyKey,
      subject_ref: input.subjectRef ?? null,
      eligibility: input.eligibility ?? "review_required",
    })
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to create retention review", {
      cause: error,
    });
  }
  return data;
}

export async function searchAuditEvents(
  client: SupabaseClient,
  filters: {
    actorUserId?: string | null;
    action?: string | null;
    resourceType?: string | null;
    resourceId?: string | null;
    correlationId?: string | null;
    from?: string | null;
    to?: string | null;
    limit?: number;
  }
) {
  let q = client
    .from("audit_events")
    .select(
      "id, occurred_at, actor_user_id, action, resource_type, resource_id, workspace_key, correlation_id, request_id, source, reason, metadata"
    )
    .order("occurred_at", { ascending: false })
    .limit(filters.limit ?? 50);
  if (filters.actorUserId) q = q.eq("actor_user_id", filters.actorUserId);
  if (filters.action) q = q.eq("action", filters.action);
  if (filters.resourceType) q = q.eq("resource_type", filters.resourceType);
  if (filters.resourceId) q = q.eq("resource_id", filters.resourceId);
  if (filters.correlationId) q = q.eq("correlation_id", filters.correlationId);
  if (filters.from) q = q.gte("occurred_at", filters.from);
  if (filters.to) q = q.lte("occurred_at", filters.to);
  const { data, error } = await q;
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to search audit events", {
      cause: error,
    });
  }
  // Never return before_data/after_data bags that may contain sensitive fields in this review API.
  return (data ?? []).map((row) => ({
    ...row,
    metadata: minimiseAnalyticsPayload((row.metadata as Json) ?? {}),
  }));
}

export async function getKpiFoundation(client: SupabaseClient) {
  const families = [
    "acquisition_membership",
    "circle_health",
    "lead_assist",
    "marketplace_commerce",
    "commission_settlement",
    "attribution",
    "customer_cx",
    "security_fraud",
    "enterprise",
    "notifications",
  ];
  const { count: analyticsCount } = await client
    .from("analytics_events")
    .select("id", { count: "exact", head: true });
  const { count: deadLetterCount } = await client
    .from("notification_dead_letters")
    .select("id", { count: "exact", head: true })
    .eq("disposition", "open");
  const { count: openRisk } = await client
    .from("risk_signals")
    .select("id", { count: "exact", head: true })
    .eq("review_status", "open");

  return {
    ruleVersion: PHASE12_RULE_VERSION,
    domains: families.map((key) => ({
      key,
      formulaStatus: key === "circle_health" ? "unresolved" : "operational",
    })),
    snapshots: {
      analyticsEvents: analyticsCount ?? 0,
      openDeadLetters: deadLetterCount ?? 0,
      openRiskSignals: openRisk ?? 0,
    },
  };
}

export async function registerPushSubscription(
  client: SupabaseClient,
  userId: string,
  endpoint: string
) {
  const endpointHash = createHash("sha256").update(endpoint).digest("hex");
  const { data, error } = await client
    .from("push_subscriptions")
    .upsert(
      {
        user_id: userId,
        endpoint_hash: endpointHash,
        endpoint_ref: `ref:${endpointHash.slice(0, 16)}`,
        provider: "web_push",
        is_active: true,
        last_seen_at: new Date().toISOString(),
        metadata: { note: "endpoint stored hashed; live push OFF" },
      },
      { onConflict: "user_id,endpoint_hash" }
    )
    .select("id, endpoint_hash, is_active, created_at")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to register push subscription", {
      cause: error,
    });
  }
  return data;
}

export async function disposeDeadLetter(
  client: SupabaseClient,
  input: {
    deadLetterId: string;
    actorUserId: string;
    disposition: "retried" | "discarded" | "resolved";
  }
) {
  const { data: row, error } = await client
    .from("notification_dead_letters")
    .update({
      disposition: input.disposition,
      disposed_by: input.actorUserId,
      disposed_at: new Date().toISOString(),
    })
    .eq("id", input.deadLetterId)
    .select("*")
    .single();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to dispose dead letter", {
      cause: error,
    });
  }
  if (input.disposition === "retried") {
    await client
      .from("notification_intents")
      .update({
        status: "pending",
        attempt_count: 0,
        next_attempt_at: new Date().toISOString(),
        last_error: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", row.intent_id);
    await enqueueBackgroundJob(client, {
      jobType: JOB_TYPES.notificationDispatch,
      idempotencyKey: `manual-retry:${row.intent_id}:${Date.now()}`,
      payload: { intentId: row.intent_id },
    });
  }
  await writeAuditEvent(client, {
    action: "notification.dead_letter.disposed",
    resourceType: "notification_dead_letter",
    resourceId: input.deadLetterId,
    actorUserId: input.actorUserId,
    after: { disposition: input.disposition },
    source: "phase12",
  });
  return row;
}

/** Fan-in helper: domain event → analytics + optional notification intents. */
export async function ingestDomainEventToPipelines(
  client: SupabaseClient,
  input: {
    family: string;
    eventName: string;
    actorUserId?: string | null;
    subjectType?: string | null;
    subjectId?: string | null;
    vertical?: string | null;
    payload?: Json;
    sourceDomain: string;
    sourceEventId: string;
    notify?: {
      recipientUserId: string;
      templateKey: string;
      channel?: NotificationChannel;
      category: NotificationCategory;
      deepLink?: string;
    };
  }
) {
  const analytics = await ingestAnalyticsEvent(client, {
    eventFamily: input.family,
    eventName: input.eventName,
    actorUserId: input.actorUserId,
    subjectType: input.subjectType,
    subjectId: input.subjectId,
    vertical: input.vertical,
    payload: input.payload,
    sourceDomain: input.sourceDomain,
    sourceEventId: input.sourceEventId,
    idempotencyKey: `analytics:${input.sourceDomain}:${input.sourceEventId}:${input.eventName}`,
  });

  let notification = null;
  if (input.notify) {
    notification = await createNotificationIntent(client, {
      recipientUserId: input.notify.recipientUserId,
      templateKey: input.notify.templateKey,
      channel: input.notify.channel ?? "in_app",
      category: input.notify.category,
      payload: minimiseAnalyticsPayload(input.payload ?? {}),
      deepLink: input.notify.deepLink,
      sourceEventId: input.sourceEventId,
      sourceDomain: input.sourceDomain,
      idempotencyKey: `notif:${input.sourceDomain}:${input.sourceEventId}:${input.notify.templateKey}:${input.notify.channel ?? "in_app"}`,
    });
  }

  return { analytics, notification, ruleVersion: PHASE12_RULE_VERSION };
}
