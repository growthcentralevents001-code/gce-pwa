/** Phase 6 Connect BDP constants — FD-025 / FD-029 (commercial SoT). */

export const CONNECT_BDP_COMMISSION_BPS = 2000; // 20%
export const CONNECT_BDP_DIRECT_TOTAL_MINOR = 5_000_000; // ₹50,000
export const CONNECT_BDP_FINANCE_TOTAL_MINOR = 6_000_000; // ₹60,000
export const CONNECT_BDP_FINANCE_INITIAL_MINOR = 500_000; // ₹5,000
export const CONNECT_BDP_RECOVERABLE_MINOR = 5_500_000; // ₹55,000
export const CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR = 500_000; // ₹5,000
export const CONNECT_BDP_TARGET_CIRCLES = 5;
export const CONNECT_BDP_TARGET_MONTHS = 10;
export const CONNECT_BDP_CIRCLES_PER_UNIT = 5;
export const CONNECT_BDP_PERSON_MAX_UNITS = 2;
export const CONNECT_BDP_RULE_VERSION = "fd025-fd029-v1";

export const CITY_TIER_MAX_UNITS = {
  tier_1: 10,
  tier_2: 5,
  tier_3: 2,
} as const;

export type ConnectBdpPackageOption =
  | "direct_50000"
  | "finance_recovery_60000";

export type ConnectBdpApplicationStatus =
  | "draft"
  | "submitted"
  | "pending_verification"
  | "pending_payment"
  | "pending_approval"
  | "active"
  | "rejected"
  | "suspended"
  | "terminated"
  | "archived";

export type ConnectAttributionStatus =
  | "unattributed"
  | "proposed"
  | "pending_evidence"
  | "active"
  | "disputed"
  | "suspended"
  | "reassigned_closed"
  | "voided";

export function packageAmounts(option: ConnectBdpPackageOption): {
  packageTotalMinor: number;
  initialPaymentMinor: number;
  recoverableBalanceMinor: number;
} {
  if (option === "direct_50000") {
    return {
      packageTotalMinor: CONNECT_BDP_DIRECT_TOTAL_MINOR,
      initialPaymentMinor: CONNECT_BDP_DIRECT_TOTAL_MINOR,
      recoverableBalanceMinor: 0,
    };
  }
  return {
    packageTotalMinor: CONNECT_BDP_FINANCE_TOTAL_MINOR,
    initialPaymentMinor: CONNECT_BDP_FINANCE_INITIAL_MINOR,
    recoverableBalanceMinor: CONNECT_BDP_RECOVERABLE_MINOR,
  };
}

/** 20% of eligible attributed Connect subscription revenue (FD-025/029). */
export function calculateConnectBdpCommission(
  eligibleRevenueMinor: number,
  hasValidAttribution: boolean
): { grossCommissionMinor: number; commissionBps: number; entitled: boolean } {
  if (!hasValidAttribution || eligibleRevenueMinor <= 0) {
    return { grossCommissionMinor: 0, commissionBps: CONNECT_BDP_COMMISSION_BPS, entitled: false };
  }
  return {
    grossCommissionMinor: Math.round(
      (eligibleRevenueMinor * CONNECT_BDP_COMMISSION_BPS) / 10_000
    ),
    commissionBps: CONNECT_BDP_COMMISSION_BPS,
    entitled: true,
  };
}

export function recoveryAmountForCycle(input: {
  remainingRecoverableMinor: number;
  grossCommissionMinor: number;
}): number {
  if (input.remainingRecoverableMinor <= 0 || input.grossCommissionMinor <= 0) {
    return 0;
  }
  return Math.min(
    CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
    input.remainingRecoverableMinor,
    input.grossCommissionMinor
  );
}
