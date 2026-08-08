/** Phase 10 — Stage 1 unpaid Lead Assist (FD-031/032/039). */

export const LEAD_ASSIST_RULE_VERSION = "fd031-stage1-v1";

/** Paid / monetisation mechanics — must remain inactive in Stage 1. */
export const PAID_LEAD_ASSIST_FLAGS_MUST_STAY_OFF = [
  "paid_lead_assist",
  "lead_escrow",
  "lead_success_fee",
  "pay_to_receive_leads",
  "paid_contact_reveal",
  "rupee_500_lead_fee",
] as const;

export const LOW_CONFIDENCE_BPS = 5500;
export const DEFAULT_LEAD_TTL_HOURS = 72;
export const RATE_LIMIT_LEADS_PER_HOUR = 20;
export const DUPLICATE_WINDOW_MINUTES = 30;

export const WORK_STATUS_TRANSITIONS: Record<string, readonly string[]> = {
  draft: ["submitted", "cancelled"],
  submitted: ["classifying", "review_required", "cancelled"],
  classifying: ["classified", "review_required"],
  classified: ["routing", "review_required"],
  routing: ["routed", "review_required", "offered"],
  routed: ["offered", "review_required"],
  review_required: ["classifying", "routing", "offered", "cancelled"],
  offered: ["accepted", "declined", "no_response", "reassigned", "expired"],
  accepted: ["contact_revealed", "in_follow_up", "outcome_pending", "reassigned"],
  declined: ["reassigned", "closed_unconverted", "expired"],
  no_response: ["reassigned", "expired", "closed_unconverted"],
  contact_revealed: ["in_follow_up", "outcome_pending"],
  in_follow_up: ["outcome_pending", "closed_dual_confirmed", "closed_unconverted", "disputed"],
  outcome_pending: ["closed_dual_confirmed", "disputed", "closed_unconverted"],
  reassigned: ["offered", "review_required", "closed_unconverted"],
  closed_dual_confirmed: [],
  closed_unconverted: [],
  expired: ["reassigned"],
  cancelled: [],
  disputed: ["outcome_pending", "closed_unconverted", "reassigned", "review_required"],
};

// SM maps rejected quality separately; work_status uses cancelled for giver cancel
export type AssistWorkStatus = keyof typeof WORK_STATUS_TRANSITIONS;
