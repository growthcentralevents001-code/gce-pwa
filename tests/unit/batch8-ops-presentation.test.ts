import { describe, expect, it } from "vitest";
import {
  assertOpsNotSelfApproval,
  actorHasOpsAdminPermission,
} from "@/lib/architecture/ops-admin/permissions";
import {
  CONNECT_OPS_COPY,
  DESK_COPY,
  ENTERPRISE_OPS_COPY,
  MARKETPLACE_OPS_COPY,
  COMPLIANCE_SAFE_COPY,
  isSelfApprovalBlocked,
  complianceHoldLabel,
  maskSensitiveId,
  opsStatusTone,
} from "@/lib/frontend/ops/format";
import { AppError } from "@/lib/errors";
import type { RoleAssignment } from "@/lib/architecture/types";

function assignment(roleKey: RoleAssignment["roleKey"]): RoleAssignment {
  return {
    id: `a-${roleKey}`,
    userId: "u1",
    roleKey,
    status: "active",
    scopeType: "platform",
    scopeId: null,
    organisationId: null,
    effectiveFrom: "2020-01-01T00:00:00.000Z",
    effectiveTo: null,
  };
}

describe("Batch 8 ops presentation safety", () => {
  it("blocks self-approval in UI helper and backend assert", () => {
    expect(isSelfApprovalBlocked("u1", "u1")).toBe(true);
    expect(isSelfApprovalBlocked("u1", "u2")).toBe(false);
    expect(() => assertOpsNotSelfApproval("u1", "u1")).toThrow(AppError);
    expect(() => assertOpsNotSelfApproval("u1", "u2")).not.toThrow();
  });

  it("scopes Platform vs Finance vs Compliance vs Support (no mega-admin)", () => {
    const platform = [assignment("platform_admin")];
    const finance = [assignment("finance_admin")];
    const compliance = [assignment("compliance_admin")];
    const support = [assignment("support_admin")];
    const rm = [assignment("relationship_manager")];

    expect(actorHasOpsAdminPermission(platform, "ops.marketplace")).toBe(true);
    expect(actorHasOpsAdminPermission(finance, "ops.marketplace")).toBe(false);
    expect(actorHasOpsAdminPermission(finance, "ops.finance")).toBe(true);
    expect(actorHasOpsAdminPermission(compliance, "ops.compliance")).toBe(true);
    expect(actorHasOpsAdminPermission(compliance, "ops.finance")).toBe(false);
    expect(actorHasOpsAdminPermission(support, "ops.support")).toBe(true);
    expect(actorHasOpsAdminPermission(support, "ops.compliance")).toBe(false);
    expect(actorHasOpsAdminPermission(rm, "ops.connect")).toBe(true);
    expect(actorHasOpsAdminPermission(rm, "ops.finance")).toBe(false);
    expect(actorHasOpsAdminPermission(rm, "ops.compliance")).toBe(false);
  });

  it("preserves vertical boundary copy", () => {
    expect(CONNECT_OPS_COPY.confirmBoundary).toMatch(/Platform confirms/);
    expect(MARKETPLACE_OPS_COPY.venueFinal).toMatch(/final Venue/);
    expect(MARKETPLACE_OPS_COPY.mbdpRecommend).toMatch(/recommend/);
    expect(ENTERPRISE_OPS_COPY.cosign).toMatch(/₹5,00,000/);
    expect(ENTERPRISE_OPS_COPY.expertNoCommission).toMatch(/no automatic commission/i);
    expect(DESK_COPY.candidateNotAssignment).toMatch(/Candidates are suggestions/);
    expect(DESK_COPY.paidOff).toMatch(/OFF/);
    expect(COMPLIANCE_SAFE_COPY.notLegalDetermination).toMatch(
      /not a legal/
    );
  });

  it("maps hold labels and masks sensitive ids without blue status reliance", () => {
    expect(complianceHoldLabel("active")).toBe("Active");
    expect(complianceHoldLabel("released")).toBe("Released");
    expect(maskSensitiveId("abcdefghijklmnop", 4)).toMatch(/mnop$/);
    expect(opsStatusTone("pending")).toBe("pending");
    expect(opsStatusTone("approved")).toBe("success");
    expect(opsStatusTone("rejected")).toBe("error");
  });

  it("does not productize Super Admin permission shortcuts", () => {
    const desk = [assignment("opportunity_desk")];
    expect(actorHasOpsAdminPermission(desk, "ops.approvals.review")).toBe(
      false
    );
    expect(actorHasOpsAdminPermission(desk, "ops.finance")).toBe(false);
    const expert = [assignment("enterprise_platform_expert")];
    expect(actorHasOpsAdminPermission(expert, "ops.approvals.review")).toBe(
      false
    );
    const support = [assignment("support_admin")];
    expect(actorHasOpsAdminPermission(support, "ops.approvals.review")).toBe(
      true
    );
  });
});
