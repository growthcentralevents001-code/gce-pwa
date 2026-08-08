/**
 * Permission helpers — re-export Phase 2 RBAC for Phase 3 import paths.
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

export { resolveActiveEntitlements, userHasActiveRole } from "@/lib/architecture/identity/resolveEntitlements";
