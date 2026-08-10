import { describe, expect, it } from "vitest";
import {
  EBDP_CLIENTS_PER_PACK,
  EBDP_ENTITLEMENT_BPS,
  EBDP_ENTITLEMENT_COPY,
  EBDP_PERSON_MAX_PACKS,
  EBDP_STANDARD_MAX_CLIENTS,
  ENTERPRISE_BDP_ROLE_LABEL,
  ENTERPRISE_CLIENT_ROLE_LABEL,
  ENTERPRISE_EXPERT_ROLE_LABEL,
  ENTERPRISE_PLATFORM_COMMISSION_BPS,
  EXPERT_NO_COMMISSION_COPY,
  FINANCE_COSIGN_COPY,
  FINANCE_COSIGN_THRESHOLD_MINOR,
  GCE_EXECUTION_ROLE_COPY,
  ORG_VS_REP_COPY,
  VENDOR_MANAGED_RECORD_COPY,
  attributionStatusLabel,
  clientCapacityLabel,
  containsStaleEnterpriseTerm,
  ebdpPackageOptionLabel,
  financeCosignRequired,
  financeCosignStatusLabel,
} from "@/lib/frontend/enterprise/format";
import { calculateEnterpriseEntitlement } from "@/lib/architecture/enterprise/constants";
import {
  workspaceNavSections,
  WORKSPACE_LEGACY_QUARANTINE,
} from "@/lib/frontend/navigation/workspace";

describe("Batch 6 Enterprise Client / BDP / Expert presentation", () => {
  it("keeps organisation distinct from representative", () => {
    expect(ORG_VS_REP_COPY.toLowerCase()).toMatch(/organisation is separate/);
    expect(ENTERPRISE_CLIENT_ROLE_LABEL).toBe("Enterprise Client");
  });

  it("presents EBDP pack capacity 30 / max 2 packs / 60 clients", () => {
    expect(EBDP_CLIENTS_PER_PACK).toBe(30);
    expect(EBDP_PERSON_MAX_PACKS).toBe(2);
    expect(EBDP_STANDARD_MAX_CLIENTS).toBe(60);
    expect(clientCapacityLabel(5)).toBe("5 / 30");
    expect(clientCapacityLabel(40)).toBe("30 / 30");
  });

  it("labels packages ₹30k / ₹36k from canonical constants", () => {
    expect(ebdpPackageOptionLabel("direct_30000")).toMatch(/30,000/);
    expect(ebdpPackageOptionLabel("finance_recovery_36000")).toMatch(/36,000/);
  });

  it("entitlement is 25% of platform commission — not project value", () => {
    expect(EBDP_ENTITLEMENT_BPS).toBe(2500);
    expect(ENTERPRISE_PLATFORM_COMMISSION_BPS).toBe(2000);
    const projectValue = 10_000_000_00; // ₹1,00,00,000
    const wrong = Math.floor((projectValue * 2500) / 10_000);
    const right = calculateEnterpriseEntitlement({
      eligibleEventRevenueMinor: projectValue,
      hasValidAttribution: true,
    });
    expect(right.ebdpEntitlementMinor).not.toBe(wrong);
    expect(right.ebdpEntitlementMinor).toBe(
      Math.floor((right.platformCommissionMinor * 2500) / 10_000)
    );
    expect(EBDP_ENTITLEMENT_COPY.toLowerCase()).toMatch(/platform commission/);
    expect(EBDP_ENTITLEMENT_COPY.toLowerCase()).toMatch(/not 25% of total project value/);
  });

  it("Finance co-sign is strictly greater than ₹5,00,000", () => {
    expect(FINANCE_COSIGN_THRESHOLD_MINOR).toBe(50_000_000);
    expect(financeCosignRequired(50_000_000)).toBe(false);
    expect(financeCosignRequired(50_000_001)).toBe(true);
    expect(FINANCE_COSIGN_COPY.toLowerCase()).toMatch(/above ₹5,00,000|above ₹5/);
    expect(containsStaleEnterpriseTerm("₹5,00,000 and above")).toBe(true);
    expect(containsStaleEnterpriseTerm(">= ₹5,00,000")).toBe(true);
  });

  it("presents finance co-sign states without granting client/expert approval", () => {
    expect(financeCosignStatusLabel({ required: false }).label.toLowerCase()).toMatch(
      /not required/
    );
    expect(
      financeCosignStatusLabel({ required: true, status: "pending_finance_cosign" }).tone
    ).toBe("pending");
  });

  it("rejects territory ownership, fixed milestones, vendor portal, expert commission", () => {
    expect(ENTERPRISE_BDP_ROLE_LABEL).not.toMatch(/BDM|territory/i);
    expect(containsStaleEnterpriseTerm("30/40/30")).toBe(true);
    expect(containsStaleEnterpriseTerm("Vendor login")).toBe(true);
    expect(containsStaleEnterpriseTerm("Expert commission")).toBe(true);
    expect(containsStaleEnterpriseTerm("25% of project value")).toBe(true);
    expect(VENDOR_MANAGED_RECORD_COPY.toLowerCase()).toMatch(
      /not available|no vendor self-service/
    );
    expect(EXPERT_NO_COMMISSION_COPY.toLowerCase()).toMatch(/no automatic/);
    expect(GCE_EXECUTION_ROLE_COPY.toLowerCase()).toMatch(/does not automatically physically execute/);
  });

  it("treats organic/unattributed attribution as valid and prospective reassignment language", () => {
    expect(attributionStatusLabel("unattributed").toLowerCase()).toMatch(/valid|organic/);
    expect(attributionStatusLabel("reassigned").toLowerCase()).toMatch(/prospective/);
  });

  it("exposes Enterprise Client, BDP, Expert nav without Super Admin / vendor portal", () => {
    const client = workspaceNavSections("enterprise-client")
      .flatMap((s) => s.items)
      .map((i) => i.href)
      .join(" ");
    const bdp = workspaceNavSections("enterprise-bdp")
      .flatMap((s) => s.items)
      .map((i) => i.href)
      .join(" ");
    const ops = workspaceNavSections("platform-ops")
      .flatMap((s) => s.items)
      .map((i) => i.href)
      .join(" ");
    expect(client).toMatch(/\/enterprise\/opportunities/);
    expect(client).toMatch(/\/enterprise\/projects/);
    expect(bdp).toMatch(/\/enterprise-bdp\/clients/);
    expect(bdp).not.toMatch(/territory|zone/i);
    expect(ops).toMatch(/\/enterprise-expert/);
    expect(ops).not.toMatch(/\/vendor\/dashboard|vendor-login/i);
    expect(ENTERPRISE_EXPERT_ROLE_LABEL).toBe("Enterprise Platform Expert");
    expect(WORKSPACE_LEGACY_QUARANTINE.some((q) => q.id === "super-admin")).toBe(
      true
    );
  });
});
