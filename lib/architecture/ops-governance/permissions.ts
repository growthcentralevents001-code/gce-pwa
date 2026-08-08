import type { RoleAssignment } from "../types";
import { isAssignmentActive } from "../rbac/permissions";

export const OPS_GOVERNANCE_PERMISSIONS = [
  "notif.read_own",
  "notif.prefs_own",
  "notif.manage_templates",
  "notif.dead_letter",
  "analytics.read",
  "audit.search",
  "security.read",
  "risk.review",
  "alerts.manage",
  "compliance.hold",
  "privacy.review",
  "retention.review",
  "sensitive_access.log",
] as const;

export type OpsGovernancePermission = (typeof OPS_GOVERNANCE_PERMISSIONS)[number];

function activeRoles(assignments: RoleAssignment[]): Set<string> {
  return new Set(
    assignments.filter((a) => isAssignmentActive(a)).map((a) => a.roleKey)
  );
}

export function actorHasOpsPermission(
  assignments: RoleAssignment[],
  permission: OpsGovernancePermission
): boolean {
  const roles = activeRoles(assignments);
  const isUser =
    roles.size === 0 ||
    roles.has("platform_user") ||
    roles.has("circle_member") ||
    roles.has("governing_body_member") ||
    roles.has("venue_representative") ||
    roles.has("connect_bdp") ||
    roles.has("marketplace_bdp") ||
    roles.has("enterprise_bdp") ||
    roles.has("enterprise_client_rep");
  const isSupport = roles.has("support_admin");
  const isFinance = roles.has("finance_admin");
  const isCompliance = roles.has("compliance_admin");
  const isPlatform = roles.has("platform_admin");
  const isOps = isSupport || isFinance || isCompliance || isPlatform;

  switch (permission) {
    case "notif.read_own":
    case "notif.prefs_own":
      return isUser || isOps;
    case "notif.manage_templates":
    case "notif.dead_letter":
      return isSupport || isPlatform;
    case "analytics.read":
      return isPlatform || isFinance;
    case "audit.search":
      return isPlatform || isCompliance || isFinance;
    case "security.read":
    case "risk.review":
    case "alerts.manage":
      return isPlatform || isCompliance || isSupport;
    case "compliance.hold":
    case "privacy.review":
    case "retention.review":
      return isCompliance || isPlatform;
    case "sensitive_access.log":
      return isOps || isUser;
    default:
      return false;
  }
}
