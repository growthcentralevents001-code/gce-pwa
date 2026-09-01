/**
 * Marketplace core verification — public page, engagement tracking, venue apply governance.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";

loadTestEnv();
const ids = loadFixtureIds();

test.describe("public marketplace page", () => {
  test("explains marketplace and routes business CTA to governed apply", async ({
    page,
  }) => {
    await page.goto("/marketplace");
    await expect(page.locator("body")).toContainText(/GCE Marketplace/i);
    await expect(page.locator("body")).toContainText(/Explore GCE Marketplace/i);
    await expect(page.locator("body")).toContainText(/Join GCE Marketplace/i);
    await expect(page.getByRole("link", { name: /Join GCE Marketplace/i }).first()).toHaveAttribute(
      "href",
      "/venue/apply"
    );
    await expect(page.locator("body")).toContainText(/claim/i);
    await expect(page.locator("body")).not.toContainText(/Application error/i);
  });
});

test.describe("engagement tracking", () => {
  test("records event view via public API", async ({ request }) => {
    test.skip(!fixturesAvailable(), "fixtures required");
    const res = await request.post("/api/marketplace/engagement", {
      data: {
        engagementType: "marketplace_event_view",
        subjectId: ids.mkt_event_attr,
        source: "public",
      },
    });
    expect(res.status()).toBeLessThan(300);
    const body = await res.json();
    expect(body.ok).toBe(true);
    expect(body.id).toBeTruthy();
  });

  test("rejects engagement for invalid subject", async ({ request }) => {
    const res = await request.post("/api/marketplace/engagement", {
      data: {
        engagementType: "marketplace_event_view",
        subjectId: "00000000-0000-4000-8000-000000000099",
        source: "public",
      },
    });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});

test.describe("venue apply governance", () => {
  test("venue apply does not expose legacy auto-approve copy", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue auth");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    await page.goto("/venue/apply");
    await expect(page.locator("body")).toContainText(/Approval-based onboarding/i);
    await expect(page.locator("body")).not.toContainText(/auto-assign venue role/i);
    await ctx.close();
  });
});

test.describe("venue performance metrics", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("venue rep sees backend engagement metrics", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    await page.goto("/venue/performance");
    await expect(page.locator("body")).toContainText(/Performance/i);
    await expect(page.locator("body")).toContainText(/profile views|Event views|Offer views/i);
    await expect(page.locator("body")).not.toContainText(/Application error/i);
    await ctx.close();
  });
});

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`marketplace responsive @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("/marketplace renders without horizontal overflow", async ({ page }) => {
      await page.goto("/marketplace");
      await page.waitForLoadState("domcontentloaded");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });
  });
}
