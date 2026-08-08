import { describe, expect, it } from "vitest";
import {
  calculateMarketplaceSplit,
  mbdpPackageAmounts,
  mbdpRecoveryAmountForCycle,
  validateOfferCampaign,
  claimExpiresAt,
  MBDP_VENUES_PER_UNIT,
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
  OFFER_MIN_PLANNED_VALUE_MINOR,
  OFFER_MAX_CAMPAIGN_DAYS,
  OFFER_CUSTOMER_CAP,
  EVENT_DEFAULT_CANCEL_CUTOFF_HOURS,
} from "@/lib/architecture/marketplace/constants";

describe("Phase 7 MBDP package (FD-029/033)", () => {
  it("supports direct ₹50k and financed ₹60k", () => {
    expect(mbdpPackageAmounts("direct_50000")).toEqual({
      packageTotalMinor: 5_000_000,
      initialPaymentMinor: 5_000_000,
      recoverableBalanceMinor: 0,
    });
    expect(mbdpPackageAmounts("finance_recovery_60000")).toEqual({
      packageTotalMinor: 6_000_000,
      initialPaymentMinor: 500_000,
      recoverableBalanceMinor: 5_500_000,
    });
  });

  it("uses 20 venues/unit, max 2 units, 40 standard ceiling", () => {
    expect(MBDP_VENUES_PER_UNIT).toBe(20);
    expect(MBDP_PERSON_MAX_UNITS).toBe(2);
    expect(MBDP_STANDARD_MAX_VENUES).toBe(40);
  });
});

describe("Phase 7 Marketplace revenue splits (FD-029/037)", () => {
  it("attributes 80/10/10 when valid MBDP attribution exists", () => {
    const s = calculateMarketplaceSplit(100_000_00, true);
    expect(s.venueShareMinor).toBe(80_000_00);
    expect(s.mbdpShareMinor).toBe(10_000_00);
    expect(s.gceShareMinor).toBe(10_000_00);
    expect(s.entitledMbdp).toBe(true);
  });

  it("uses unattributed 80/0/20 with zero MBDP (not pending)", () => {
    const s = calculateMarketplaceSplit(100_000_00, false);
    expect(s.venueShareMinor).toBe(80_000_00);
    expect(s.mbdpShareMinor).toBe(0);
    expect(s.gceShareMinor).toBe(20_000_00);
    expect(s.entitledMbdp).toBe(false);
  });
});

describe("Phase 7 Offer Event gates (FD-037)", () => {
  it("enforces ₹50k / 15 days / 100 customers", () => {
    const start = new Date("2026-08-01T00:00:00Z");
    const end = new Date("2026-08-10T00:00:00Z");
    expect(
      validateOfferCampaign({
        plannedCommercialValueMinor: OFFER_MIN_PLANNED_VALUE_MINOR,
        campaignStartsAt: start,
        campaignEndsAt: end,
        customerCap: OFFER_CUSTOMER_CAP,
      }).ok
    ).toBe(true);

    expect(
      validateOfferCampaign({
        plannedCommercialValueMinor: 4_999_999,
        campaignStartsAt: start,
        campaignEndsAt: end,
        customerCap: 100,
      }).ok
    ).toBe(false);

    const tooLong = new Date(start);
    tooLong.setUTCDate(tooLong.getUTCDate() + OFFER_MAX_CAMPAIGN_DAYS + 1);
    expect(
      validateOfferCampaign({
        plannedCommercialValueMinor: OFFER_MIN_PLANNED_VALUE_MINOR,
        campaignStartsAt: start,
        campaignEndsAt: tooLong,
        customerCap: 100,
      }).ok
    ).toBe(false);
  });

  it("sets claim expiry at 72 hours", () => {
    const claimed = new Date("2026-08-01T12:00:00Z");
    const exp = claimExpiresAt(claimed);
    expect(exp.getTime() - claimed.getTime()).toBe(72 * 60 * 60 * 1000);
  });
});

describe("Phase 7 cancellation default + recovery", () => {
  it("defaults cancellation cutoff to 48 hours", () => {
    expect(EVENT_DEFAULT_CANCEL_CUTOFF_HOURS).toBe(48);
  });

  it("caps recovery at ₹5k/cycle from MBDP share only", () => {
    expect(
      mbdpRecoveryAmountForCycle({
        remainingRecoverableMinor: 5_500_000,
        mbdpShareMinor: 2_000_000,
      })
    ).toBe(500_000);
    expect(
      mbdpRecoveryAmountForCycle({
        remainingRecoverableMinor: 5_500_000,
        mbdpShareMinor: 0,
      })
    ).toBe(0);
  });
});
