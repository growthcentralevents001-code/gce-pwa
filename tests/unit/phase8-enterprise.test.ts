import { describe, expect, it } from "vitest";
import {
  calculateEnterpriseEntitlement,
  ebdpPackageAmounts,
  ebdpRecoveryAmountForCycle,
  financeCosignRequired,
  EBDP_CLIENTS_PER_PACK,
  EBDP_PERSON_MAX_PACKS,
  EBDP_STANDARD_MAX_CLIENTS,
  FINANCE_COSIGN_THRESHOLD_MINOR,
  ENTERPRISE_MIN_PROJECT_VALUE_MINOR,
  ENTERPRISE_PLATFORM_COMMISSION_BPS,
  EBDP_ENTITLEMENT_BPS,
} from "@/lib/architecture/enterprise/constants";
import {
  actorHasEnterprisePermission,
  actorIsEnterpriseBdp,
} from "@/lib/architecture/enterprise/permissions";
import type { RoleAssignment } from "@/lib/architecture/types";

describe("Phase 8 Enterprise BDP pack (FD-026)", () => {
  it("supports direct ₹30k and financed ₹36k", () => {
    expect(ebdpPackageAmounts("direct_30000")).toEqual({
      packageTotalMinor: 3_000_000,
      initialPaymentMinor: 3_000_000,
      recoverableBalanceMinor: 0,
    });
    expect(ebdpPackageAmounts("finance_recovery_36000")).toEqual({
      packageTotalMinor: 3_600_000,
      initialPaymentMinor: 500_000,
      recoverableBalanceMinor: 3_100_000,
    });
  });

  it("uses 30 clients/pack, max 2 packs, 60 standard ceiling", () => {
    expect(EBDP_CLIENTS_PER_PACK).toBe(30);
    expect(EBDP_PERSON_MAX_PACKS).toBe(2);
    expect(EBDP_STANDARD_MAX_CLIENTS).toBe(60);
  });
});

describe("Phase 8 Finance co-sign threshold (FD-038)", () => {
  it("requires Finance co-sign when total > ₹5,00,000", () => {
    expect(FINANCE_COSIGN_THRESHOLD_MINOR).toBe(50_000_000);
    expect(financeCosignRequired(50_000_000)).toBe(false);
    expect(financeCosignRequired(50_000_001)).toBe(true);
    expect(financeCosignRequired(4_999_999)).toBe(false);
  });
});

describe("Phase 8 Enterprise entitlement (FD-026/029/038)", () => {
  it("gives EBDP 25% of platform commission when attributed", () => {
    // ₹10,00,000 eligible → 20% platform = ₹2,00,000 → 25% EBDP = ₹50,000
    const s = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidAttribution: true,
    });
    expect(ENTERPRISE_PLATFORM_COMMISSION_BPS).toBe(2000);
    expect(EBDP_ENTITLEMENT_BPS).toBe(2500);
    expect(s.platformCommissionMinor).toBe(20_000_00);
    expect(s.ebdpEntitlementMinor).toBe(5_000_00);
    expect(s.entitledEbdp).toBe(true);
  });

  it("gives zero EBDP entitlement without attribution (not pending)", () => {
    const s = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: 100_000_00,
      hasValidAttribution: false,
    });
    expect(s.platformCommissionMinor).toBe(20_000_00);
    expect(s.ebdpEntitlementMinor).toBe(0);
    expect(s.entitledEbdp).toBe(false);
  });

  it("does not treat EBDP share as % of total project value", () => {
    const project = 100_000_00;
    const s = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: project,
      hasValidAttribution: true,
    });
    expect(s.ebdpEntitlementMinor).not.toBe(Math.floor(project * 0.25));
    expect(s.ebdpEntitlementMinor).toBe(
      Math.floor((Math.floor((project * 2000) / 10_000) * 2500) / 10_000)
    );
  });

  it("caps recovery at ₹5k/cycle from EBDP share only", () => {
    expect(
      ebdpRecoveryAmountForCycle({
        remainingRecoverableMinor: 3_100_000,
        ebdpShareMinor: 2_000_000,
      })
    ).toBe(500_000);
    expect(
      ebdpRecoveryAmountForCycle({
        remainingRecoverableMinor: 3_100_000,
        ebdpShareMinor: 0,
      })
    ).toBe(0);
  });

  it("records minimum project value constant ₹1L", () => {
    expect(ENTERPRISE_MIN_PROJECT_VALUE_MINOR).toBe(10_000_000);
  });
});

describe("Phase 8 RBAC boundaries", () => {
  const assignment = (
    roleKey: RoleAssignment["roleKey"]
  ): RoleAssignment => ({
    id: "a",
    userId: "u",
    roleKey,
    status: "active",
    scopeType: "platform",
    scopeId: null,
    organisationId: null,
    effectiveFrom: new Date().toISOString(),
    effectiveTo: null,
  });

  it("does not let Enterprise BDP issue quotes or finance-cosign", () => {
    const a = [assignment("enterprise_bdp")];
    expect(actorIsEnterpriseBdp(a)).toBe(true);
    expect(actorHasEnterprisePermission(a, "enterprise.quote.issue")).toBe(
      false
    );
    expect(
      actorHasEnterprisePermission(a, "enterprise.quote.finance_cosign")
    ).toBe(false);
    expect(actorHasEnterprisePermission(a, "enterprise.entitlement.read")).toBe(
      true
    );
  });

  it("lets Finance co-sign and Expert issue", () => {
    expect(
      actorHasEnterprisePermission(
        [assignment("finance_admin")],
        "enterprise.quote.finance_cosign"
      )
    ).toBe(true);
    expect(
      actorHasEnterprisePermission(
        [assignment("enterprise_platform_expert")],
        "enterprise.quote.issue"
      )
    ).toBe(true);
  });

  it("does not auto-commission Client Representatives", () => {
    const a = [assignment("enterprise_client_representative")];
    expect(
      actorHasEnterprisePermission(a, "enterprise.entitlement.read")
    ).toBe(false);
  });
});
