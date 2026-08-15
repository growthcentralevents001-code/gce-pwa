/**
 * Phase 14B-R — authenticated accessibility baseline (no WCAG certification).
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";

loadTestEnv();

const PAGES: Array<{ role: string; path: string }> = [
  { role: "customer", path: "/customer/tickets" },
  { role: "connect-member", path: "/dashboard/connect-member" },
  { role: "connect-bdp", path: "/dashboard/connect-bdp" },
  { role: "venue", path: "/venue/check-in" },
  { role: "enterprise-client", path: "/dashboard/enterprise-client" },
  { role: "finance", path: "/dashboard/finance" },
  { role: "platform-ops", path: "/ops/approvals" },
  { role: "multi-role", path: "/settings/notifications" },
];

test.describe("authenticated a11y baseline", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  for (const p of PAGES) {
    test.describe(`${p.role} ${p.path}`, () => {
      test.use({
        storageState: existsSync(authStatePath(p.role))
          ? authStatePath(p.role)
          : undefined,
      });

      test("has main landmark and no unlabeled submit-only crash", async ({
        page,
      }) => {
        test.skip(!existsSync(authStatePath(p.role)), `no ${p.role}`);
        await page.goto(p.path);
        await page.waitForLoadState("domcontentloaded");
        await expect(page).not.toHaveURL(/\/login/);
        const main = page.locator("main, [role='main']");
        await expect(main.first()).toBeVisible();
        const body = await page.locator("body").innerText();
        expect(body).not.toMatch(/Application error|Something went wrong/i);
      });
    });
  }

  test("venue check-in fields are labelled", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    await page.goto("/venue/check-in");
    await expect(page.getByLabel(/ticket id/i)).toBeVisible();
    await expect(page.getByLabel(/presented token/i)).toBeVisible();
    await ctx.close();
  });
});
