import { describe, expect, it } from "vitest";
import {
  assertNotSelfApproval,
  canPerform,
  hasPlatformAdmin,
  type PermissionContext,
} from "@/lib/architecture/rbac/permissions";
import type { RoleAssignment } from "@/lib/architecture/types";
import { AppError } from "@/lib/architecture/errors";

const baseAssignment = (over: Partial<RoleAssignment> = {}): RoleAssignment => ({
  id: "a1",
  userId: "u1",
  roleKey: "circle_member",
  status: "active",
  scopeType: "platform",
  scopeId: null,
  organisationId: null,
  effectiveFrom: new Date(0).toISOString(),
  effectiveTo: null,
  ...over,
});

describe("rbac permissions", () => {
  it("blocks self-approval for finance actions", () => {
    const ctx: PermissionContext = {
      userId: "u1",
      activeAssignment: baseAssignment({ roleKey: "finance_admin" }),
      assignments: [baseAssignment({ roleKey: "finance_admin" })],
      isSelfSubject: true,
    };
    expect(() => assertNotSelfApproval(ctx, "finance")).toThrow(AppError);
  });

  it("detects platform admin", () => {
    const ctx: PermissionContext = {
      userId: "u1",
      activeAssignment: baseAssignment({ roleKey: "platform_admin" }),
      assignments: [baseAssignment({ roleKey: "platform_admin" })],
    };
    expect(hasPlatformAdmin(ctx)).toBe(true);
    expect(canPerform(ctx, "read")).toBe(true);
  });

  it("denies when no active assignment", () => {
    const ctx: PermissionContext = {
      userId: "u1",
      activeAssignment: null,
      assignments: [baseAssignment({ status: "revoked" })],
    };
    expect(canPerform(ctx, "update")).toBe(false);
  });
});
