import { describe, expect, it } from "vitest";
import { calculateEnterpriseEntitlement } from "@/lib/architecture/enterprise/constants";
import {
  actorHasEnterprisePermission,
  actorIsEnterpriseBdp,
} from "@/lib/architecture/enterprise/permissions";
import type { RoleAssignment } from "@/lib/architecture/types";
import {
  EBDP_EARNINGS_DISCLAIMER,
  EBDP_ENTITLEMENT_COPY,
  containsStaleEnterpriseTerm,
} from "@/lib/frontend/enterprise/format";

describe("Enterprise BDP delta — permissions", () => {
  const ebdp = (userId = "bdp-a"): RoleAssignment => ({
    id: "1",
    userId,
    roleKey: "enterprise_bdp",
    status: "active",
    scopeType: "platform",
    scopeId: null,
    organisationId: null,
    effectiveFrom: new Date().toISOString(),
    effectiveTo: null,
  });

  it("grants propose attribution and handoff without manage or client write", () => {
    const a = [ebdp()];
    expect(actorHasEnterprisePermission(a, "enterprise.attribution.propose")).toBe(true);
    expect(actorHasEnterprisePermission(a, "enterprise.attribution.manage")).toBe(false);
    expect(actorHasEnterprisePermission(a, "enterprise.client.propose")).toBe(true);
    expect(actorHasEnterprisePermission(a, "enterprise.client.write")).toBe(false);
    expect(actorHasEnterprisePermission(a, "enterprise.handoff.request")).toBe(true);
    expect(actorIsEnterpriseBdp(a)).toBe(true);
  });

  it("does not grant another BDP role finance or quote authority", () => {
    const a = [ebdp()];
    expect(actorHasEnterprisePermission(a, "enterprise.quote.create")).toBe(false);
    expect(actorHasEnterprisePermission(a, "enterprise.project.write")).toBe(false);
  });
});

describe("Enterprise BDP delta — earning boundary", () => {
  it("calculates 25% of platform commission only when attributed", () => {
    const eligible = 10_000_000; // ₹10L
    const without = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: eligible,
      hasValidAttribution: false,
    });
    expect(without.ebdpEntitlementMinor).toBe(0);
    expect(without.entitledEbdp).toBe(false);

    const withAttr = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: eligible,
      hasValidAttribution: true,
    });
    expect(withAttr.platformCommissionMinor).toBe(2_000_000);
    expect(withAttr.ebdpEntitlementMinor).toBe(500_000);
    expect(withAttr.ebdpEntitlementMinor).not.toBe(
      Math.floor((eligible * 2500) / 10_000)
    );
  });

  it("uses safe marketing copy without guaranteed commission claims", () => {
    expect(EBDP_ENTITLEMENT_COPY.toLowerCase()).toMatch(/platform commission/);
    expect(EBDP_EARNINGS_DISCLAIMER.toLowerCase()).toMatch(/no guaranteed/);
    expect(containsStaleEnterpriseTerm("25% of project value")).toBe(true);
  });
});

describe("Enterprise BDP delta — public routes", () => {
  it("exports public opportunity page module", async () => {
    const page = await import("@/app/enterprise-bdp/page");
    expect(page.default).toBeTypeOf("function");
    expect(page.metadata).toBeDefined();
  });
});
