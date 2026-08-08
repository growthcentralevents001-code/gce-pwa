import { describe, expect, it } from "vitest";
import {
  calculateConnectBdpCommission,
  packageAmounts,
  recoveryAmountForCycle,
  CONNECT_BDP_COMMISSION_BPS,
  CONNECT_BDP_DIRECT_TOTAL_MINOR,
  CONNECT_BDP_FINANCE_TOTAL_MINOR,
  CONNECT_BDP_FINANCE_INITIAL_MINOR,
  CONNECT_BDP_RECOVERABLE_MINOR,
  CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
  CITY_TIER_MAX_UNITS,
} from "@/lib/architecture/connect-bdp/constants";

describe("Phase 6 Connect BDP package economics (FD-025/029)", () => {
  it("direct package is ₹50,000 with zero recoverable", () => {
    const a = packageAmounts("direct_50000");
    expect(a.packageTotalMinor).toBe(CONNECT_BDP_DIRECT_TOTAL_MINOR);
    expect(a.initialPaymentMinor).toBe(5_000_000);
    expect(a.recoverableBalanceMinor).toBe(0);
  });

  it("finance package is ₹60,000 with ₹5,000 initial and ₹55,000 recoverable", () => {
    const a = packageAmounts("finance_recovery_60000");
    expect(a.packageTotalMinor).toBe(CONNECT_BDP_FINANCE_TOTAL_MINOR);
    expect(a.initialPaymentMinor).toBe(CONNECT_BDP_FINANCE_INITIAL_MINOR);
    expect(a.recoverableBalanceMinor).toBe(CONNECT_BDP_RECOVERABLE_MINOR);
  });

  it("uses 5 Circles / 10 months target constants", () => {
    expect(CONNECT_BDP_TARGET_CIRCLES).toBe(5);
    expect(CONNECT_BDP_TARGET_MONTHS).toBe(10);
  });

  it("city tier maxima are FD-025 values (10/5/2)", () => {
    expect(CITY_TIER_MAX_UNITS.tier_1).toBe(10);
    expect(CITY_TIER_MAX_UNITS.tier_2).toBe(5);
    expect(CITY_TIER_MAX_UNITS.tier_3).toBe(2);
  });
});

describe("Phase 6 Connect BDP commission entitlement boundary", () => {
  it("charges 20% when valid attribution exists", () => {
    const r = calculateConnectBdpCommission(600_000, true);
    expect(CONNECT_BDP_COMMISSION_BPS).toBe(2000);
    expect(r.entitled).toBe(true);
    expect(r.grossCommissionMinor).toBe(120_000);
  });

  it("returns 0 BDP entitlement without attribution (not pending)", () => {
    const r = calculateConnectBdpCommission(600_000, false);
    expect(r.entitled).toBe(false);
    expect(r.grossCommissionMinor).toBe(0);
  });

  it("returns 0 for non-positive revenue even with attribution", () => {
    expect(calculateConnectBdpCommission(0, true).grossCommissionMinor).toBe(0);
  });
});

describe("Phase 6 package recovery caps (FD-029)", () => {
  it("caps per cycle at ₹5,000", () => {
    expect(
      recoveryAmountForCycle({
        remainingRecoverableMinor: CONNECT_BDP_RECOVERABLE_MINOR,
        grossCommissionMinor: 2_000_000,
      })
    ).toBe(CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR);
  });

  it("cannot recover more than remaining balance", () => {
    expect(
      recoveryAmountForCycle({
        remainingRecoverableMinor: 100_000,
        grossCommissionMinor: 2_000_000,
      })
    ).toBe(100_000);
  });

  it("cannot recover more than eligible commission", () => {
    expect(
      recoveryAmountForCycle({
        remainingRecoverableMinor: CONNECT_BDP_RECOVERABLE_MINOR,
        grossCommissionMinor: 250_000,
      })
    ).toBe(250_000);
  });

  it("returns 0 when remaining or commission is zero", () => {
    expect(
      recoveryAmountForCycle({
        remainingRecoverableMinor: 0,
        grossCommissionMinor: 500_000,
      })
    ).toBe(0);
    expect(
      recoveryAmountForCycle({
        remainingRecoverableMinor: 500_000,
        grossCommissionMinor: 0,
      })
    ).toBe(0);
  });

  it("never exceeds total ₹55,000 across simulated cycles", () => {
    let remaining = CONNECT_BDP_RECOVERABLE_MINOR;
    let recovered = 0;
    for (let i = 0; i < 20; i++) {
      const amt = recoveryAmountForCycle({
        remainingRecoverableMinor: remaining,
        grossCommissionMinor: 800_000,
      });
      recovered += amt;
      remaining -= amt;
    }
    expect(recovered).toBe(CONNECT_BDP_RECOVERABLE_MINOR);
    expect(remaining).toBe(0);
    expect(recovered).toBeLessThanOrEqual(5_500_000);
  });
});
