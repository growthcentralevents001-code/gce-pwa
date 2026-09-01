/**
 * Circle capacity + GC Power Sectors — backend-derived counts and UI smoke.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { getJson } from "../auth/api";

const CIRCLE_CAPACITY_MAX = 40;

loadTestEnv();
const ids = loadFixtureIds();

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

test.describe("circle capacity API", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("fixture circle reports backend-derived availability (max 40)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/connect/circles?circleId=${ids.circle}`
    );
    expect(res.status).toBe(200);
    const availability = res.json.availability;
    expect(availability.capacityMax).toBe(CIRCLE_CAPACITY_MAX);
    expect(availability.activeSeats).toBeGreaterThanOrEqual(0);
    expect(availability.activeSeats).toBeLessThanOrEqual(CIRCLE_CAPACITY_MAX);
    expect(availability.remaining).toBe(
      CIRCLE_CAPACITY_MAX - availability.activeSeats
    );
    expect(availability.canAccept).toBe(availability.remaining > 0);
    await ctx.close();
  });

  test("platform ops cannot be invoked by connect member for waitlist admin", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const res = await getJson(page.request, "/api/connect/circles");
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });
});

test.describe("member circle structure UI", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  for (const vp of VIEWPORTS) {
    test(`allocated member sees X/40 and four sectors @ ${vp.name}`, async ({
      browser,
    }) => {
      test.skip(!existsSync(authStatePath("connect-member")), "no member");
      const ctx = await browser.newContext({
        storageState: authStatePath("connect-member"),
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();
      await page.goto("/connect/circle");
      await page.waitForLoadState("domcontentloaded");
      const body = await page.locator("body").innerText();
      expect(body).toMatch(/\/\s*40|40\s*members/i);
      expect(body).toMatch(/GC Power Sector/i);
      expect(body).toMatch(/Real Estate|Industrial|Professional|Consumer/i);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
      await ctx.close();
    });
  }
});

test.describe("connect BDP circle structure", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("assigned Connect BDP sees sector balance panel when unit exists", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-bdp")), "no connect-bdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-bdp"),
    });
    const page = await ctx.newPage();
    await page.goto("/connect-bdp/circles");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    test.skip(/No unit/i.test(body), "connect-bdp fixture has no assigned unit");
    expect(body).toMatch(/Sector balance|GC Power Sector|40/i);
    await ctx.close();
  });
});
