/**
 * Circle meetings — member empty state + API RBAC smoke.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { postJson, getJson } from "../auth/api";

loadTestEnv();

test.describe("circle meetings member UI @ mobile", () => {
  test.skip(!existsSync(authStatePath("connect-member")), "no member state");
  test.use({
    storageState: authStatePath("connect-member"),
    viewport: { width: 390, height: 844 },
  });

  test("circle page shows honest meeting section without fabricated date", async ({
    page,
  }) => {
    await page.goto("/connect/circle");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    if (body.includes("No membership") || body.includes("not allocated")) {
      test.info().annotations.push({
        type: "skipped",
        description: "member has no circle seat in fixture",
      });
      return;
    }
    expect(body).toMatch(/Circle meetings/i);
    expect(body).toMatch(/Referrals stay in the app/i);
    expect(body).not.toMatch(/Next scheduled meeting:/i);
  });
});

test.describe("circle meetings API RBAC", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("member cannot schedule meetings", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/connect/circle-meetings", {
      action: "schedule",
      circleId: "00000000-0000-4000-8000-000000000001",
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      title: "Blocked",
    });
    expect(res.status).toBe(403);
    await ctx.close();
  });

  test("unrelated customer cannot read arbitrary circle meetings", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      "/api/connect/circle-meetings?circleId=00000000-0000-4000-8000-000000000001"
    );
    expect([403, 404]).toContain(res.status);
    await ctx.close();
  });
});
