/**
 * Partner dashboard presentation helpers (Checkpoint C).
 * Display labels only — no commission/recovery/target authority.
 */

import {
  CITY_TIER_MAX_UNITS,
  CONNECT_BDP_CIRCLES_PER_UNIT,
  CONNECT_BDP_COMMISSION_BPS,
  CONNECT_BDP_DIRECT_TOTAL_MINOR,
  CONNECT_BDP_FINANCE_INITIAL_MINOR,
  CONNECT_BDP_FINANCE_TOTAL_MINOR,
  CONNECT_BDP_RECOVERABLE_MINOR,
  CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
  type ConnectBdpPackageOption,
} from "@/lib/architecture/connect-bdp/constants";

export {
  CITY_TIER_MAX_UNITS,
  CONNECT_BDP_CIRCLES_PER_UNIT,
  CONNECT_BDP_COMMISSION_BPS,
  CONNECT_BDP_DIRECT_TOTAL_MINOR,
  CONNECT_BDP_FINANCE_INITIAL_MINOR,
  CONNECT_BDP_FINANCE_TOTAL_MINOR,
  CONNECT_BDP_RECOVERABLE_MINOR,
  CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
};

/** Canonical role label — never BDM/ZBP. */
export const CONNECT_BDP_ROLE_LABEL = "Connect BDP";

/** Performance-based earnings disclaimer (FD-025/036). Display only. */
export const CONNECT_BDP_EARNINGS_DISCLAIMER =
  "Connect BDP commission is performance-based on eligible, collected, and validly attributed Connect subscription revenue — not a salary or guaranteed income. Organic memberships without valid attribution do not generate Connect BDP commission. Settlement and payout remain platform-governed.";

export function formatMinorInr(minor: number): string {
  const rupees = Math.round(minor) / 100;
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

export function formatCommissionRateLabel(
  bps: number = CONNECT_BDP_COMMISSION_BPS
): string {
  return `${bps / 100}%`;
}

export function packageOptionLabel(option: string): string {
  if (option === "direct_50000") return "Direct — ₹50,000";
  if (option === "finance_recovery_60000") {
    return "Finance — ₹60,000 (₹5,000 + ₹55,000 recoverable)";
  }
  return option.replace(/_/g, " ");
}

export function packageCanonicalAmounts(option: ConnectBdpPackageOption | string) {
  if (option === "direct_50000") {
    return {
      totalMinor: CONNECT_BDP_DIRECT_TOTAL_MINOR,
      initialMinor: CONNECT_BDP_DIRECT_TOTAL_MINOR,
      recoverableMinor: 0,
    };
  }
  return {
    totalMinor: CONNECT_BDP_FINANCE_TOTAL_MINOR,
    initialMinor: CONNECT_BDP_FINANCE_INITIAL_MINOR,
    recoverableMinor: CONNECT_BDP_RECOVERABLE_MINOR,
  };
}

export function applicationStatusLabel(status: string): string {
  const map: Record<string, string> = {
    draft: "Draft",
    submitted: "Submitted",
    pending_verification: "Pending verification",
    pending_payment: "Payment pending",
    pending_approval: "Pending platform approval",
    active: "Active",
    rejected: "Rejected",
    suspended: "Suspended",
    terminated: "Terminated",
    archived: "Archived",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function maintenanceStatusLabel(status: string): string {
  const map: Record<string, string> = {
    not_applicable: "Not applicable (target not yet achieved)",
    compliant: "Meeting maintenance requirement",
    review_required: "Below requirement — review required",
    at_requirement: "At requirement",
    below_requirement: "Below requirement",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function attributionStatusLabel(status: string): string {
  const map: Record<string, string> = {
    unattributed: "Organic / unattributed (valid)",
    proposed: "Proposed — awaiting platform confirmation",
    pending_evidence: "Pending evidence",
    active: "Attributed",
    disputed: "Disputed",
    suspended: "Suspended",
    reassigned_closed: "Reassigned (closed)",
    voided: "Voided",
  };
  return map[status] ?? status.replace(/_/g, " ");
}

export function cityTierLabel(tier: string): string {
  const map: Record<string, string> = {
    tier_1: "Tier 1",
    tier_2: "Tier 2",
    tier_3: "Tier 3",
  };
  return map[tier] ?? tier.replace(/_/g, " ");
}

export function cityTierCap(tier: string): number | null {
  if (tier === "tier_1" || tier === "tier_2" || tier === "tier_3") {
    return CITY_TIER_MAX_UNITS[tier];
  }
  return null;
}

export function unitCircleCapacityLabel(active: number, max = CONNECT_BDP_CIRCLES_PER_UNIT) {
  const capped = Math.min(Math.max(0, active), max);
  return `${capped} / ${max}`;
}

export function targetProgressLabel(credited: number, target = CONNECT_BDP_TARGET_CIRCLES) {
  return `${Math.min(credited, target)} / ${target}`;
}

/** Stale commercial values that must never appear in Connect BDP UI. */
export const STALE_CONNECT_BDP_TERMS = [
  "BDM",
  "ZBP",
  "VDP",
  "10%",
  "10 Circles",
  "10-circle",
  "5/2/1",
] as const;

export function containsStaleConnectBdpTerm(text: string): boolean {
  return STALE_CONNECT_BDP_TERMS.some((t) => text.includes(t));
}
