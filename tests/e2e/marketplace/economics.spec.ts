/**
 * Phase 14B-R — Marketplace economics copy + MBDP unit model.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";

loadTestEnv();

test.describe("marketplace economics", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("MBDP entitlements page states 80/10/10 and 80/0/20 with no pending 10%", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    await page.goto("/marketplace-bdp/entitlements", {
      waitUntil: "domcontentloaded",
    });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/Venue 80%/i);
    expect(body).toMatch(/Marketplace BDP 10%/i);
    expect(body).toMatch(/GCE 10%/i);
    expect(body).toMatch(/Marketplace BDP 0%/i);
    expect(body).toMatch(/GCE 20%/i);
    expect(body).toMatch(/not pending/i);
    expect(body).not.toMatch(/pending MBDP 10%/i);
    expect(body).toMatch(/₹1,000\.00|₹1,000/);
    await ctx.close();
  });

  test("EBDP entitlements are 25% of platform commission, not project value", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-bdp")), "no ebdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-bdp"),
    });
    const page = await ctx.newPage();
    await page.goto("/enterprise-bdp/entitlements", {
      waitUntil: "domcontentloaded",
    });
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/not 25% of total project value/i);
    expect(body).toMatch(/₹5,000\.00|₹5,000/);
    expect(body).not.toMatch(/₹25,000/);
    await ctx.close();
  });

  test("MBDP unit model copy uses 20 venues / max 2 units", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    await page.goto("/dashboard/marketplace-bdp");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Application error/i);
    await page.goto("/marketplace-bdp/units");
    const units = await page.locator("body").innerText();
    expect(units).toMatch(/no city or territory ownership|no city ownership/i);
    expect(units).toMatch(/20 active venues|max 2 units/i);
    await ctx.close();
  });

  test("Finance revenue page distinguishes payment vs revenue", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance");
    const ctx = await browser.newContext({
      storageState: authStatePath("finance"),
    });
    const page = await ctx.newPage();
    await page.goto("/finance/revenue");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/payment received is not revenue recognised/i);
    expect(body).not.toMatch(/Execute Settlement|Execute Payout|Process Refund/i);
    await ctx.close();
  });
});
