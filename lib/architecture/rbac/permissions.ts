import { AppError } from "../errors";
import type {
  AssignmentScopeType,
  GceRoleKey,
  PermissionAction,
  RoleAssignment,
} from "../types";

export type PermissionContext = {
  userId: string;
  activeAssignment: RoleAssignment | null;
  assignments: RoleAssignment[];
  workspaceKey?: string | null;
  resourceOwnerUserId?: string | null;
  resourceOrganisationId?: string | null;
  resourceScopeType?: AssignmentScopeType | null;
  resourceScopeId?: string | null;
  /** True when the subject of a finance/commission decision is the same user */
  isSelfSubject?: boolean;
};

const PLATFORM_ADMIN_ROLES: GceRoleKey[] = [
  "platform_admin",
  "finance_admin",
  "compliance_admin",
];

export function isAssignmentActive(a: RoleAssignment, now = new Date()): boolean {
  if (a.status !== "active") return false;
  if (a.effectiveTo && new Date(a.effectiveTo) <= now) return false;
  return true;
}

export function selectActiveAssignments(
  assignments: RoleAssignment[],
  now = new Date()
): RoleAssignment[] {
  return assignments.filter((a) => isAssignmentActive(a, now));
}

export function hasRole(
  ctx: PermissionContext,
  roleKey: GceRoleKey
): boolean {
  return selectActiveAssignments(ctx.assignments).some((a) => a.roleKey === roleKey);
}

export function hasPlatformAdmin(ctx: PermissionContext): boolean {
  return selectActiveAssignments(ctx.assignments).some((a) =>
    PLATFORM_ADMIN_ROLES.includes(a.roleKey)
  );
}

/**
 * Separation of duties: users must not approve their own commission/settlement outcomes.
 * FD-023 / FD-029 / FD-035.
 */
export function assertNotSelfApproval(ctx: PermissionContext, action: PermissionAction): void {
  if ((action === "approve" || action === "finance") && ctx.isSelfSubject) {
    throw new AppError("FORBIDDEN", "Self-approval is not permitted for this action", {
      status: 403,
      details: { action, rule: "sod_self_approval_ban" },
    });
  }
}

export function canPerform(
  ctx: PermissionContext,
  action: PermissionAction,
  options?: { requirePlatformAdmin?: boolean; allowOwner?: boolean }
): boolean {
  if (!ctx.userId) return false;
  if (options?.requirePlatformAdmin) return hasPlatformAdmin(ctx);

  if (hasPlatformAdmin(ctx)) return true;

  if (!ctx.activeAssignment || !isAssignmentActive(ctx.activeAssignment)) {
    return false;
  }

  if (options?.allowOwner && ctx.resourceOwnerUserId === ctx.userId) {
    return action === "read" || action === "update" || action === "create";
  }

  // Workspace route is not authorization — active assignment must still match resource scope when provided.
  if (ctx.resourceScopeType && ctx.activeAssignment.scopeType !== "platform") {
    if (ctx.activeAssignment.scopeType !== ctx.resourceScopeType) return false;
    if (
      ctx.resourceScopeId &&
      ctx.activeAssignment.scopeId &&
      ctx.activeAssignment.scopeId !== ctx.resourceScopeId
    ) {
      return false;
    }
  }

  if (action === "finance" || action === "audit" || action === "pii") {
    return (
      ctx.activeAssignment.roleKey === "finance_admin" ||
      ctx.activeAssignment.roleKey === "compliance_admin" ||
      ctx.activeAssignment.roleKey === "platform_admin"
    );
  }

  return true;
}

export function assertCanPerform(
  ctx: PermissionContext,
  action: PermissionAction,
  options?: { requirePlatformAdmin?: boolean; allowOwner?: boolean }
): void {
  assertNotSelfApproval(ctx, action);
  if (!canPerform(ctx, action, options)) {
    throw new AppError("FORBIDDEN", "Insufficient permissions for this action", {
      status: 403,
      details: { action, workspaceKey: ctx.workspaceKey },
    });
  }
}
