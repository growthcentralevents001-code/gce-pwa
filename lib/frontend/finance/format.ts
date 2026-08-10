/**
 * Finance presentation helpers — Checkpoint C reuse.
 * Display only; no revenue/commission/settlement/payout authority.
 */

import {
  CONNECT_BDP_COMMISSION_BPS,
  ENTERPRISE_BDP_OF_PLATFORM_BPS,
  MARKETPLACE_BDP_ATTRIBUTED_BPS,
  MONEY_FLAGS_MUST_STAY_OFF,
  RECOVERY_CYCLE_CAP_MINOR,
} from "@/lib/architecture/finance/constants";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { formatMinorInr } from "@/lib/frontend/partner/format";

export {
  CONNECT_BDP_COMMISSION_BPS,
  ENTERPRISE_BDP_OF_PLATFORM_BPS,
  MARKETPLACE_BDP_ATTRIBUTED_BPS,
  MONEY_FLAGS_MUST_STAY_OFF,
  RECOVERY_CYCLE_CAP_MINOR,
  formatMinorInr,
};

export const FINANCE_ROLE_LABEL = "Finance";

export const PAYMENT_VS_REVENUE_COPY =
  "Payment received is not revenue recognised. Revenue recognition and commission posting are separate backend states.";

export const GROSS_IMMUTABLE_COPY =
  "Gross amounts are immutable. Corrections use recovery, hold, adjustment, or reversal — never direct ledger overwrite.";

export const SETTLEMENT_GATED_COPY =
  "Settlement execution remains OFF. Batches are reviewable; Pay Now is not available.";

export const PAYOUT_GATED_COPY =
  "Payout execution remains OFF. Payout-ready items are display/review only.";

export const REFUND_GATED_COPY =
  "Refund processing remains OFF. Requests are reviewable; no execution flow is live.";

export const NO_TAX_INVENTION_COPY =
  "GST/TDS treatment is not inventable in UI. Tax fields display backend values only when supplied.";

export const RECOVERY_FORMULA_HINT =
  "Gross entitlement − Recovery ± Reversal = Net settlement-eligible (backend-calculated).";

export function moneyFlagIsOff(
  flags: Record<string, boolean | undefined> | null | undefined,
  key: string
): boolean {
  if (flags && key in flags) return !Boolean(flags[key]);
  return (
    (INACTIVE_FEATURE_FLAGS as readonly string[]).includes(key) ||
    (MONEY_FLAGS_MUST_STAY_OFF as readonly string[]).includes(key)
  );
}

export function recognitionStatusLabel(status: string): string {
  const map: Record<string, string> = {
    payment_received: "Payment received (not yet recognised)",
    recognised: "Revenue recognised",
    deferred: "Deferred",
    reversed: "Reversed",
    cancelled: "Cancelled",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function entitlementStatusLabel(status: string): string {
  const map: Record<string, string> = {
    estimated: "Estimated",
    provisional: "Provisional",
    earned: "Earned",
    held: "Held",
    settlement_eligible: "Settlement-eligible",
    batched: "Batched",
    paid: "Paid",
    reversed: "Reversed",
    cancelled: "Cancelled",
    approved: "Approved",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function stakeholderTypeLabel(type: string): string {
  const map: Record<string, string> = {
    connect_bdp: "Connect BDP",
    marketplace_bdp: "Marketplace BDP",
    enterprise_bdp: "Enterprise BDP",
    venue: "Venue",
    gce_platform: "GCE / platform",
    platform: "GCE / platform",
  };
  return map[type] ?? type.replace(/_/g, " ");
}

export function maskReference(value: string | null | undefined, keep = 4): string {
  if (!value) return "—";
  if (value.length <= keep * 2) return value;
  return `${value.slice(0, keep)}…${value.slice(-keep)}`;
}

export function formatFinanceDate(value: string | null | undefined): string {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return String(value).slice(0, 10);
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d);
}

/** Stale finance terms that must not appear in Batch 7-owned UI. */
export const STALE_FINANCE_TERMS = [
  "Edit Ledger",
  "Edit Commission",
  "Pay Partner Now",
  "Pay Now",
  "10% Connect BDP",
  "ZBP commission",
  "pending Marketplace 10%",
  "25% of project value",
  "GST 18%",
  "TDS 10%",
  "Super Admin finance",
  "wallet cashout live",
] as const;

export function containsStaleFinanceTerm(text: string): boolean {
  const lower = text.toLowerCase();
  return STALE_FINANCE_TERMS.some((t) => lower.includes(t.toLowerCase()));
}

/** Display helper for recovery breakdown — values must already be backend-calculated. */
export function recoveryBreakdownRows(input: {
  grossEntitlementMinor: number;
  recoveryDeductionMinor: number;
  reversalAmountMinor: number;
  netSettlementEligibleMinor: number;
}) {
  return [
    {
      id: "gross",
      label: "Gross entitlement",
      amountMinor: input.grossEntitlementMinor,
      emphasize: true,
      hint: "Immutable after posting",
    },
    {
      id: "recovery",
      label: "Recovery deduction",
      amountMinor: input.recoveryDeductionMinor,
      hint: "Separate from gross",
    },
    {
      id: "reversal",
      label: "Reversal",
      amountMinor: input.reversalAmountMinor,
    },
    {
      id: "net",
      label: "Net settlement-eligible",
      amountMinor: input.netSettlementEligibleMinor,
      emphasize: true,
      hint: RECOVERY_FORMULA_HINT,
    },
  ];
}
