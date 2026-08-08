/**
 * Phase 2 architecture types (Technical — ADR-002/003/007/013).
 * Stored under lib/architecture to avoid colliding with dirty types/index.ts WIP.
 */

export const GCE_ROLE_KEYS = [
  "platform_user",
  "circle_member",
  "connect_bdp",
  "marketplace_bdp",
  "enterprise_bdp",
  "enterprise_client_representative",
  "venue_representative",
  "governing_body_member",
  "circle_finance_coordinator",
  "sergeant_at_arms",
  "relationship_manager",
  "platform_relationship_manager",
  "platform_admin",
  "finance_admin",
  "compliance_admin",
  "support_admin",
] as const;

export type GceRoleKey = (typeof GCE_ROLE_KEYS)[number];

export const ASSIGNMENT_STATUSES = [
  "pending",
  "active",
  "suspended",
  "expired",
  "revoked",
] as const;

export type AssignmentStatus = (typeof ASSIGNMENT_STATUSES)[number];

export const ASSIGNMENT_SCOPE_TYPES = [
  "platform",
  "legal_entity",
  "vertical",
  "city",
  "circle",
  "unit",
  "venue",
  "organisation",
  "client",
  "project",
  "department",
  "case",
  "lead",
  "temporary_ops",
] as const;

export type AssignmentScopeType = (typeof ASSIGNMENT_SCOPE_TYPES)[number];

export const WORKSPACE_KEYS = [
  "personal",
  "connect-member",
  "connect-bdp",
  "marketplace-bdp",
  "venue",
  "enterprise-bdp",
  "enterprise-client",
  "platform-ops",
  "finance",
  "compliance",
  "support",
] as const;

export type WorkspaceKey = (typeof WORKSPACE_KEYS)[number];

export const INACTIVE_FEATURE_FLAGS = [
  "marketplace_affiliate",
  "zbp_commercial",
  "core_direct_purchase",
  "paid_lead_assist",
  "wallet_cashout",
  "vendor_self_service",
  "native_apps",
  "international",
  "multi_currency",
  "partner_lead_api",
  "premium_listings",
  "referral_rewards",
  "marketplace_ticket_payments",
  "settlement_execution",
  "bdp_pack_payments",
  "offline_bdp_pack_payments",
] as const;

export type FeatureFlagKey = (typeof INACTIVE_FEATURE_FLAGS)[number];

export type RoleAssignment = {
  id: string;
  userId: string;
  roleKey: GceRoleKey;
  status: AssignmentStatus;
  scopeType: AssignmentScopeType;
  scopeId: string | null;
  organisationId: string | null;
  effectiveFrom: string;
  effectiveTo: string | null;
};

export type PermissionAction =
  | "read"
  | "create"
  | "update"
  | "approve"
  | "delete"
  | "finance"
  | "pii"
  | "audit";
