/**
 * Phase 14B-R — self-approval probes (API authority, not button state).
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { postJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

test.describe("self-approval", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("MBDP cannot final-approve a venue they recommended", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp state");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId: ids.mkt_venue,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    const msg = JSON.stringify(res.json).toLowerCase();
    expect(msg).toMatch(/self|recommend|forbidden|not authorized|403/);
    await ctx.close();
  });

  test("Venue cannot approve own venue", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue state");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId: ids.mkt_venue,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("Enterprise BDP cannot finance-cosign", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("enterprise-bdp")), "no ebdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-bdp"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/enterprise", {
      action: "finance_cosign",
      quoteId: ids.ent_opp,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("Enterprise Client cannot finance-cosign", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/enterprise", {
      action: "finance_cosign",
      quoteId: ids.ent_opp,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });
});
