import type { AssignmentStatus, GceRoleKey, PrivilegedRoleKey } from "../types";
import { PRIVILEGED_ROLE_KEYS } from "../types";
import { AppError } from "../errors";
import { StateMachine } from "../state-machine/machine";

export const roleAssignmentMachine = new StateMachine<AssignmentStatus>({
  name: "role_assignment",
  initial: "pending",
  terminal: ["revoked", "terminated"],
  transitions: [
    { from: "pending", to: "active", name: "activate" },
    { from: "pending", to: "revoked", name: "revoke" },
    { from: "pending", to: "terminated", name: "terminate" },
    { from: "active", to: "suspended", name: "suspend" },
    { from: "active", to: "expired", name: "expire" },
    { from: "active", to: "revoked", name: "revoke" },
    { from: "active", to: "terminated", name: "terminate" },
    { from: "suspended", to: "active", name: "reinstate" },
    { from: "suspended", to: "revoked", name: "revoke" },
    { from: "suspended", to: "terminated", name: "terminate" },
    { from: "expired", to: "pending", name: "renew_request" },
    { from: "expired", to: "active", name: "renew_activate" },
    { from: "expired", to: "terminated", name: "terminate" },
  ],
});

export function isPrivilegedRole(roleKey: GceRoleKey): roleKey is PrivilegedRoleKey {
  return (PRIVILEGED_ROLE_KEYS as readonly string[]).includes(roleKey);
}

/**
 * Separation of duties for role assignment workflows (FD-023 / FD-035).
 * Application-layer guard; DB trigger is an additional backstop when JWT is present.
 */
export function assertAssignmentSoD(options: {
  actorUserId: string;
  targetUserId: string;
  roleKey: GceRoleKey;
  action: "create" | "approve" | "activate" | "grant_privileged";
  approvedBy?: string | null;
}): void {
  const { actorUserId, targetUserId, roleKey, action, approvedBy } = options;

  if (action === "create" || action === "grant_privileged") {
    if (actorUserId === targetUserId && isPrivilegedRole(roleKey)) {
      throw new AppError(
        "FORBIDDEN",
        "Users may not self-grant privileged role assignments",
        { status: 403, details: { rule: "sod_self_grant_ban", roleKey } }
      );
    }
  }

  if (action === "approve" || action === "activate") {
    if (actorUserId === targetUserId) {
      throw new AppError(
        "FORBIDDEN",
        "Users may not self-approve or self-activate role assignments",
        { status: 403, details: { rule: "sod_self_approval_ban", roleKey } }
      );
    }
    if (approvedBy && approvedBy === targetUserId) {
      throw new AppError(
        "FORBIDDEN",
        "approved_by cannot be the assignment subject",
        { status: 403, details: { rule: "sod_self_approval_ban", roleKey } }
      );
    }
  }
}

/** High-risk admin grants require an authorised platform admin approver (actor ≠ subject). */
export function requiresElevatedApprover(roleKey: GceRoleKey): boolean {
  return isPrivilegedRole(roleKey);
}
