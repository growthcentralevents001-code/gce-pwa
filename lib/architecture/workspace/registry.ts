import type { GceRoleKey, RoleAssignment, WorkspaceKey } from "../types";
import { isAssignmentActive } from "../rbac/permissions";

/** Maps workspace keys to the role family that unlocks them (ADR-003 / FD-035). */
export const WORKSPACE_ROLE_MAP: Record<WorkspaceKey, GceRoleKey | null> = {
  personal: "platform_user",
  "connect-member": "circle_member",
  "connect-bdp": "connect_bdp",
  "marketplace-bdp": "marketplace_bdp",
  venue: "venue_representative",
  "enterprise-bdp": "enterprise_bdp",
  "enterprise-client": "enterprise_client_representative",
  "platform-ops": "platform_admin",
  finance: "finance_admin",
  compliance: "compliance_admin",
  support: "support_admin",
};

/**
 * Legacy dashboard paths — quarantine. Do NOT grant commercial entitlement.
 * ADR-011 / FD-039: ZBP, Affiliate inactive; franchisee not automatic RBAC.
 */
export const LEGACY_DASHBOARD_REDIRECTS: Record<
  string,
  { target: WorkspaceKey | "/unauthorized"; reason: string; entitled: false }
> = {
  "/dashboard/zbp": {
    target: "/unauthorized",
    reason: "ZBP commercial model is inactive (FD-039). Historical data retained.",
    entitled: false,
  },
  "/dashboard/affiliate": {
    target: "/unauthorized",
    reason: "Marketplace Affiliate is inactive (FD-039). Historical data retained.",
    entitled: false,
  },
  "/dashboard/franchisee": {
    target: "/unauthorized",
    reason:
      "Franchise Unit is a commercial construct, not an automatic RBAC workspace (FD-039).",
    entitled: false,
  },
  "/dashboard/bdm": {
    target: "/unauthorized",
    reason:
      "Legacy BDM mapping is unresolved — do not auto-map to Marketplace BDP (FD-032/035).",
    entitled: false,
  },
  "/dashboard/member": {
    target: "connect-member",
    reason: "Compatibility redirect to canonical workspace key.",
    entitled: false,
  },
  "/dashboard/venue": {
    target: "venue",
    reason: "Compatibility redirect to canonical workspace key.",
    entitled: false,
  },
  "/dashboard/enterprise": {
    target: "/unauthorized",
    reason:
      "Legacy enterprise dashboard is ambiguous (BDP vs Client). Use assignment-scoped workspaces.",
    entitled: false,
  },
};

export function workspacesForAssignments(
  assignments: RoleAssignment[]
): WorkspaceKey[] {
  const active = assignments.filter((a) => isAssignmentActive(a));
  const keys = new Set<WorkspaceKey>(["personal"]);
  for (const [workspaceKey, roleKey] of Object.entries(WORKSPACE_ROLE_MAP) as [
    WorkspaceKey,
    GceRoleKey | null,
  ][]) {
    if (!roleKey) continue;
    if (active.some((a) => a.roleKey === roleKey)) keys.add(workspaceKey);
  }
  // Platform admins may also access finance/compliance/support if assigned those roles only;
  // platform_admin unlocks platform-ops.
  if (active.some((a) => a.roleKey === "platform_admin")) {
    keys.add("platform-ops");
  }
  return Array.from(keys);
}

export function canAccessWorkspace(
  assignments: RoleAssignment[],
  workspaceKey: WorkspaceKey
): boolean {
  return workspacesForAssignments(assignments).includes(workspaceKey);
}

export function resolveLegacyDashboardPath(pathname: string) {
  const normalized = pathname.replace(/\/$/, "") || pathname;
  return LEGACY_DASHBOARD_REDIRECTS[normalized] ?? null;
}
