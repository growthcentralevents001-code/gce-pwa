import type { GceRoleKey } from "../types";

export type LegacyRole =
  | "admin"
  | "member"
  | "venue"
  | "franchisee"
  | "enterprise"
  | "zbp"
  | "affiliate"
  | "bdm"
  | string;

export type LegacyMappingResult = {
  legacyRole: string;
  canonicalRoleKey: GceRoleKey | null;
  mappingStatus: "mapped" | "quarantined" | "unresolved" | "obsolete";
  /** Always false unless an explicit assignment grant is performed separately. */
  grantsEntitlement: false;
  notes: string;
};

const STATIC_MAP: Record<string, Omit<LegacyMappingResult, "legacyRole" | "grantsEntitlement">> = {
  admin: {
    canonicalRoleKey: "platform_admin",
    mappingStatus: "mapped",
    notes: "Requires explicit assignment grant; enum alone is insufficient",
  },
  member: {
    canonicalRoleKey: "circle_member",
    mappingStatus: "mapped",
    notes: "Requires verified membership assignment",
  },
  venue: {
    canonicalRoleKey: "venue_representative",
    mappingStatus: "mapped",
    notes: "Requires organisation/venue-scoped assignment",
  },
  enterprise: {
    canonicalRoleKey: null,
    mappingStatus: "unresolved",
    notes: "Ambiguous Enterprise BDP vs Client — do not auto-map",
  },
  zbp: {
    canonicalRoleKey: null,
    mappingStatus: "obsolete",
    notes: "ZBP commercial inactive (FD-039)",
  },
  affiliate: {
    canonicalRoleKey: null,
    mappingStatus: "quarantined",
    notes: "Marketplace Affiliate inactive (FD-039)",
  },
  bdm: {
    canonicalRoleKey: null,
    mappingStatus: "unresolved",
    notes: "Do not auto-map BDM to Marketplace BDP",
  },
  franchisee: {
    canonicalRoleKey: null,
    mappingStatus: "quarantined",
    notes: "Franchise Unit is commercial construct, not RBAC role (FD-039)",
  },
};

/**
 * Interpret a legacy user_role enum value without granting entitlement.
 */
export function mapLegacyRole(legacyRole: LegacyRole): LegacyMappingResult {
  const key = String(legacyRole).toLowerCase();
  const found = STATIC_MAP[key];
  if (!found) {
    return {
      legacyRole: key,
      canonicalRoleKey: null,
      mappingStatus: "unresolved",
      grantsEntitlement: false,
      notes: "Unknown legacy role — quarantine pending explicit mapping",
    };
  }
  return { legacyRole: key, grantsEntitlement: false, ...found };
}

export function legacyRolesGrantEntitlement(): false {
  return false;
}
