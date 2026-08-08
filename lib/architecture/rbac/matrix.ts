/**
 * Phase 4 practical permission codes for identity / org / assignment resources.
 * Source intent: docs/security/RBAC_PERMISSION_MATRIX.md Matrix A/B identity rows.
 * Exact Founder permission strings remain Technical Recommendation (TR).
 */

export const PHASE4_PERMISSIONS = [
  "profile.read.self",
  "profile.update.self",
  "profile.read.any",
  "organisation.read",
  "organisation.create",
  "organisation.update",
  "organisation_membership.read",
  "organisation_membership.manage",
  "role_assignment.read.own",
  "role_assignment.read.any",
  "role_assignment.create",
  "role_assignment.approve",
  "role_assignment.suspend",
  "role_assignment.revoke",
  "workspace_preference.read.own",
  "workspace_preference.update.own",
  "identity_suspension.manage",
  "emergency_access.manage",
  "audit.read",
] as const;

export type Phase4Permission = (typeof PHASE4_PERMISSIONS)[number];

import type { GceRoleKey } from "../types";

const ALL_ADMIN: GceRoleKey[] = [
  "platform_admin",
  "finance_admin",
  "compliance_admin",
  "support_admin",
];

/** Role keys that satisfy a Phase 4 permission (in addition to ownership rules). */
export const PERMISSION_ROLE_GRANT: Record<Phase4Permission, readonly GceRoleKey[]> = {
  "profile.read.self": [],
  "profile.update.self": [],
  "profile.read.any": ALL_ADMIN,
  "organisation.read": [
    ...ALL_ADMIN,
    "venue_representative",
    "enterprise_client_representative",
    "enterprise_bdp",
    "marketplace_bdp",
    "relationship_manager",
    "platform_relationship_manager",
    "opportunity_desk",
    "enterprise_platform_expert",
  ],
  "organisation.create": ["platform_admin", "support_admin", "enterprise_platform_expert"],
  "organisation.update": ["platform_admin", "support_admin"],
  "organisation_membership.read": [
    ...ALL_ADMIN,
    "venue_representative",
    "enterprise_client_representative",
  ],
  "organisation_membership.manage": ["platform_admin", "support_admin"],
  "role_assignment.read.own": [],
  "role_assignment.read.any": ALL_ADMIN,
  "role_assignment.create": ["platform_admin", "compliance_admin", "support_admin"],
  "role_assignment.approve": ["platform_admin", "compliance_admin"],
  "role_assignment.suspend": ["platform_admin", "compliance_admin", "support_admin"],
  "role_assignment.revoke": ["platform_admin", "compliance_admin"],
  "workspace_preference.read.own": [],
  "workspace_preference.update.own": [],
  "identity_suspension.manage": ["platform_admin", "compliance_admin"],
  "emergency_access.manage": ["platform_admin"],
  "audit.read": ["platform_admin", "compliance_admin", "finance_admin"],
};
