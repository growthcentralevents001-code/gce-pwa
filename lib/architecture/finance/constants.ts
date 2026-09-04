/** Phase 9 Finance commercial constants — FD-020/021/025/028/029/033/037/038. */

import {
  calculateMarketplaceSplit as calculateMarketplaceSplitCanonical,
  MARKETPLACE_RULE_VERSION,
} from "../marketplace/constants";

export const CONNECT_BDP_COMMISSION_BPS = 2000; // 20% attributed subscription
export const MARKETPLACE_VENUE_BPS = 8000;
export const MARKETPLACE_BDP_ATTRIBUTED_BPS = 1000;
export const MARKETPLACE_GCE_ATTRIBUTED_BPS = 1000;
export const MARKETPLACE_GCE_UNATTRIBUTED_BPS = 2000;
export const ENTERPRISE_PLATFORM_COMMISSION_BPS = 2000;
export const ENTERPRISE_BDP_OF_PLATFORM_BPS = 2500; // of platform commission

export const RECOVERY_CYCLE_CAP_MINOR = 500_000; // ₹5,000
export const CONNECT_MBDP_RECOVERABLE_MINOR = 5_500_000; // ₹55,000
export const ENTERPRISE_RECOVERABLE_MINOR = 3_100_000; // ₹31,000

export const FINANCE_RULE_VERSION = "phase9-fd029-v1";

export const MONEY_FLAGS_MUST_STAY_OFF = [
  "settlement_execution",
  "payout_execution",
  "wallet_cashout",
  "marketplace_ticket_payments",
  "bdp_pack_payments",
  "offline_bdp_pack_payments",
  "enterprise_bdp_pack_payments",
  "revenue_recognition_live",
  "commission_posting_live",
  "settlement_batch_generation",
] as const;

/** Integer-safe basis-point multiplication (floor). */
export function applyBps(amountMinor: number, bps: number): number {
  if (!Number.isInteger(amountMinor) || !Number.isInteger(bps)) {
    throw new Error("amountMinor and bps must be integers");
  }
  if (amountMinor < 0 || bps < 0) {
    throw new Error("amountMinor and bps must be non-negative");
  }
  return Math.floor((amountMinor * bps) / 10_000);
}

export function calculateConnectBdpCommission(input: {
  eligibleAttributedSubscriptionMinor: number;
  hasValidAttribution: boolean;
}) {
  if (!input.hasValidAttribution) {
    return {
      grossEntitlementMinor: 0,
      entitled: false,
      rateBps: CONNECT_BDP_COMMISSION_BPS,
      ruleKey: "connect_bdp_commission",
      ruleVersion: "fd025-fd029-v1",
    };
  }
  return {
    grossEntitlementMinor: applyBps(
      input.eligibleAttributedSubscriptionMinor,
      CONNECT_BDP_COMMISSION_BPS
    ),
    entitled: true,
    rateBps: CONNECT_BDP_COMMISSION_BPS,
    ruleKey: "connect_bdp_commission",
    ruleVersion: "fd025-fd029-v1",
  };
}

export function calculateMarketplaceSplit(input: {
  eligibleEventRevenueMinor: number;
  hasValidMbdpAttribution: boolean;
}) {
  const split = calculateMarketplaceSplitCanonical(
    input.eligibleEventRevenueMinor,
    input.hasValidMbdpAttribution
  );
  return {
    venueShareMinor: split.venueShareMinor,
    mbdpShareMinor: split.mbdpShareMinor,
    gceShareMinor: split.gceShareMinor,
    entitledMbdp: split.entitledMbdp,
    ruleVersion: MARKETPLACE_RULE_VERSION,
  };
}

export function calculateEnterpriseEntitlement(input: {
  eligibleEventRevenueMinor: number;
  hasValidAttribution: boolean;
  platformCommissionBps?: number;
}) {
  const platformBps =
    input.platformCommissionBps ?? ENTERPRISE_PLATFORM_COMMISSION_BPS;
  const platformCommissionMinor = applyBps(
    input.eligibleEventRevenueMinor,
    platformBps
  );
  if (!input.hasValidAttribution) {
    return {
      platformCommissionMinor,
      ebdpEntitlementMinor: 0,
      entitledEbdp: false,
      ruleVersion: "fd026-fd038-v1",
    };
  }
  return {
    platformCommissionMinor,
    ebdpEntitlementMinor: applyBps(
      platformCommissionMinor,
      ENTERPRISE_BDP_OF_PLATFORM_BPS
    ),
    entitledEbdp: true,
    ruleVersion: "fd026-fd038-v1",
  };
}

export function recoveryForCycle(input: {
  remainingRecoverableMinor: number;
  approvedCommissionMinor: number;
  capMinor?: number;
}): number {
  const cap = input.capMinor ?? RECOVERY_CYCLE_CAP_MINOR;
  if (input.approvedCommissionMinor <= 0 || input.remainingRecoverableMinor <= 0) {
    return 0;
  }
  return Math.min(
    cap,
    input.remainingRecoverableMinor,
    input.approvedCommissionMinor
  );
}

export function netAfterRecovery(
  grossEntitlementMinor: number,
  recoveryDeductionMinor: number,
  reversalAmountMinor = 0
): number {
  return Math.max(
    0,
    grossEntitlementMinor - recoveryDeductionMinor - reversalAmountMinor
  );
}
