/**
 * Phase 14B-F — development-only E2E fixture constants (gce-dev).
 * Emails intentionally avoid the substring "admin" (legacy login redirect quirk).
 */

export const FIXTURE_FAMILY = "phase14b";
export const FIXTURE_PREFIX = "E2E";

/** Known gce-dev project ref — setup/reset refuse anything else. */
export const GCE_DEV_PROJECT_REF = "hvevqoltcwumcvxetxsf";
/** Historical production ref — always refuse. */
export const GCE_PROD_PROJECT_REF = "tzeqeywezmqslovpflqu";

export const FIXTURE_EMAIL_DOMAIN = "gce-fixtures.test";

/** Associate plan id on gce-dev (canonical membership_plans). */
export const ASSOCIATE_PLAN_ID = "9aa0551c-459f-46c5-9a58-a7580bba768b";

/**
 * @typedef {{
 *   key: string,
 *   emailLocal: string,
 *   displayName: string,
 *   envEmailKey: string,
 *   roles: Array<{
 *     roleKey: string,
 *     scopeType: string,
 *     scopeIdFrom?: string | null,
 *     organisationFrom?: string | null,
 *     title?: string,
 *   }>,
 * }} FixtureIdentity
 */

/** @type {FixtureIdentity[]} */
export const FIXTURE_IDENTITIES = [
  {
    key: "e2e_customer_01",
    emailLocal: "e2e.customer.01",
    displayName: "E2E Customer One",
    envEmailKey: "E2E_CUSTOMER_EMAIL",
    roles: [{ roleKey: "platform_user", scopeType: "platform", title: "E2E Customer" }],
  },
  {
    key: "e2e_customer_02",
    emailLocal: "e2e.customer.02",
    displayName: "E2E Customer Two",
    envEmailKey: "E2E_CUSTOMER_B_EMAIL",
    roles: [{ roleKey: "platform_user", scopeType: "platform", title: "E2E Customer B (IDOR)" }],
  },
  {
    key: "e2e_connect_member_01",
    emailLocal: "e2e.connect.member.01",
    displayName: "E2E Connect Member One",
    envEmailKey: "E2E_CONNECT_MEMBER_EMAIL",
    roles: [{ roleKey: "circle_member", scopeType: "circle", scopeIdFrom: "circle", title: "E2E Circle Member" }],
  },
  {
    key: "e2e_connect_bdp_01",
    emailLocal: "e2e.connect.bdp.01",
    displayName: "E2E Connect BDP One",
    envEmailKey: "E2E_CONNECT_BDP_EMAIL",
    roles: [{ roleKey: "connect_bdp", scopeType: "unit", scopeIdFrom: "connect_bdp_unit", title: "E2E Connect BDP" }],
  },
  {
    key: "e2e_marketplace_bdp_01",
    emailLocal: "e2e.marketplace.bdp.01",
    displayName: "E2E Marketplace BDP One",
    envEmailKey: "E2E_MARKETPLACE_BDP_EMAIL",
    roles: [{ roleKey: "marketplace_bdp", scopeType: "unit", scopeIdFrom: "marketplace_bdp_unit", title: "E2E MBDP" }],
  },
  {
    key: "e2e_venue_rep_01",
    emailLocal: "e2e.venue.rep.01",
    displayName: "E2E Venue Representative One",
    envEmailKey: "E2E_VENUE_EMAIL",
    roles: [
      {
        roleKey: "venue_representative",
        scopeType: "venue",
        scopeIdFrom: "venue",
        organisationFrom: "venue_org",
        title: "E2E Venue Rep",
      },
    ],
  },
  {
    key: "e2e_enterprise_client_01",
    emailLocal: "e2e.enterprise.client.01",
    displayName: "E2E Enterprise Client Rep One",
    envEmailKey: "E2E_ENTERPRISE_CLIENT_EMAIL",
    roles: [
      {
        roleKey: "enterprise_client_representative",
        scopeType: "organisation",
        organisationFrom: "enterprise_org",
        scopeIdFrom: "enterprise_org",
        title: "E2E Enterprise Client Rep",
      },
    ],
  },
  {
    key: "e2e_enterprise_bdp_01",
    emailLocal: "e2e.enterprise.bdp.01",
    displayName: "E2E Enterprise BDP One",
    envEmailKey: "E2E_ENTERPRISE_BDP_EMAIL",
    roles: [{ roleKey: "enterprise_bdp", scopeType: "unit", scopeIdFrom: "enterprise_bdp_unit", title: "E2E EBDP" }],
  },
  {
    key: "e2e_enterprise_expert_01",
    emailLocal: "e2e.enterprise.expert.01",
    displayName: "E2E Enterprise Expert One",
    envEmailKey: "E2E_ENTERPRISE_EXPERT_EMAIL",
    roles: [
      {
        roleKey: "enterprise_platform_expert",
        scopeType: "project",
        scopeIdFrom: "enterprise_project",
        title: "E2E Platform Expert",
      },
    ],
  },
  {
    key: "e2e_finance_01",
    emailLocal: "e2e.finance.officer.01",
    displayName: "E2E Finance Officer One",
    envEmailKey: "E2E_FINANCE_EMAIL",
    roles: [{ roleKey: "finance_admin", scopeType: "platform", title: "E2E Finance" }],
  },
  {
    key: "e2e_platform_ops_01",
    emailLocal: "e2e.platform.ops.01",
    displayName: "E2E Platform Ops One",
    envEmailKey: "E2E_PLATFORM_OPS_EMAIL",
    roles: [{ roleKey: "platform_admin", scopeType: "platform", title: "E2E Platform Ops" }],
  },
  {
    key: "e2e_compliance_01",
    emailLocal: "e2e.compliance.officer.01",
    displayName: "E2E Compliance Officer One",
    envEmailKey: "E2E_COMPLIANCE_EMAIL",
    roles: [{ roleKey: "compliance_admin", scopeType: "platform", title: "E2E Compliance" }],
  },
  {
    key: "e2e_support_01",
    emailLocal: "e2e.support.officer.01",
    displayName: "E2E Support Officer One",
    envEmailKey: "E2E_SUPPORT_EMAIL",
    roles: [{ roleKey: "support_admin", scopeType: "platform", title: "E2E Support" }],
  },
  {
    key: "e2e_opportunity_desk_01",
    emailLocal: "e2e.opportunity.desk.01",
    displayName: "E2E Opportunity Desk One",
    envEmailKey: "E2E_OPPORTUNITY_DESK_EMAIL",
    roles: [{ roleKey: "opportunity_desk", scopeType: "platform", title: "E2E Opportunity Desk" }],
  },
  {
    key: "e2e_prm_01",
    emailLocal: "e2e.prm.01",
    displayName: "E2E PRM One",
    envEmailKey: "E2E_PRM_EMAIL",
    roles: [
      {
        roleKey: "platform_relationship_manager",
        scopeType: "city",
        scopeIdFrom: "prm_city_scope",
        title: "E2E PRM (city-scoped)",
      },
    ],
  },
  {
    key: "e2e_multi_role_01",
    emailLocal: "e2e.multi.role.01",
    displayName: "E2E Multi Role One",
    envEmailKey: "E2E_MULTI_ROLE_EMAIL",
    roles: [
      { roleKey: "platform_user", scopeType: "platform", title: "E2E Multi — customer" },
      { roleKey: "circle_member", scopeType: "circle", scopeIdFrom: "circle", title: "E2E Multi — member" },
      { roleKey: "connect_bdp", scopeType: "unit", scopeIdFrom: "connect_bdp_unit", title: "E2E Multi — CBDP" },
    ],
  },
];

export function fixtureEmail(identity) {
  return `${identity.emailLocal}@${FIXTURE_EMAIL_DOMAIN}`;
}

export const ROLE_HOME = {
  platform_user: "/customer/profile",
  circle_member: "/dashboard/connect-member",
  connect_bdp: "/dashboard/connect-bdp",
  marketplace_bdp: "/dashboard/marketplace-bdp",
  venue_representative: "/venue",
  enterprise_client_representative: "/dashboard/enterprise-client",
  enterprise_bdp: "/dashboard/enterprise-bdp",
  enterprise_platform_expert: "/enterprise-expert/queue",
  finance_admin: "/dashboard/finance",
  platform_admin: "/ops",
  compliance_admin: "/dashboard/compliance",
  support_admin: "/dashboard/support",
  opportunity_desk: "/dashboard/opportunity-desk",
  platform_relationship_manager: "/ops",
};

export const FORBIDDEN_ROUTES_BY_KEY = {
  e2e_customer_01: ["/dashboard/finance", "/ops"],
  e2e_connect_member_01: ["/dashboard/compliance", "/dashboard/finance"],
  e2e_connect_bdp_01: ["/dashboard/finance", "/dashboard/compliance"],
  e2e_marketplace_bdp_01: ["/dashboard/finance", "/ops/security"],
  e2e_venue_rep_01: ["/ops", "/dashboard/finance"],
  e2e_enterprise_client_01: ["/enterprise-expert/queue", "/dashboard/finance"],
  e2e_enterprise_bdp_01: ["/dashboard/compliance", "/dashboard/finance"],
  e2e_enterprise_expert_01: ["/finance/payout-readiness", "/dashboard/finance"],
  e2e_finance_01: ["/ops/security"],
  e2e_support_01: ["/dashboard/finance", "/dashboard/compliance"],
  e2e_opportunity_desk_01: ["/dashboard/compliance", "/dashboard/finance"],
  e2e_prm_01: ["/dashboard/finance", "/dashboard/compliance"],
};
