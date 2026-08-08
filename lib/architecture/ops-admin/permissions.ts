import type { RoleAssignment } from "../types";
import { isAssignmentActive } from "../rbac/permissions";
import { AppError } from "../errors";
import type { OpsVertical } from "./constants";

export const OPS_ADMIN_PERMISSIONS = [
  "ops.dashboard",
  "ops.search",
  "ops.approvals.review",
  "ops.exceptions.resolve",
  "ops.cases.manage",
  "ops.cases.internal_notes",
  "ops.moderation",
  "ops.overrides.request",
  "ops.overrides.approve",
  "ops.suspend.scoped",
  "ops.incident.manage",
  "ops.refund.review",
  "ops.connect",
  "ops.marketplace",
  "ops.enterprise",
  "ops.finance",
  "ops.compliance",
  "ops.support",
  "ops.rm",
  "ops.prm",
] as const;

export type OpsAdminPermission = (typeof OPS_ADMIN_PERMISSIONS)[number];

function rolesOf(assignments: RoleAssignment[]): Set<string> {
  return new Set(
    assignments.filter((a) => isAssignmentActive(a)).map((a) => a.roleKey)
  );
}

export function actorHasOpsAdminPermission(
  assignments: RoleAssignment[],
  permission: OpsAdminPermission
): boolean {
  const roles = rolesOf(assignments);
  const platform = roles.has("platform_admin");
  const finance = roles.has("finance_admin");
  const compliance = roles.has("compliance_admin");
  const support = roles.has("support_admin");
  const rm = roles.has("relationship_manager");
  const prm = roles.has("platform_relationship_manager");
  const expert = roles.has("enterprise_platform_expert");
  const desk = roles.has("opportunity_desk");

  switch (permission) {
    case "ops.dashboard":
    case "ops.search":
      return platform || finance || compliance || support || rm || prm || expert;
    case "ops.approvals.review":
      return platform || finance || compliance || expert;
    case "ops.exceptions.resolve":
      return platform || finance || compliance || support;
    case "ops.cases.manage":
      return platform || support || rm || prm || expert || finance || compliance;
    case "ops.cases.internal_notes":
      return platform || support || rm || prm || finance || compliance || expert;
    case "ops.moderation":
      return platform || support || compliance;
    case "ops.overrides.request":
      return platform || support || compliance || finance || expert;
    case "ops.overrides.approve":
      return platform || compliance || finance;
    case "ops.suspend.scoped":
      return platform || compliance;
    case "ops.incident.manage":
      return platform || compliance || support;
    case "ops.refund.review":
      return platform || finance || support;
    case "ops.connect":
      return platform || support || rm || prm;
    case "ops.marketplace":
      return platform || support;
    case "ops.enterprise":
      return platform || expert || support;
    case "ops.finance":
      return platform || finance;
    case "ops.compliance":
      return platform || compliance;
    case "ops.support":
      return platform || support || rm;
    case "ops.rm":
      return platform || rm || prm;
    case "ops.prm":
      return platform || prm;
    default:
      return desk ? permission === "ops.dashboard" : false;
  }
}

export function canAccessVertical(
  assignments: RoleAssignment[],
  vertical: OpsVertical
): boolean {
  switch (vertical) {
    case "platform":
      return actorHasOpsAdminPermission(assignments, "ops.dashboard");
    case "connect":
      return actorHasOpsAdminPermission(assignments, "ops.connect");
    case "marketplace":
      return actorHasOpsAdminPermission(assignments, "ops.marketplace");
    case "enterprise":
      return actorHasOpsAdminPermission(assignments, "ops.enterprise");
    case "finance":
      return actorHasOpsAdminPermission(assignments, "ops.finance");
    case "compliance":
      return actorHasOpsAdminPermission(assignments, "ops.compliance");
    case "support":
      return actorHasOpsAdminPermission(assignments, "ops.support");
    default:
      return false;
  }
}

/** SoD: actor must not approve a queue item they requested. */
export function assertOpsNotSelfApproval(
  actorUserId: string,
  requesterUserId: string | null | undefined
): void {
  if (requesterUserId && requesterUserId === actorUserId) {
    throw new AppError("FORBIDDEN", "Self-approval is not permitted", {
      status: 403,
    });
  }
}
