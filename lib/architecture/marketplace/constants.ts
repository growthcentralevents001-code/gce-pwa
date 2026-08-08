/** Phase 7 Marketplace commercial constants — FD-029/033/037/039. */

export const MBDP_VENUE_BPS = 8000; // 80%
export const MBDP_COMMISSION_BPS = 1000; // 10% attributed
export const GCE_ATTRIBUTED_BPS = 1000; // 10% net attributed
export const GCE_UNATTRIBUTED_BPS = 2000; // 20% unattributed

export const MBDP_DIRECT_TOTAL_MINOR = 5_000_000;
export const MBDP_FINANCE_TOTAL_MINOR = 6_000_000;
export const MBDP_FINANCE_INITIAL_MINOR = 500_000;
export const MBDP_RECOVERABLE_MINOR = 5_500_000;
export const MBDP_RECOVERY_CYCLE_CAP_MINOR = 500_000;

export const MBDP_VENUES_PER_UNIT = 20;
export const MBDP_PERSON_MAX_UNITS = 2;
export const MBDP_STANDARD_MAX_VENUES = 40;

export const OFFER_MIN_PLANNED_VALUE_MINOR = 5_000_000; // ₹50,000
export const OFFER_MAX_CAMPAIGN_DAYS = 15;
export const OFFER_CUSTOMER_CAP = 100;
export const OFFER_CLAIM_VALIDITY_HOURS = 72;
export const EVENT_DEFAULT_CANCEL_CUTOFF_HOURS = 48;

export const MARKETPLACE_RULE_VERSION = "fd029-fd037-v1";
export const MBDP_PACKAGE_RULE_VERSION = "fd029-fd033-v1";

export type MarketplaceBdpPackageOption =
  | "direct_50000"
  | "finance_recovery_60000";

export function mbdpPackageAmounts(option: MarketplaceBdpPackageOption) {
  if (option === "direct_50000") {
    return {
      packageTotalMinor: MBDP_DIRECT_TOTAL_MINOR,
      initialPaymentMinor: MBDP_DIRECT_TOTAL_MINOR,
      recoverableBalanceMinor: 0,
    };
  }
  return {
    packageTotalMinor: MBDP_FINANCE_TOTAL_MINOR,
    initialPaymentMinor: MBDP_FINANCE_INITIAL_MINOR,
    recoverableBalanceMinor: MBDP_RECOVERABLE_MINOR,
  };
}

/**
 * Attributed: 80 Venue / 10 MBDP / 10 GCE.
 * Unattributed: 80 Venue / 0 MBDP / 20 GCE (missing 10% is NOT pending MBDP).
 */
export function calculateMarketplaceSplit(
  eligibleRevenueMinor: number,
  hasValidAttribution: boolean
): {
  venueShareMinor: number;
  mbdpShareMinor: number;
  gceShareMinor: number;
  mbdpCommissionBps: number;
  entitledMbdp: boolean;
} {
  if (eligibleRevenueMinor <= 0) {
    return {
      venueShareMinor: 0,
      mbdpShareMinor: 0,
      gceShareMinor: 0,
      mbdpCommissionBps: hasValidAttribution ? MBDP_COMMISSION_BPS : 0,
      entitledMbdp: false,
    };
  }
  const venueShareMinor = Math.floor((eligibleRevenueMinor * 80) / 100);
  if (hasValidAttribution) {
    const mbdpShareMinor = Math.floor((eligibleRevenueMinor * 10) / 100);
    return {
      venueShareMinor,
      mbdpShareMinor,
      gceShareMinor: eligibleRevenueMinor - venueShareMinor - mbdpShareMinor,
      mbdpCommissionBps: MBDP_COMMISSION_BPS,
      entitledMbdp: mbdpShareMinor > 0,
    };
  }
  return {
    venueShareMinor,
    mbdpShareMinor: 0,
    gceShareMinor: eligibleRevenueMinor - venueShareMinor,
    mbdpCommissionBps: 0,
    entitledMbdp: false,
  };
}

export function mbdpRecoveryAmountForCycle(input: {
  remainingRecoverableMinor: number;
  mbdpShareMinor: number;
}): number {
  if (input.remainingRecoverableMinor <= 0 || input.mbdpShareMinor <= 0) {
    return 0;
  }
  return Math.min(
    MBDP_RECOVERY_CYCLE_CAP_MINOR,
    input.remainingRecoverableMinor,
    input.mbdpShareMinor
  );
}

export function validateOfferCampaign(input: {
  plannedCommercialValueMinor: number;
  campaignStartsAt: Date;
  campaignEndsAt: Date;
  customerCap: number;
}): { ok: true } | { ok: false; reason: string } {
  if (input.plannedCommercialValueMinor < OFFER_MIN_PLANNED_VALUE_MINOR) {
    return { ok: false, reason: "Planned commercial value must be ≥ ₹50,000" };
  }
  if (input.customerCap < 1 || input.customerCap > OFFER_CUSTOMER_CAP) {
    return { ok: false, reason: "Customer cap must be 1–100" };
  }
  const ms = input.campaignEndsAt.getTime() - input.campaignStartsAt.getTime();
  if (ms <= 0) {
    return { ok: false, reason: "Campaign end must be after start" };
  }
  const days = ms / (1000 * 60 * 60 * 24);
  if (days > OFFER_MAX_CAMPAIGN_DAYS) {
    return { ok: false, reason: "Campaign max duration is 15 days" };
  }
  return { ok: true };
}

export function claimExpiresAt(claimedAt: Date = new Date()): Date {
  return new Date(
    claimedAt.getTime() + OFFER_CLAIM_VALIDITY_HOURS * 60 * 60 * 1000
  );
}
