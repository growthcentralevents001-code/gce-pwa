/**
 * Prompt 3 — Connect BDP workspace copy + commission rules.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";

loadTestEnv();

test.describe("connect BDP workspace", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("dashboard and entitlements use 20% and 5 Circles — not stale 10%", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-bdp")), "no connect-bdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-bdp"),
    });
    const page = await ctx.newPage();
    await page.goto("/dashboard/connect-bdp");
    await page.waitForLoadState("domcontentloaded");
    const dash = await page.locator("body").innerText();
    expect(dash).not.toMatch(/Application error/i);
    expect(dash).not.toMatch(/10% commission|10 Circles/i);
    await page.goto("/connect-bdp/entitlements");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/20%/);
    expect(body).toMatch(/recovery/i);
    expect(body).not.toMatch(/10% of attributed/i);
    await page.goto("/connect-bdp/targets");
    const targets = await page.locator("body").innerText();
    expect(targets).toMatch(/5 Circles/);
    await ctx.close();
  });
});
