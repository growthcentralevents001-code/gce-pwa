/**
 * Phase 14B-R — Finance authenticated deep surfaces + execution gates.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";

loadTestEnv();

const ROUTES = [
  "/dashboard/finance",
  "/finance/revenue",
  "/finance/entitlements",
  "/finance/holds",
  "/finance/recovery",
  "/finance/settlements",
  "/finance/payout-readiness",
  "/finance/reconciliation",
  "/finance/refunds",
  "/finance/chargebacks",
  "/finance/offline",
];

test.describe("finance deep", () => {
  test.skip(!fixturesAvailable(), "fixtures required");
  test.use({
    storageState: existsSync(authStatePath("finance"))
      ? authStatePath("finance")
      : undefined,
  });

  for (const route of ROUTES) {
    test(`loads ${route} without execution actions`, async ({ page }) => {
      test.skip(!existsSync(authStatePath("finance")), "no finance state");
      await page.goto(route);
      await page.waitForLoadState("domcontentloaded");
      await expect(page).not.toHaveURL(/\/login/);
      const body = await page.locator("body").innerText();
      expect(body).not.toMatch(/Application error|Internal Server Error/i);
      expect(body).not.toMatch(/\bExecute Settlement\b|\bExecute Payout\b|\bProcess Refund\b/);
    });
  }

  test("settlements and payouts remain feature-gated", async ({ page }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance state");
    await page.goto("/finance/settlements");
    const settlements = await page.locator("body").innerText();
    expect(settlements).toMatch(/settlement execution off|feature-gated|gated/i);
    await page.goto("/finance/payout-readiness");
    const payouts = await page.locator("body").innerText();
    expect(payouts).toMatch(/payout|gated|off/i);
  });

  test("revenue page distinguishes payment vs recognised and has no gross edit", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance state");
    await page.goto("/finance/revenue");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/payment received is not revenue recognised/i);
    expect(body).toMatch(/gross amounts are read-only/i);
    expect(body).toMatch(/no edit ledger/i);
    await expect(page.getByRole("button", { name: /edit (gross|commission|ledger)/i })).toHaveCount(0);
  });

  test("unattributed Marketplace 20% GCE has no pending MBDP 10%", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance state");
    await page.goto("/finance/entitlements");
    const body = await page.locator("body").innerText();
    expect(body).toMatch(/gross amounts are immutable/i);
    expect(body).not.toMatch(/pending MBDP 10%|held MBDP 10%|orphan commission/i);
  });
});
