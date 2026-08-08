import type { RoleAssignment } from "../types";

export const FINANCE_PERMISSIONS = [
  "finance.revenue.read",
  "finance.revenue.write",
  "finance.entitlement.review",
  "finance.entitlement.approve",
  "finance.hold.manage",
  "finance.settlement.manage",
  "finance.reconciliation.manage",
  "finance.offline.manage",
  "finance.correction.create",
  "finance.report.read",
] as const;

export type FinancePermission = (typeof FINANCE_PERMISSIONS)[number];

const ROLE_PERMS: Record<string, readonly FinancePermission[]> = {
  finance_admin: FINANCE_PERMISSIONS,
  compliance_admin: ["finance.hold.manage", "finance.report.read"],
  platform_admin: FINANCE_PERMISSIONS,
  connect_bdp: ["finance.report.read"],
  marketplace_bdp: ["finance.report.read"],
  enterprise_bdp: ["finance.report.read"],
  venue_representative: ["finance.report.read"],
};

export function actorHasFinancePermission(
  assignments: RoleAssignment[],
  permission: FinancePermission
): boolean {
  return assignments.some((a) => {
    if (a.status !== "active") return false;
    return (ROLE_PERMS[a.roleKey] ?? []).includes(permission);
  });
}
