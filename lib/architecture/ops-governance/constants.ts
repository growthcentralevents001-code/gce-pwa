/** Phase 12 — notifications / analytics / security / compliance. */

export const PHASE12_RULE_VERSION = "fd039-phase12-ops-v1";

export const NOTIFICATION_CHANNELS = ["in_app", "email", "sms", "push"] as const;
export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];

export const NOTIFICATION_CATEGORIES = [
  "transactional",
  "booking",
  "membership",
  "leads",
  "finance",
  "marketing",
  "security",
  "operational",
] as const;
export type NotificationCategory = (typeof NOTIFICATION_CATEGORIES)[number];

/** Categories users cannot fully opt out of via marketing prefs. */
export const NON_OPTIONAL_CATEGORIES: NotificationCategory[] = [
  "security",
  "transactional",
];

export const SECURITY_SEVERITIES = [
  "informational",
  "low",
  "medium",
  "high",
  "critical",
] as const;
export type SecuritySeverity = (typeof SECURITY_SEVERITIES)[number];

export const LIVE_PROVIDER_FLAGS_MUST_STAY_OFF = [
  "notifications_email_live",
  "notifications_sms_live",
  "notifications_push_live",
  "marketing_notifications",
  "retention_enforcement",
] as const;

export const PHASE12_MONEY_FLAGS_MUST_STAY_OFF = [
  "marketplace_ticket_payments",
  "settlement_execution",
  "payout_execution",
] as const;

export const MAX_NOTIFICATION_ATTEMPTS = 5;
export const RETRY_BACKOFF_BASE_MS = 30_000;

export const ANALYTICS_FORBIDDEN_PAYLOAD_KEYS = [
  "email",
  "phone",
  "mobile",
  "aadhaar",
  "pan",
  "bank_account",
  "account_number",
  "password",
  "token",
  "otp",
  "qr_token",
  "secret",
  "service_role",
  "document_number",
  "full_name",
  "address_line",
] as const;

export const JOB_TYPES = {
  notificationDispatch: "phase12.notification.dispatch",
  notificationRetry: "phase12.notification.retry",
  analyticsIngest: "phase12.analytics.ingest",
  alertEvaluate: "phase12.alerts.evaluate",
  retentionReview: "phase12.retention.review",
} as const;
