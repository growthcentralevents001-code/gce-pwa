/**
 * Phase 14B — authenticated role matrix (resumed after BG-32 fixtures).
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  expectAccessDenied,
  fixturesAvailable,
  loadTestEnv,
} from "./auth/helpers";

loadTestEnv();

const MATRIX: Array<{
  role: string;
  home: string;
  forbidden: string[];
}> = [
  {
    role: "customer",
    home: "/customer/profile",
    forbidden: ["/dashboard/finance", "/ops"],
  },
  {
    role: "connect-member",
    home: "/dashboard/connect-member",
    forbidden: ["/dashboard/compliance", "/dashboard/finance"],
  },
  {
    role: "connect-bdp",
    home: "/dashboard/connect-bdp",
    // connect_bdp has finance.report.read by design — deny compliance/ops moderation
    forbidden: ["/dashboard/compliance", "/ops/moderation"],
  },
  {
    role: "marketplace-bdp",
    home: "/dashboard/marketplace-bdp",
    forbidden: ["/dashboard/compliance", "/ops/moderation"],
  },
  {
    role: "venue",
    home: "/venue",
    // venue_representative has finance.report.read — deny platform ops/compliance
    forbidden: ["/ops", "/dashboard/compliance"],
  },
  {
    role: "enterprise-client",
    home: "/dashboard/enterprise-client",
    forbidden: ["/dashboard/finance"],
  },
  {
    role: "enterprise-bdp",
    home: "/dashboard/enterprise-bdp",
    // enterprise_bdp has finance.report.read — deny compliance
    forbidden: ["/dashboard/compliance"],
  },
  {
    role: "enterprise-expert",
    home: "/enterprise-expert/queue",
    forbidden: ["/finance/payout-readiness"],
  },
  {
    role: "finance",
    home: "/dashboard/finance",
    forbidden: ["/dashboard/compliance"],
  },
  {
    role: "platform-ops",
    home: "/ops",
    forbidden: [],
  },
  {
    role: "compliance",
    home: "/dashboard/compliance",
    forbidden: [],
  },
  {
    role: "support",
    home: "/dashboard/support",
    forbidden: ["/dashboard/finance"],
  },
  {
    role: "opportunity-desk",
    home: "/dashboard/opportunity-desk",
    forbidden: ["/dashboard/compliance"],
  },
  {
    role: "prm",
    home: "/ops",
    forbidden: ["/dashboard/finance", "/dashboard/compliance"],
  },
  {
    role: "multi-role",
    home: "/settings",
    // includes connect_bdp → finance.report.read; deny compliance
    forbidden: ["/dashboard/compliance"],
  },
];

for (const entry of MATRIX) {
  test.describe(`auth matrix — ${entry.role}`, () => {
    test.skip(!fixturesAvailable(), "BG-32 fixtures required");
    test.use({
      storageState: existsSync(authStatePath(entry.role))
        ? authStatePath(entry.role)
        : undefined,
    });

    test(`opens home ${entry.home}`, async ({ page }) => {
      test.skip(
        !existsSync(authStatePath(entry.role)),
        `missing storage state for ${entry.role}`
      );
      await page.goto(entry.home);
      await page.waitForLoadState("domcontentloaded");
      await expect(page).not.toHaveURL(/\/login/);
      const body = await page.locator("body").innerText();
      expect(body.length).toBeGreaterThan(20);
      // Must not be a hard crash
      expect(body).not.toMatch(/Application error|Internal Server Error/i);
    });

    for (const path of entry.forbidden) {
      test(`denies ${path}`, async ({ page }) => {
        test.skip(
          !existsSync(authStatePath(entry.role)),
          `missing storage state for ${entry.role}`
        );
        await expectAccessDenied(page, path);
      });
    }
  });
}

test.describe("settings multi-role", () => {
  test.skip(!fixturesAvailable(), "BG-32 fixtures required");
  test.use({
    storageState: existsSync(authStatePath("multi-role"))
      ? authStatePath("multi-role")
      : undefined,
  });

  test("settings account surface loads", async ({ page }) => {
    test.skip(!existsSync(authStatePath("multi-role")), "no multi-role state");
    await page.goto("/settings");
    await expect(page).not.toHaveURL(/\/login/);
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/settings|account|profile|workspace|notification|privacy|security/i);
  });
});
