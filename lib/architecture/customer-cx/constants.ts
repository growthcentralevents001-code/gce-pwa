/** Phase 11 customer CX — orchestrates Phase 7 Marketplace + Phase 9 Finance. */

export const CX_RULE_VERSION = "fd039-phase11-cx-v1";
export const DEFAULT_TRUST_SCORE = 50;

export const MONEY_FLAGS_MUST_STAY_OFF = [
  "marketplace_ticket_payments",
  "settlement_execution",
  "payout_execution",
  "refund_processing",
] as const;

export const NON_PURCHASE_REASON_CODES = [
  "out_of_stock",
  "price_too_high",
  "quality_issue",
  "changed_mind",
  "timing",
  "other",
] as const;

export type NonPurchaseReasonCode = (typeof NON_PURCHASE_REASON_CODES)[number];
