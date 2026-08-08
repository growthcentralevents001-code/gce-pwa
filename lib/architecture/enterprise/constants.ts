/** Phase 8 Enterprise commercial constants — FD-026/028/029/038. */

/** Enterprise BDP Franchise Pack — direct ₹30,000 */
export const EBDP_DIRECT_TOTAL_MINOR = 3_000_000;
/** Financed ₹36,000 (₹5,000 + ₹31,000 recoverable) */
export const EBDP_FINANCE_TOTAL_MINOR = 3_600_000;
export const EBDP_FINANCE_INITIAL_MINOR = 500_000;
export const EBDP_RECOVERABLE_MINOR = 3_100_000;
export const EBDP_RECOVERY_CYCLE_CAP_MINOR = 500_000;

export const EBDP_CLIENTS_PER_PACK = 30;
export const EBDP_PERSON_MAX_PACKS = 2;
export const EBDP_STANDARD_MAX_CLIENTS = 60;

/** Default GCE platform commission on eligible Enterprise event revenue */
export const ENTERPRISE_PLATFORM_COMMISSION_BPS = 2000; // 20%
/** Strategic band floor (special approval below this) */
export const ENTERPRISE_PLATFORM_COMMISSION_STRATEGIC_FLOOR_BPS = 1500;
/** Enterprise BDP entitlement = 25% of eligible GCE platform commission */
export const EBDP_ENTITLEMENT_BPS = 2500; // of platform commission, NOT project value

/** FD-038: total proposed project value > ₹5,00,000 requires Finance co-sign */
export const FINANCE_COSIGN_THRESHOLD_MINOR = 50_000_000;

/** Minimum eligible Enterprise project event revenue (ex GST) */
export const ENTERPRISE_MIN_PROJECT_VALUE_MINOR = 10_000_000;

export const ENTERPRISE_RULE_VERSION = "fd026-fd038-v1";
export const EBDP_PACKAGE_RULE_VERSION = "fd026-v1";

export type EnterpriseBdpPackageOption =
  | "direct_30000"
  | "finance_recovery_36000";

export function ebdpPackageAmounts(option: EnterpriseBdpPackageOption) {
  if (option === "direct_30000") {
    return {
      packageTotalMinor: EBDP_DIRECT_TOTAL_MINOR,
      initialPaymentMinor: EBDP_DIRECT_TOTAL_MINOR,
      recoverableBalanceMinor: 0,
    };
  }
  return {
    packageTotalMinor: EBDP_FINANCE_TOTAL_MINOR,
    initialPaymentMinor: EBDP_FINANCE_INITIAL_MINOR,
    recoverableBalanceMinor: EBDP_RECOVERABLE_MINOR,
  };
}

export function financeCosignRequired(totalProposedMinor: number): boolean {
  return totalProposedMinor > FINANCE_COSIGN_THRESHOLD_MINOR;
}

/**
 * Platform commission on eligible event revenue (default 20%).
 * EBDP share is 25% of that commission when valid client attribution exists.
 * No attribution → zero EBDP entitlement (not pending).
 */
export function calculateEnterpriseEntitlement(input: {
  eligibleEventRevenueMinor: number;
  hasValidAttribution: boolean;
  platformCommissionBps?: number;
  ebdpEntitlementBps?: number;
}) {
  const platformBps =
    input.platformCommissionBps ?? ENTERPRISE_PLATFORM_COMMISSION_BPS;
  const ebdpBps = input.ebdpEntitlementBps ?? EBDP_ENTITLEMENT_BPS;
  const platformCommissionMinor = Math.floor(
    (input.eligibleEventRevenueMinor * platformBps) / 10_000
  );
  if (!input.hasValidAttribution) {
    return {
      platformCommissionMinor,
      ebdpEntitlementMinor: 0,
      entitledEbdp: false,
      ruleVersion: ENTERPRISE_RULE_VERSION,
    };
  }
  return {
    platformCommissionMinor,
    ebdpEntitlementMinor: Math.floor((platformCommissionMinor * ebdpBps) / 10_000),
    entitledEbdp: true,
    ruleVersion: ENTERPRISE_RULE_VERSION,
  };
}

export function ebdpRecoveryAmountForCycle(input: {
  remainingRecoverableMinor: number;
  ebdpShareMinor: number;
}): number {
  if (input.ebdpShareMinor <= 0 || input.remainingRecoverableMinor <= 0) return 0;
  return Math.min(
    EBDP_RECOVERY_CYCLE_CAP_MINOR,
    input.remainingRecoverableMinor,
    input.ebdpShareMinor
  );
}
