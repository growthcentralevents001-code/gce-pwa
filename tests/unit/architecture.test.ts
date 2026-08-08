import { describe, expect, it } from "vitest";
import { mapLegacyRole, legacyRolesGrantEntitlement } from "@/lib/architecture/legacy/roleMap";
import {
  canAccessWorkspace,
  resolveLegacyDashboardPath,
  workspacesForAssignments,
} from "@/lib/architecture/workspace/registry";
import type { RoleAssignment } from "@/lib/architecture/types";
import { assertBalancedEntries } from "@/lib/architecture/ledger/posting";
import { AppError } from "@/lib/architecture/errors";
import { getDefaultFlag, isKnownFeatureFlag } from "@/lib/architecture/feature-flags/flags";

describe("legacy role quarantine", () => {
  it("never grants entitlement from legacy enum alone", () => {
    expect(legacyRolesGrantEntitlement()).toBe(false);
    expect(mapLegacyRole("zbp").grantsEntitlement).toBe(false);
    expect(mapLegacyRole("affiliate").mappingStatus).toBe("quarantined");
    expect(mapLegacyRole("bdm").mappingStatus).toBe("unresolved");
    expect(mapLegacyRole("franchisee").mappingStatus).toBe("quarantined");
  });
});

describe("workspace registry", () => {
  const assignment = (roleKey: RoleAssignment["roleKey"]): RoleAssignment => ({
    id: "1",
    userId: "u1",
    roleKey,
    status: "active",
    scopeType: "platform",
    scopeId: null,
    organisationId: null,
    effectiveFrom: new Date(0).toISOString(),
    effectiveTo: null,
  });

  it("derives workspaces from active assignments", () => {
    const ws = workspacesForAssignments([assignment("connect_bdp")]);
    expect(ws).toContain("personal");
    expect(ws).toContain("connect-bdp");
    expect(canAccessWorkspace([assignment("connect_bdp")], "marketplace-bdp")).toBe(false);
  });

  it("quarantines legacy dashboards without entitlement", () => {
    const zbp = resolveLegacyDashboardPath("/dashboard/zbp");
    expect(zbp?.entitled).toBe(false);
    expect(zbp?.target).toBe("/unauthorized");
  });
});

describe("ledger balance guard", () => {
  it("requires balanced debit/credit", () => {
    expect(() =>
      assertBalancedEntries([
        { accountId: "a", direction: "debit", amountMinor: 100 },
        { accountId: "b", direction: "credit", amountMinor: 90 },
      ])
    ).toThrow(AppError);

    expect(() =>
      assertBalancedEntries([
        { accountId: "a", direction: "debit", amountMinor: 100 },
        { accountId: "b", direction: "credit", amountMinor: 100 },
      ])
    ).not.toThrow();
  });
});

describe("feature flags", () => {
  it("defaults inactive/money flags to OFF", () => {
    expect(isKnownFeatureFlag("wallet_cashout")).toBe(true);
    expect(getDefaultFlag("wallet_cashout")).toBe(false);
    expect(getDefaultFlag("marketplace_ticket_payments")).toBe(false);
    expect(getDefaultFlag("marketplace_affiliate")).toBe(false);
  });
});
