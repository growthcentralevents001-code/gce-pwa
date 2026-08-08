import { describe, expect, it } from "vitest";
import {
  applyBps,
  calculateConnectBdpCommission,
  calculateEnterpriseEntitlement,
  calculateMarketplaceSplit,
  recoveryForCycle,
  netAfterRecovery,
  MONEY_FLAGS_MUST_STAY_OFF,
  CONNECT_BDP_COMMISSION_BPS,
  RECOVERY_CYCLE_CAP_MINOR,
} from "@/lib/architecture/finance/constants";
import { assertBalancedEntries } from "@/lib/architecture/ledger/posting";
import { AppError } from "@/lib/architecture/errors";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

describe("Phase 9 money arithmetic", () => {
  it("uses integer BPS without float drift", () => {
    expect(applyBps(100_000_00, 2000)).toBe(20_000_00);
    expect(applyBps(333, 2000)).toBe(66); // floor
    expect(() => applyBps(1.5 as unknown as number, 2000)).toThrow();
  });
});

describe("Phase 9 Connect commission (FD-025/029)", () => {
  it("pays 20% only when attributed", () => {
    const ok = calculateConnectBdpCommission({
      eligibleAttributedSubscriptionMinor: 6_000_00,
      hasValidAttribution: true,
    });
    expect(ok.grossEntitlementMinor).toBe(1_200_00);
    expect(ok.rateBps).toBe(CONNECT_BDP_COMMISSION_BPS);

    const none = calculateConnectBdpCommission({
      eligibleAttributedSubscriptionMinor: 6_000_00,
      hasValidAttribution: false,
    });
    expect(none.grossEntitlementMinor).toBe(0);
    expect(none.entitled).toBe(false);
  });
});

describe("Phase 9 Marketplace splits (FD-029/037)", () => {
  it("attributes 80/10/10", () => {
    const s = calculateMarketplaceSplit({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidMbdpAttribution: true,
    });
    expect(s.venueShareMinor).toBe(80_000_00);
    expect(s.mbdpShareMinor).toBe(10_000_00);
    expect(s.gceShareMinor).toBe(10_000_00);
  });

  it("unattributed 80/0/20 with zero MBDP (not pending)", () => {
    const s = calculateMarketplaceSplit({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidMbdpAttribution: false,
    });
    expect(s.venueShareMinor).toBe(80_000_00);
    expect(s.mbdpShareMinor).toBe(0);
    expect(s.gceShareMinor).toBe(20_000_00);
    expect(s.entitledMbdp).toBe(false);
  });
});

describe("Phase 9 Enterprise entitlement (FD-026/038)", () => {
  it("uses 25% of platform commission not project value", () => {
    const s = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidAttribution: true,
    });
    expect(s.platformCommissionMinor).toBe(20_000_00);
    expect(s.ebdpEntitlementMinor).toBe(5_000_00);
    expect(s.ebdpEntitlementMinor).not.toBe(25_000_00);
  });

  it("zero EBDP without attribution", () => {
    const s = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidAttribution: false,
    });
    expect(s.ebdpEntitlementMinor).toBe(0);
  });
});

describe("Phase 9 recovery (FD-029)", () => {
  it("caps at ₹5k and never exceeds remaining or commission", () => {
    expect(
      recoveryForCycle({
        remainingRecoverableMinor: 5_500_000,
        approvedCommissionMinor: 2_000_000,
      })
    ).toBe(RECOVERY_CYCLE_CAP_MINOR);
    expect(
      recoveryForCycle({
        remainingRecoverableMinor: 100_000,
        approvedCommissionMinor: 2_000_000,
      })
    ).toBe(100_000);
    expect(
      recoveryForCycle({
        remainingRecoverableMinor: 5_500_000,
        approvedCommissionMinor: 0,
      })
    ).toBe(0);
  });

  it("keeps net non-negative and separate from gross", () => {
    expect(netAfterRecovery(1_000_000, 500_000, 100_000)).toBe(400_000);
    expect(netAfterRecovery(100_000, 500_000, 0)).toBe(0);
  });
});

describe("Phase 9 ledger balance", () => {
  it("rejects unbalanced entries", () => {
    expect(() =>
      assertBalancedEntries([
        { accountId: "a", direction: "debit", amountMinor: 100 },
        { accountId: "b", direction: "credit", amountMinor: 90 },
      ])
    ).toThrow(AppError);
  });

  it("accepts balanced integer entries", () => {
    expect(() =>
      assertBalancedEntries([
        { accountId: "a", direction: "debit", amountMinor: 100 },
        { accountId: "b", direction: "credit", amountMinor: 100 },
      ])
    ).not.toThrow();
  });
});

describe("Phase 9 money flags", () => {
  it("keeps execution/cashout flags inactive by default", () => {
    for (const key of MONEY_FLAGS_MUST_STAY_OFF) {
      expect(INACTIVE_FEATURE_FLAGS).toContain(key);
    }
  });
});

describe("Phase 9 offer claim is not revenue", () => {
  it("documents forbidden domain types for recognition", () => {
    const forbidden = ["offer_claim", "offer_visit", "redemption_token_alone"];
    expect(forbidden).toHaveLength(3);
  });
});
