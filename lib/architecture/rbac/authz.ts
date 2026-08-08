import type { GceRoleKey, RoleAssignment, WorkspaceKey } from "../types";
import { AppError } from "../errors";
import {
  assertNotSelfApproval,
  canPerform,
  hasPlatformAdmin,
  hasRole,
  isAssignmentActive,
  selectActiveAssignments,
  type PermissionContext,
} from "./permissions";
import type { PermissionAction } from "../types";
import { assignmentMatchesResource, type ResourceScope } from "./scope";
import {
  PERMISSION_ROLE_GRANT,
  type Phase4Permission,
} from "./matrix";
import { canAccessWorkspace } from "../workspace/registry";
import { isPrivilegedRole } from "../identity/sod";

export function buildPermissionContext(input: {
  userId: string;
  assignments: RoleAssignment[];
  activeAssignment?: RoleAssignment | null;
  workspaceKey?: string | null;
  resource?: ResourceScope;
  isSelfSubject?: boolean;
}): PermissionContext {
  const active =
    input.activeAssignment ??
    selectActiveAssignments(input.assignments)[0] ??
    null;
  return {
    userId: input.userId,
    activeAssignment: active,
    assignments: input.assignments,
    workspaceKey: input.workspaceKey,
    resourceOwnerUserId: input.resource?.ownerUserId ?? null,
    resourceOrganisationId: input.resource?.organisationId ?? null,
    resourceScopeType: input.resource?.scopeType ?? null,
    resourceScopeId: input.resource?.scopeId ?? null,
    isSelfSubject: input.isSelfSubject,
  };
}

export function hasRoleAssignment(
  assignments: RoleAssignment[],
  roleKey: GceRoleKey,
  resource?: ResourceScope
): boolean {
  return selectActiveAssignments(assignments).some((a) => {
    if (a.roleKey !== roleKey) return false;
    if (!resource) return true;
    return assignmentMatchesResource(a, resource);
  });
}

export function hasPermission(
  ctx: PermissionContext,
  permission: Phase4Permission,
  options?: { resourceOwnerUserId?: string | null }
): boolean {
  if (!ctx.userId) return false;

  const owner = options?.resourceOwnerUserId ?? ctx.resourceOwnerUserId;

  switch (permission) {
    case "profile.read.self":
    case "profile.update.self":
    case "role_assignment.read.own":
    case "workspace_preference.read.own":
    case "workspace_preference.update.own":
      return owner == null || owner === ctx.userId;
    default:
      break;
  }

  if (hasPlatformAdmin(ctx) && permission !== "emergency_access.manage") {
    // finance/compliance/support admins included in hasPlatformAdmin; emergency is platform_admin-only via grant list
    if (PERMISSION_ROLE_GRANT[permission].some((r) => hasRole(ctx, r))) {
      return true;
    }
  }

  const grantRoles = PERMISSION_ROLE_GRANT[permission];
  if (grantRoles.length === 0) {
    return owner == null || owner === ctx.userId;
  }
  return grantRoles.some((role) => hasRole(ctx, role));
}

export function requirePermission(
  ctx: PermissionContext,
  permission: Phase4Permission,
  options?: { resourceOwnerUserId?: string | null; isSelfSubject?: boolean }
): void {
  if (options?.isSelfSubject != null) {
    ctx = { ...ctx, isSelfSubject: options.isSelfSubject };
  }
  if (
    permission === "role_assignment.approve" ||
    permission.endsWith(".approve")
  ) {
    assertNotSelfApproval(ctx, "approve");
  }
  if (!hasPermission(ctx, permission, options)) {
    throw new AppError("FORBIDDEN", `Missing permission: ${permission}`, {
      status: 403,
      details: { permission },
    });
  }
}

export function requireWorkspace(
  assignments: RoleAssignment[],
  workspaceKey: WorkspaceKey
): void {
  if (workspaceKey === "personal") return;
  if (!canAccessWorkspace(assignments, workspaceKey)) {
    throw new AppError("FORBIDDEN", "Not authorized for workspace", {
      status: 403,
      details: { workspaceKey },
    });
  }
}

export function canAccessResource(
  ctx: PermissionContext,
  resource: ResourceScope,
  action: PermissionAction = "read"
): boolean {
  if (!canPerform(ctx, action, { allowOwner: true })) return false;
  const active = selectActiveAssignments(ctx.assignments);
  if (hasPlatformAdmin(ctx)) return true;
  if (resource.ownerUserId && resource.ownerUserId === ctx.userId) {
    return action === "read" || action === "update" || action === "create";
  }
  return active.some((a) => assignmentMatchesResource(a, resource));
}

export function canApprove(
  ctx: PermissionContext,
  options: { subjectUserId: string }
): boolean {
  if (ctx.userId === options.subjectUserId) return false;
  return hasPermission(ctx, "role_assignment.approve");
}

export function canManageRole(
  ctx: PermissionContext,
  roleKey: GceRoleKey
): boolean {
  if (!hasPermission(ctx, "role_assignment.create")) return false;
  if (isPrivilegedRole(roleKey)) {
    return hasRole(ctx, "platform_admin") || hasRole(ctx, "compliance_admin");
  }
  return true;
}

export {
  assertNotSelfApproval,
  canPerform,
  hasPlatformAdmin,
  hasRole,
  isAssignmentActive,
  selectActiveAssignments,
};
