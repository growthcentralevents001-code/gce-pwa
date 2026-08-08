import type { AssignmentScopeType, RoleAssignment } from "../types";

export type ResourceScope = {
  scopeType?: AssignmentScopeType | null;
  scopeId?: string | null;
  organisationId?: string | null;
  ownerUserId?: string | null;
};

/**
 * Match a role assignment against a resource scope (ADR-002 / FD-035).
 * Platform-scoped active assignments match any resource unless org isolation is required.
 */
export function assignmentMatchesResource(
  assignment: RoleAssignment,
  resource: ResourceScope,
  options?: { requireOrgMatch?: boolean }
): boolean {
  if (options?.requireOrgMatch) {
    if (!resource.organisationId || assignment.organisationId !== resource.organisationId) {
      return false;
    }
  }

  if (assignment.scopeType === "platform") {
    return true;
  }

  if (resource.organisationId && assignment.organisationId) {
    if (assignment.organisationId === resource.organisationId) {
      // Org-aligned assignment is sufficient when resource only carries org.
      if (!resource.scopeType && !resource.scopeId) return true;
    } else {
      return false;
    }
  }

  if (resource.scopeType && assignment.scopeType !== resource.scopeType) {
    return false;
  }

  if (
    resource.scopeId &&
    assignment.scopeId &&
    assignment.scopeId !== resource.scopeId
  ) {
    return false;
  }

  return true;
}

export function findMatchingAssignments(
  assignments: RoleAssignment[],
  resource: ResourceScope,
  options?: { requireOrgMatch?: boolean }
): RoleAssignment[] {
  return assignments.filter((a) => assignmentMatchesResource(a, resource, options));
}
