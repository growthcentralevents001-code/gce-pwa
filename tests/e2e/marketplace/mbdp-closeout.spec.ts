/**
 * Marketplace BDP authenticated closeout — application, economics, isolation.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { getJson, postJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

test.describe("MBDP application", () => {
  test.skip(!fixturesAvailable(), "fixtures required");
  test.describe.configure({ mode: "serial" });

  test("eligible user can submit Franchise Unit application", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();

    const before = await getJson(page.request, "/api/marketplace/bdp");
    expect(before.status).toBe(200);
    const unitsBefore = (before.json.units ?? []) as Array<{
      id: string;
      applicationStatus?: string;
      application_status?: string;
    }>;

    if (unitsBefore.length === 0) {
      await page.goto("/marketplace-bdp/apply");
      await expect(page.locator("body")).toContainText(/Package option/i);
      await page.getByRole("button", { name: /Submit application/i }).click();
      await page.waitForURL(/\/marketplace-bdp\/units/, { timeout: 30_000 });
    }

    const after = await getJson(page.request, "/api/marketplace/bdp");
    const units = (after.json.units ?? []) as Array<{
      applicationStatus?: string;
      application_status?: string;
    }>;
    expect(units.length).toBeGreaterThan(0);
    const status =
      units[0]!.applicationStatus ?? units[0]!.application_status ?? "";
    expect(status).toMatch(/draft|submitted|pending|active/i);
    await ctx.close();
  });

  test("application state persists after refresh", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await getJson(page.request, "/api/marketplace/bdp");
    const units = res.json.units ?? [];
    test.skip(units.length === 0, "no MBDP unit for customer B");

    await page.goto("/marketplace-bdp/units");
    await page.reload();
    await expect(page.locator("body")).not.toContainText(/Application error/i);
    await ctx.close();
  });
});

test.describe("MBDP protections", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("MBDP cannot self-activate unit", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    const unitId = ids.mbdp_unit ?? ids.marketplace_bdp_unit;
    const res = await postJson(page.request, "/api/marketplace/bdp", {
      action: "activate",
      unitId,
      reason: "E2E self-activate probe",
    });
    expect(res.status).toBeGreaterThanOrEqual(403);
    await ctx.close();
  });

  test("MBDP B cannot read MBDP A unit report (IDOR)", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const unitId = ids.mbdp_unit ?? ids.marketplace_bdp_unit;
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/marketplace/bdp?unitId=${unitId}`
    );
    expect(res.status).toBeGreaterThanOrEqual(403);
    await ctx.close();
  });
});

test.describe("MBDP economics & dashboard", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("fixture MBDP report shows backend-derived entitlement", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const unitId = ids.mbdp_unit ?? ids.marketplace_bdp_unit;
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/marketplace/bdp?unitId=${unitId}`
    );
    expect(res.status).toBe(200);
    const report = res.json.mbdpReport;
    expect(report).toBeTruthy();
    expect(Number(report.grossMbdpEntitlementMinor)).toBeGreaterThan(0);

    await page.goto("/dashboard/marketplace-bdp");
    await expect(page.locator("body")).toContainText(/Backend-calculated/i);
    await page.goto("/marketplace-bdp/venues");
    await expect(page.locator("body")).not.toContainText(/Application error/i);
    await ctx.close();
  });

  test("venue report visible for attributed fixture venue", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/marketplace/bdp?venueId=${ids.mkt_venue}`
    );
    expect(res.status).toBe(200);
    expect(res.json.venueReport?.venueId).toBe(ids.mkt_venue);
    await ctx.close();
  });
});

const RESPONSIVE_VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of RESPONSIVE_VIEWPORTS) {
  test.describe(`MBDP dashboard @ ${vp.name}`, () => {
    test.skip(!fixturesAvailable(), "fixtures required");
    test.use({
      viewport: { width: vp.width, height: vp.height },
      storageState: existsSync(authStatePath("marketplace-bdp"))
        ? authStatePath("marketplace-bdp")
        : undefined,
    });

    test("dashboard renders without horizontal overflow", async ({ page }) => {
      test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
      await page.goto("/dashboard/marketplace-bdp");
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
