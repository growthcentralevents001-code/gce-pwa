/**
 * Phase 14B-R — representative authenticated flows for Firefox/WebKit/viewports.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";

loadTestEnv();

const FLOWS: Array<{ role: string; path: string; expectRe: RegExp }> = [
  { role: "customer", path: "/customer/events", expectRe: /event|book|customer/i },
  { role: "connect-member", path: "/dashboard/connect-member", expectRe: /connect|member|circle/i },
  { role: "marketplace-bdp", path: "/dashboard/marketplace-bdp", expectRe: /marketplace|bdp|venue/i },
  { role: "connect-bdp", path: "/dashboard/connect-bdp", expectRe: /connect|bdp|circle|commission/i },
  { role: "venue", path: "/venue/check-in", expectRe: /check-in|ticket/i },
  { role: "enterprise-client", path: "/dashboard/enterprise-client", expectRe: /enterprise|client|project/i },
  { role: "enterprise-bdp", path: "/dashboard/enterprise-bdp", expectRe: /enterprise|bdp|client/i },
  { role: "enterprise-expert", path: "/enterprise-expert/queue", expectRe: /expert|opportunit|queue|assigned/i },
  { role: "finance", path: "/dashboard/finance", expectRe: /finance|revenue|settlement|gated/i },
  { role: "platform-ops", path: "/ops", expectRe: /ops|approv|incident|operation/i },
  { role: "multi-role", path: "/settings", expectRe: /settings|account|workspace|profile/i },
];

test.describe("authenticated representative matrix", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  for (const flow of FLOWS) {
    test.describe(`${flow.role} ${flow.path}`, () => {
      test.use({
        storageState: existsSync(authStatePath(flow.role))
          ? authStatePath(flow.role)
          : undefined,
      });

      test("loads authenticated surface", async ({ page }) => {
        test.skip(!existsSync(authStatePath(flow.role)), `no ${flow.role} state`);
        await page.goto(flow.path);
        await page.waitForLoadState("domcontentloaded");
        await expect(page).not.toHaveURL(/\/login/);
        const body = await page.locator("body").innerText();
        expect(body).not.toMatch(
          /Application error|Internal Server Error|Something went wrong/i
        );
        expect(body).toMatch(flow.expectRe);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth > document.documentElement.clientWidth + 8
        );
        expect(overflow, "horizontal overflow").toBeFalsy();
      });
    });
  }

  test("reduced motion still usable on ops + settings", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("platform-ops")), "no ops");
    const ops = await browser.newContext({
      storageState: authStatePath("platform-ops"),
      reducedMotion: "reduce",
    });
    const opsPage = await ops.newPage();
    await opsPage.goto("/ops");
    await expect(opsPage).not.toHaveURL(/\/login/);
    await expect(opsPage.locator("body")).not.toContainText(/Application error/i);
    await ops.close();
    if (existsSync(authStatePath("multi-role"))) {
      const settings = await browser.newContext({
        storageState: authStatePath("multi-role"),
        reducedMotion: "reduce",
      });
      const settingsPage = await settings.newPage();
      await settingsPage.goto("/settings");
      await expect(settingsPage).not.toHaveURL(/\/login/);
      await expect(settingsPage.locator("body")).not.toContainText(
        /Application error/i
      );
      await settings.close();
    }
  });
});
