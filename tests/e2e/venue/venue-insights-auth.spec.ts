/**
 * Venue Partner business insights — API authorization boundary.
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

loadTestEnv();
const ids = loadFixtureIds();

function assertNoInsightsLeak(json: unknown) {
  const blob = JSON.stringify(json);
  expect(blob).not.toMatch(/uniqueInPeriod|uniqueAllTime|listingPerformance/i);
  expect(json).not.toHaveProperty("insights");
  expect(json).not.toHaveProperty("customers");
}

test.describe("venue insights authorization", () => {
  test("unauthenticated request is rejected", async ({ request }) => {
    const res = await request.get(
      `/api/venue/insights?venueId=${ids.mkt_venue}`
    );
    expect(res.status()).toBeGreaterThanOrEqual(401);
    const json = await res.json().catch(() => ({}));
    assertNoInsightsLeak(json);
  });

  test.describe("authenticated venue rep", () => {
    test.skip(!fixturesAvailable(), "fixtures required");

    test("can read own Venue insights", async ({ browser }) => {
      test.skip(!existsSync(authStatePath("venue")), "no venue auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("venue"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/insights?venueId=${ids.mkt_venue}`
      );
      expect(res.status).toBe(200);
      expect(res.json.insights?.definition).toMatch(/qualifying/i);
      expect(res.json.insights?.customers).toBeTruthy();
      await ctx.close();
    });

    test("cannot read another Venue insights by changing venueId (IDOR)", async ({
      browser,
    }) => {
      test.skip(!existsSync(authStatePath("venue")), "no venue auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("venue"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/insights?venueId=${ids.mkt_venue_b}`
      );
      expect([403, 404]).toContain(res.status);
      assertNoInsightsLeak(res.json);
      await ctx.close();
    });

    test("customer role cannot read Venue insights", async ({ browser }) => {
      test.skip(!existsSync(authStatePath("customer")), "no customer auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("customer"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/insights?venueId=${ids.mkt_venue}`
      );
      expect(res.status).toBeGreaterThanOrEqual(403);
      assertNoInsightsLeak(res.json);
      await ctx.close();
    });
  });
});
