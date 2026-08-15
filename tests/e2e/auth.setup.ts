/**
 * Playwright setup project — generates storage states under .playwright/.auth/
 * (gitignored). Requires: npm run e2e:fixtures:setup
 */
import { test as setup, expect } from "@playwright/test";
import {
  authStatePath,
  ensureAuthDir,
  fixturesAvailable,
  loadTestEnv,
  loginViaUi,
} from "./auth/helpers";

loadTestEnv();

const ROLES: Array<{
  name: string;
  emailEnv: string;
  passwordEnv: string;
  home: string;
}> = [
  {
    name: "customer",
    emailEnv: "E2E_CUSTOMER_EMAIL",
    passwordEnv: "E2E_CUSTOMER_PASSWORD",
    home: "/customer/profile",
  },
  {
    name: "connect-member",
    emailEnv: "E2E_CONNECT_MEMBER_EMAIL",
    passwordEnv: "E2E_CONNECT_MEMBER_PASSWORD",
    home: "/dashboard/connect-member",
  },
  {
    name: "connect-bdp",
    emailEnv: "E2E_CONNECT_BDP_EMAIL",
    passwordEnv: "E2E_CONNECT_BDP_PASSWORD",
    home: "/dashboard/connect-bdp",
  },
  {
    name: "marketplace-bdp",
    emailEnv: "E2E_MARKETPLACE_BDP_EMAIL",
    passwordEnv: "E2E_MARKETPLACE_BDP_PASSWORD",
    home: "/dashboard/marketplace-bdp",
  },
  {
    name: "venue",
    emailEnv: "E2E_VENUE_EMAIL",
    passwordEnv: "E2E_VENUE_PASSWORD",
    home: "/venue",
  },
  {
    name: "enterprise-client",
    emailEnv: "E2E_ENTERPRISE_CLIENT_EMAIL",
    passwordEnv: "E2E_ENTERPRISE_CLIENT_PASSWORD",
    home: "/dashboard/enterprise-client",
  },
  {
    name: "enterprise-bdp",
    emailEnv: "E2E_ENTERPRISE_BDP_EMAIL",
    passwordEnv: "E2E_ENTERPRISE_BDP_PASSWORD",
    home: "/dashboard/enterprise-bdp",
  },
  {
    name: "enterprise-expert",
    emailEnv: "E2E_ENTERPRISE_EXPERT_EMAIL",
    passwordEnv: "E2E_ENTERPRISE_EXPERT_PASSWORD",
    home: "/enterprise-expert/queue",
  },
  {
    name: "finance",
    emailEnv: "E2E_FINANCE_EMAIL",
    passwordEnv: "E2E_FINANCE_PASSWORD",
    home: "/dashboard/finance",
  },
  {
    name: "platform-ops",
    emailEnv: "E2E_PLATFORM_OPS_EMAIL",
    passwordEnv: "E2E_PLATFORM_OPS_PASSWORD",
    home: "/ops",
  },
  {
    name: "compliance",
    emailEnv: "E2E_COMPLIANCE_EMAIL",
    passwordEnv: "E2E_COMPLIANCE_PASSWORD",
    home: "/dashboard/compliance",
  },
  {
    name: "support",
    emailEnv: "E2E_SUPPORT_EMAIL",
    passwordEnv: "E2E_SUPPORT_PASSWORD",
    home: "/dashboard/support",
  },
  {
    name: "opportunity-desk",
    emailEnv: "E2E_OPPORTUNITY_DESK_EMAIL",
    passwordEnv: "E2E_OPPORTUNITY_DESK_PASSWORD",
    home: "/dashboard/opportunity-desk",
  },
  {
    name: "prm",
    emailEnv: "E2E_PRM_EMAIL",
    passwordEnv: "E2E_PRM_PASSWORD",
    home: "/ops",
  },
  {
    name: "multi-role",
    emailEnv: "E2E_MULTI_ROLE_EMAIL",
    passwordEnv: "E2E_MULTI_ROLE_PASSWORD",
    home: "/settings",
  },
];

setup.describe.configure({ mode: "serial" });

setup("authenticate fixture roles", async ({ page }) => {
  setup.skip(!fixturesAvailable(), "BG-32 fixtures not set up");
  setup.setTimeout(15 * 60_000);
  ensureAuthDir();
  loadTestEnv();

  for (const role of ROLES) {
    const email = process.env[role.emailEnv];
    const password =
      process.env[role.passwordEnv] || process.env.E2E_FIXTURE_PASSWORD;
    if (!email || !password) {
      throw new Error(`Missing env for ${role.name}`);
    }
    await loginViaUi(page, email, password, role.home);
    await expect(page).not.toHaveURL(/\/login/);
    await page.context().storageState({ path: authStatePath(role.name) });
    await page.context().clearCookies();
    await page.goto("/login");
  }
});
