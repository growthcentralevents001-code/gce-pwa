/** Phase 13 — Admin / Operations / Support control plane. */

export const PHASE13_RULE_VERSION = "fd039-phase13-ops-v1";

export const OPS_CASE_TYPES = [
  "membership",
  "circle",
  "connect_bdp",
  "venue",
  "marketplace_bdp",
  "event",
  "offer",
  "booking",
  "claim",
  "redemption",
  "enterprise",
  "project",
  "vendor",
  "finance",
  "refund",
  "chargeback",
  "privacy",
  "compliance",
  "security",
  "account_access",
  "general_support",
  "moderation",
  "incident",
  "other",
] as const;

export type OpsCaseType = (typeof OPS_CASE_TYPES)[number];

export const OPS_CASE_STATUSES = [
  "open",
  "assigned",
  "investigating",
  "waiting_on_customer",
  "waiting_on_partner",
  "waiting_on_internal",
  "escalated",
  "resolved",
  "closed",
  "reopened",
] as const;

export type OpsCaseStatus = (typeof OPS_CASE_STATUSES)[number];

export const OPS_VERTICALS = [
  "platform",
  "connect",
  "marketplace",
  "enterprise",
  "finance",
  "compliance",
  "support",
] as const;

export type OpsVertical = (typeof OPS_VERTICALS)[number];

export const OVERRIDE_CATEGORIES = [
  "attribution_correction",
  "allocation_correction",
  "workflow_state_correction",
  "approval_correction",
  "refund_exception_request",
  "rank_review",
  "data_correction",
  "other_typed",
] as const;

export type OverrideCategory = (typeof OVERRIDE_CATEGORIES)[number];

export const MONEY_AND_PROVIDER_FLAGS_MUST_STAY_OFF = [
  "marketplace_ticket_payments",
  "settlement_execution",
  "payout_execution",
  "refund_processing",
  "notifications_email_live",
  "notifications_sms_live",
  "notifications_push_live",
  "marketing_notifications",
  "retention_enforcement",
] as const;

export const ALLOWED_CASE_TRANSITIONS: Record<
  OpsCaseStatus,
  OpsCaseStatus[]
> = {
  open: ["assigned", "investigating", "escalated", "closed"],
  assigned: ["investigating", "waiting_on_customer", "waiting_on_partner", "waiting_on_internal", "escalated", "resolved"],
  investigating: [
    "waiting_on_customer",
    "waiting_on_partner",
    "waiting_on_internal",
    "escalated",
    "resolved",
  ],
  waiting_on_customer: ["investigating", "assigned", "escalated", "resolved"],
  waiting_on_partner: ["investigating", "assigned", "escalated", "resolved"],
  waiting_on_internal: ["investigating", "assigned", "escalated", "resolved"],
  escalated: ["investigating", "assigned", "resolved", "closed"],
  resolved: ["closed", "reopened"],
  closed: ["reopened"],
  reopened: ["assigned", "investigating", "escalated"],
};
