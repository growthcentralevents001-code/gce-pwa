/**
 * Marketplace revenue allocation — API authorization boundary.
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

function assertNoAllocationLeak(json: unknown) {
  const blob = JSON.stringify(json);
  expect(json).not.toHaveProperty("allocations");
  expect(blob).not.toMatch(/venue_share_minor|mbdp_share_minor|eligible_revenue_minor/i);
}

test.describe("venue allocations authorization", () => {
  test("unauthenticated request is rejected", async ({ request }) => {
    const res = await request.get(
      `/api/venue/allocations?venueId=${ids.mkt_venue}`
    );
    expect(res.status()).toBeGreaterThanOrEqual(401);
    assertNoAllocationLeak(await res.json().catch(() => ({})));
  });

  test.describe("authenticated venue rep", () => {
    test.skip(!fixturesAvailable(), "fixtures required");

    test("can read own Venue allocations", async ({ browser }) => {
      test.skip(!existsSync(authStatePath("venue")), "no venue auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("venue"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/allocations?venueId=${ids.mkt_venue}`
      );
      expect(res.status).toBe(200);
      expect(Array.isArray(res.json.allocations)).toBe(true);
      await ctx.close();
    });

    test("cannot read another Venue allocations by changing venueId (IDOR)", async ({
      browser,
    }) => {
      test.skip(!existsSync(authStatePath("venue")), "no venue auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("venue"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/allocations?venueId=${ids.mkt_venue_b}`
      );
      expect([403, 404]).toContain(res.status);
      assertNoAllocationLeak(res.json);
      await ctx.close();
    });

    test("customer cannot read Venue allocations", async ({ browser }) => {
      test.skip(!existsSync(authStatePath("customer")), "no customer auth");
      const ctx = await browser.newContext({
        storageState: authStatePath("customer"),
      });
      const page = await ctx.newPage();
      const res = await getJson(
        page.request,
        `/api/venue/allocations?venueId=${ids.mkt_venue}`
      );
      expect(res.status).toBeGreaterThanOrEqual(403);
      assertNoAllocationLeak(res.json);
      await ctx.close();
    });
  });
});
