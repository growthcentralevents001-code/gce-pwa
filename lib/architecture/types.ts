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
  "enterprise_platform_expert",
  "venue_representative",
  "governing_body_member",
  "circle_finance_coordinator",
  "sergeant_at_arms",
  "relationship_manager",
  "platform_relationship_manager",
  "opportunity_desk",
  "platform_admin",
  "finance_admin",
  "compliance_admin",
  "support_admin",
] as const;

export type GceRoleKey = (typeof GCE_ROLE_KEYS)[number];

/** Privileged roles that may not be self-granted / self-approved (FD-023/035). */
export const PRIVILEGED_ROLE_KEYS = [
  "platform_admin",
  "finance_admin",
  "compliance_admin",
  "support_admin",
  "enterprise_platform_expert",
] as const satisfies readonly GceRoleKey[];

export type PrivilegedRoleKey = (typeof PRIVILEGED_ROLE_KEYS)[number];

export const ASSIGNMENT_STATUSES = [
  "pending",
  "active",
  "suspended",
  "expired",
  "revoked",
  "terminated",
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
  "opportunity-desk",
  "finance",
  "compliance",
  "support",
] as const;

export type WorkspaceKey = (typeof WORKSPACE_KEYS)[number];

/** Money / commercial gates — defaults OFF and must stay OFF until Founder activation. */
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
  "enterprise_bdp_pack_payments",
  "revenue_recognition_live",
  "commission_posting_live",
  "settlement_batch_generation",
  "payout_execution",
  "lead_escrow",
  "lead_success_fee",
  "pay_to_receive_leads",
  "paid_contact_reveal",
  "rupee_500_lead_fee",
] as const;

/** Stage-1 Lead Assist operational flags (unpaid) — DB is SoT; defaults ON for local fail-open of unpaid flow. */
export const LEAD_ASSIST_STAGE1_FLAGS = [
  "lead_assist_stage1",
  "ai_lead_classification",
  "ai_candidate_ranking",
  "opportunity_desk",
  "contact_reveal",
] as const;

/** Phase 11 customer CX operational flags (money capture still OFF via inactive flags). */
export const CUSTOMER_CX_FLAGS = [
  "customer_booking",
  "offer_claims",
  "customer_rank_display",
  "venue_rank_display",
  "refund_processing",
] as const;

export const FEATURE_FLAG_KEYS = [
  ...INACTIVE_FEATURE_FLAGS,
  ...LEAD_ASSIST_STAGE1_FLAGS,
  ...CUSTOMER_CX_FLAGS,
] as const;

export type FeatureFlagKey = (typeof FEATURE_FLAG_KEYS)[number];

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
