/**
 * Prompt 3 — MBDP recommend → Marketplace Ops domain approve.
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

test.describe("marketplace ops domain approve", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("platform ops can approve fixture venue; MBDP cannot", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    test.skip(!existsSync(authStatePath("platform-ops")), "no ops");

    const mbdp = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const mbdpPage = await mbdp.newPage();
    const denied = await postJson(mbdpPage.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId: ids.mkt_venue,
    });
    expect(denied.status).toBeGreaterThanOrEqual(400);
    await mbdp.close();

    const ops = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const opsPage = await ops.newPage();
    const approved = await postJson(opsPage.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId: ids.mkt_venue,
      reason: "E2E Marketplace Ops final approval",
    });
    expect(approved.status).toBeLessThan(300);
    expect(String(approved.json.venue?.status ?? "")).toMatch(/active/i);
    await ops.close();
  });
});
