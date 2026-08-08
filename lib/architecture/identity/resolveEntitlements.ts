import type { SupabaseClient } from "@supabase/supabase-js";
import type { RoleAssignment } from "../types";
import { listRoleAssignmentsForUser } from "./assignments";
import { selectActiveAssignments } from "../rbac/permissions";
import { logStructured } from "../logging";
import { mapLegacyRole } from "../legacy/roleMap";

/**
 * Canonical entitlement resolution (FD-035 / ADR-002).
 *
 * Primary authority: `role_assignments` with active status + effective dates.
 * Legacy `user_roles` / enum values are compatibility signals only — they must
 * NOT create commercial entitlement (FD-039). Ambiguous BDM stays unresolved.
 *
 * Do not add new code paths that treat `user_roles` as entitlement.
 */
export type EntitlementResolution = {
  userId: string;
  assignments: RoleAssignment[];
  activeAssignments: RoleAssignment[];
  /** True when fallback consulted legacy rows; never means entitlement granted. */
  legacyCompatibilityConsulted: boolean;
  legacyRoleKeys: string[];
  source: "role_assignments" | "none";
};

const KNOWN_LEGACY_KEYS = new Set([
  "admin",
  "member",
  "venue",
  "enterprise",
  "zbp",
  "affiliate",
  "bdm",
  "franchisee",
]);

/**
 * Resolve active assignments for a user.
 * Never promotes legacy `user_roles` into entitlement.
 */
export async function resolveActiveEntitlements(
  client: SupabaseClient,
  userId: string,
  options?: { consultLegacyForDiagnostics?: boolean }
): Promise<EntitlementResolution> {
  let assignments: RoleAssignment[] = [];
  try {
    assignments = await listRoleAssignmentsForUser(client, userId);
  } catch (error) {
    logStructured({
      level: "warn",
      message: "role_assignments_unavailable",
      code: "ROLE_ASSIGNMENTS_LOOKUP",
      meta: {
        userId,
        error: error instanceof Error ? error.message : "unknown",
      },
    });
    assignments = [];
  }

  const activeAssignments = selectActiveAssignments(assignments);
  let legacyCompatibilityConsulted = false;
  const legacyRoleKeys: string[] = [];

  if (options?.consultLegacyForDiagnostics) {
    legacyCompatibilityConsulted = true;
    const { data, error } = await client
      .from("user_roles")
      // @deprecated Legacy compatibility diagnostics only — not entitlement authority.
      .select("role")
      .eq("user_id", userId);

    if (!error && data) {
      for (const row of data) {
        const role = String((row as { role?: string }).role ?? "");
        if (!role) continue;
        legacyRoleKeys.push(role);
        if (KNOWN_LEGACY_KEYS.has(role)) {
          const mapped = mapLegacyRole(role);
          if (mapped.grantsEntitlement) {
            // Defensive: mapLegacyRole must never grant entitlement.
            logStructured({
              level: "error",
              message: "legacy_map_unexpected_entitlement",
              code: "LEGACY_MAP_VIOLATION",
              meta: { role },
            });
          }
        }
      }
    }
  }

  return {
    userId,
    assignments,
    activeAssignments,
    legacyCompatibilityConsulted,
    legacyRoleKeys,
    source: activeAssignments.length > 0 ? "role_assignments" : "none",
  };
}

export async function userHasActiveRole(
  client: SupabaseClient,
  userId: string,
  roleKey: RoleAssignment["roleKey"]
): Promise<boolean> {
  const resolved = await resolveActiveEntitlements(client, userId);
  return resolved.activeAssignments.some((a) => a.roleKey === roleKey);
}
