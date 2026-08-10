import { describe, expect, it } from "vitest";
import {
  CONNECT_BDP_COMMISSION_BPS,
  FINANCE_ROLE_LABEL,
  GROSS_IMMUTABLE_COPY,
  MONEY_FLAGS_MUST_STAY_OFF,
  NO_TAX_INVENTION_COPY,
  PAYMENT_VS_REVENUE_COPY,
  PAYOUT_GATED_COPY,
  REFUND_GATED_COPY,
  SETTLEMENT_GATED_COPY,
  containsStaleFinanceTerm,
  formatMinorInr,
  maskReference,
  moneyFlagIsOff,
  recognitionStatusLabel,
  recoveryBreakdownRows,
} from "@/lib/frontend/finance/format";
import {
  calculateMarketplaceSplit,
  calculateEnterpriseEntitlement,
} from "@/lib/architecture/finance/constants";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import {
  workspaceNavSections,
  WORKSPACE_LEGACY_QUARANTINE,
} from "@/lib/frontend/navigation/workspace";

describe("Batch 7 Finance presentation", () => {
  it("keeps payment distinct from revenue recognition", () => {
    expect(PAYMENT_VS_REVENUE_COPY.toLowerCase()).toMatch(/not revenue recognised/);
    expect(recognitionStatusLabel("payment_received").toLowerCase()).toMatch(
      /not yet recognised/
    );
    expect(recognitionStatusLabel("recognised").toLowerCase()).toMatch(/recognised/);
  });

  it("formats minor units as INR without double-dividing", () => {
    expect(formatMinorInr(100_00)).toMatch(/₹\s?100|₹100/);
    expect(formatMinorInr(50_000_000)).toMatch(/5,00,000|500,000/);
    expect(maskReference("NEFT1234567890")).toMatch(/…/);
  });

  it("presents recovery separate from gross and keeps gross immutable copy", () => {
    const rows = recoveryBreakdownRows({
      grossEntitlementMinor: 10_000_00,
      recoveryDeductionMinor: 2_000_00,
      reversalAmountMinor: 0,
      netSettlementEligibleMinor: 8_000_00,
    });
    expect(rows[0]?.id).toBe("gross");
    expect(rows[1]?.id).toBe("recovery");
    expect(GROSS_IMMUTABLE_COPY.toLowerCase()).toMatch(/immutable/);
    expect(containsStaleFinanceTerm("Edit Ledger")).toBe(true);
    expect(containsStaleFinanceTerm("Edit Commission")).toBe(true);
  });

  it("does not treat missing Marketplace 10% as pending", () => {
    const unattributed = calculateMarketplaceSplit({
      eligibleEventRevenueMinor: 10_000_00,
      hasValidMbdpAttribution: false,
    });
    expect(unattributed.mbdpShareMinor).toBe(0);
    expect(containsStaleFinanceTerm("pending Marketplace 10%")).toBe(true);
  });

  it("does not treat EBDP as 25% of project value", () => {
    const project = 10_000_000_00;
    const wrong = Math.floor((project * 2500) / 10_000);
    const right = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: project,
      hasValidAttribution: true,
    });
    expect(right.ebdpEntitlementMinor).not.toBe(wrong);
    expect(containsStaleFinanceTerm("25% of project value")).toBe(true);
  });

  it("gates settlement, payout, and refund execution", () => {
    expect(MONEY_FLAGS_MUST_STAY_OFF).toContain("settlement_execution");
    expect(MONEY_FLAGS_MUST_STAY_OFF).toContain("payout_execution");
    expect(INACTIVE_FEATURE_FLAGS).toContain("settlement_execution");
    expect(INACTIVE_FEATURE_FLAGS).toContain("payout_execution");
    expect(moneyFlagIsOff({}, "settlement_execution")).toBe(true);
    expect(moneyFlagIsOff({ settlement_execution: false }, "settlement_execution")).toBe(
      true
    );
    expect(SETTLEMENT_GATED_COPY.toLowerCase()).toMatch(/off/);
    expect(PAYOUT_GATED_COPY.toLowerCase()).toMatch(/off/);
    expect(REFUND_GATED_COPY.toLowerCase()).toMatch(/off/);
    expect(containsStaleFinanceTerm("Pay Now")).toBe(true);
  });

  it("refuses hardcoded tax invention and Super Admin finance shortcuts", () => {
    expect(NO_TAX_INVENTION_COPY.toLowerCase()).toMatch(/gst|tds/);
    expect(containsStaleFinanceTerm("GST 18%")).toBe(true);
    expect(containsStaleFinanceTerm("TDS 10%")).toBe(true);
    expect(containsStaleFinanceTerm("Super Admin finance")).toBe(true);
    expect(CONNECT_BDP_COMMISSION_BPS).toBe(2000);
    expect(containsStaleFinanceTerm("10% Connect BDP")).toBe(true);
  });

  it("exposes Finance nav to inventory routes without Pay Now", () => {
    const hrefs = workspaceNavSections("finance")
      .flatMap((s) => s.items)
      .map((i) => i.href)
      .join(" ");
    expect(hrefs).toMatch(/\/dashboard\/finance/);
    expect(hrefs).toMatch(/\/finance\/revenue/);
    expect(hrefs).toMatch(/\/finance\/entitlements/);
    expect(hrefs).toMatch(/\/finance\/settlements/);
    expect(hrefs).toMatch(/\/finance\/reconciliation/);
    expect(hrefs).toMatch(/\/finance\/refunds/);
    expect(hrefs).toMatch(/\/finance\/offline/);
    expect(hrefs.toLowerCase()).not.toMatch(/pay-now|pay partner/);
    expect(FINANCE_ROLE_LABEL).toBe("Finance");
    expect(WORKSPACE_LEGACY_QUARANTINE.some((q) => q.id === "super-admin")).toBe(
      true
    );
  });
});
