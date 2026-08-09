import { describe, expect, it } from "vitest";
import {
  CONNECT_BDP_CIRCLES_PER_UNIT,
  CONNECT_BDP_COMMISSION_BPS,
  CONNECT_BDP_DIRECT_TOTAL_MINOR,
  CONNECT_BDP_FINANCE_INITIAL_MINOR,
  CONNECT_BDP_FINANCE_TOTAL_MINOR,
  CONNECT_BDP_RECOVERABLE_MINOR,
  CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR,
  CONNECT_BDP_ROLE_LABEL,
  CONNECT_BDP_TARGET_CIRCLES,
  CONNECT_BDP_TARGET_MONTHS,
  CITY_TIER_MAX_UNITS,
  applicationStatusLabel,
  attributionStatusLabel,
  cityTierCap,
  containsStaleConnectBdpTerm,
  formatCommissionRateLabel,
  formatMinorInr,
  maintenanceStatusLabel,
  packageCanonicalAmounts,
  packageOptionLabel,
  targetProgressLabel,
  unitCircleCapacityLabel,
} from "@/lib/frontend/partner/format";
import { workspaceNavSections } from "@/lib/frontend/navigation/workspace";
import { WORKSPACE_LEGACY_QUARANTINE } from "@/lib/frontend/navigation/workspace";

describe("Batch 4 Connect BDP presentation", () => {
  it("uses canonical Connect BDP role label (not BDM/ZBP)", () => {
    expect(CONNECT_BDP_ROLE_LABEL).toBe("Connect BDP");
    expect(CONNECT_BDP_ROLE_LABEL).not.toMatch(/BDM|ZBP/);
  });

  it("presents target as 5 Circles in 10 months", () => {
    expect(CONNECT_BDP_TARGET_CIRCLES).toBe(5);
    expect(CONNECT_BDP_TARGET_MONTHS).toBe(10);
    expect(targetProgressLabel(2, 5)).toBe("2 / 5");
    expect(targetProgressLabel(5, 5)).toBe("5 / 5");
  });

  it("caps unit Circles at 5", () => {
    expect(CONNECT_BDP_CIRCLES_PER_UNIT).toBe(5);
    expect(unitCircleCapacityLabel(3)).toBe("3 / 5");
    expect(unitCircleCapacityLabel(6)).toBe("5 / 5");
  });

  it("uses 20% commission rate — not stale 10%", () => {
    expect(CONNECT_BDP_COMMISSION_BPS).toBe(2000);
    expect(formatCommissionRateLabel()).toBe("20%");
    expect(formatCommissionRateLabel()).not.toBe("10%");
  });

  it("uses current package amounts (Direct 50k / Finance 60k)", () => {
    expect(CONNECT_BDP_DIRECT_TOTAL_MINOR).toBe(5_000_000);
    expect(CONNECT_BDP_FINANCE_TOTAL_MINOR).toBe(6_000_000);
    expect(CONNECT_BDP_FINANCE_INITIAL_MINOR).toBe(500_000);
    expect(CONNECT_BDP_RECOVERABLE_MINOR).toBe(5_500_000);
    expect(CONNECT_BDP_RECOVERY_CYCLE_CAP_MINOR).toBe(500_000);
    expect(packageCanonicalAmounts("direct_50000").totalMinor).toBe(5_000_000);
    expect(packageCanonicalAmounts("finance_recovery_60000")).toEqual({
      totalMinor: 6_000_000,
      initialMinor: 500_000,
      recoverableMinor: 5_500_000,
    });
    expect(packageOptionLabel("direct_50000")).toContain("50,000");
    expect(packageOptionLabel("finance_recovery_60000")).toContain("60,000");
  });

  it("presents city tier caps 10 / 5 / 2 (not stale 5/2/1)", () => {
    expect(CITY_TIER_MAX_UNITS.tier_1).toBe(10);
    expect(CITY_TIER_MAX_UNITS.tier_2).toBe(5);
    expect(CITY_TIER_MAX_UNITS.tier_3).toBe(2);
    expect(cityTierCap("tier_1")).toBe(10);
  });

  it("treats organic/unattributed as valid", () => {
    expect(attributionStatusLabel("unattributed").toLowerCase()).toMatch(
      /organic|unattributed/
    );
    expect(attributionStatusLabel("unattributed").toLowerCase()).toMatch(/valid/);
  });

  it("shows pending platform approval — not self-approval", () => {
    expect(applicationStatusLabel("pending_approval")).toMatch(/platform/i);
    expect(applicationStatusLabel("pending_approval").toLowerCase()).not.toMatch(
      /self-?approv/
    );
  });

  it("separates recovery-oriented maintenance labels from invented grace", () => {
    expect(maintenanceStatusLabel("not_applicable")).toMatch(/not applicable/i);
    expect(maintenanceStatusLabel("review_required")).toMatch(/review/i);
  });

  it("formats INR from minor units", () => {
    expect(formatMinorInr(5_000_000)).toMatch(/50,000/);
  });

  it("detects stale commercial/legacy terms", () => {
    expect(containsStaleConnectBdpTerm("BDM dashboard")).toBe(true);
    expect(containsStaleConnectBdpTerm("10% commission")).toBe(true);
    expect(containsStaleConnectBdpTerm("Connect BDP 20%")).toBe(false);
  });

  it("exposes Connect BDP nav without legacy quarantine terms", () => {
    const sections = workspaceNavSections("connect-bdp");
    const labels = sections.flatMap((s) => s.items.map((i) => i.label)).join(" ");
    expect(labels).toMatch(/Overview/);
    expect(labels).toMatch(/Members|Circles|Entitlements/);
    expect(labels).not.toMatch(/BDM|ZBP|franchisee/i);
    expect(
      WORKSPACE_LEGACY_QUARANTINE.some((q) => q.id === "bdm" || q.id === "zbp")
    ).toBe(true);
  });

  it("does not use decorative blue classes in partner format module surface strings", () => {
    // Presentation helpers should not encode blue Tailwind utilities.
    const src = [
      packageOptionLabel("direct_50000"),
      formatCommissionRateLabel(),
      CONNECT_BDP_ROLE_LABEL,
    ].join(" ");
    expect(src).not.toMatch(/blue-|#2563EB|sky-/i);
  });
});
