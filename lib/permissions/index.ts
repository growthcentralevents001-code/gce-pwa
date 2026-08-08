/**
 * Permission helpers — Phase 3/4 import surface.
 * Canonical entitlement: role_assignments via resolveActiveEntitlements.
 */
export {
  assertCanPerform,
  assertNotSelfApproval,
  canPerform,
  hasPlatformAdmin,
  hasRole,
  isAssignmentActive,
  selectActiveAssignments,
  type PermissionContext,
} from "@/lib/architecture/rbac/permissions";

export {
  buildPermissionContext,
  hasRoleAssignment,
  hasPermission,
  requirePermission,
  requireWorkspace,
  canAccessResource,
  canApprove,
  canManageRole,
} from "@/lib/architecture/rbac/authz";

export {
  PHASE4_PERMISSIONS,
  PERMISSION_ROLE_GRANT,
  type Phase4Permission,
} from "@/lib/architecture/rbac/matrix";

export { resolveActiveEntitlements, userHasActiveRole } from "@/lib/architecture/identity/resolveEntitlements";
