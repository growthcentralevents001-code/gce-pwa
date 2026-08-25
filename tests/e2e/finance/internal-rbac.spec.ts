/**
 * Prompt 4 — internal Finance/Ops/Desk/Settings API authority.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { getJson, postJson } from "../auth/api";

loadTestEnv();

test.describe("internal finance + ops RBAC", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("customer cannot GET finance report or execute settlement", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const report = await getJson(page.request, "/api/finance");
    expect(report.status).toBe(403);
    const exec = await postJson(page.request, "/api/finance", {
      action: "attempt_settlement_execution",
      batchId: "00000000-0000-4000-8000-000000000001",
    });
    expect(exec.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("support cannot execute settlement/payout or self-grant platform admin", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("support")), "no support");
    const ctx = await browser.newContext({
      storageState: authStatePath("support"),
    });
    const page = await ctx.newPage();
    const exec = await postJson(page.request, "/api/finance", {
      action: "attempt_settlement_execution",
      batchId: "00000000-0000-4000-8000-000000000001",
    });
    expect(exec.status).toBeGreaterThanOrEqual(400);
    const grant = await postJson(page.request, "/api/admin/role-assignments", {
      userId: "00000000-0000-4000-8000-000000000001",
      roleKey: "platform_admin",
      scopeType: "platform",
    });
    expect(grant.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("Connect BDP cannot activate own unit via API", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("connect-bdp")), "no connect-bdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-bdp"),
    });
    const page = await ctx.newPage();
    const mine = await getJson(page.request, "/api/connect/bdp");
    const unitId = mine.json.units?.[0]?.id ?? mine.json.unit?.id;
    const res = await postJson(page.request, "/api/connect/bdp", {
      action: "activate",
      unitId: unitId ?? "00000000-0000-4000-8000-000000000001",
      reason: "self-activation probe must be denied",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("ordinary member cannot review Opportunity Desk", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/lead-assist", {
      action: "review_desk",
      queueId: "00000000-0000-4000-8000-000000000001",
      notes: "unauthorized desk probe for e2e",
      resolve: true,
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("finance report payload omits payout destination and bank secrets", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance");
    const ctx = await browser.newContext({
      storageState: authStatePath("finance"),
    });
    const page = await ctx.newPage();
    const report = await getJson(page.request, "/api/finance");
    expect(report.status).toBeLessThan(500);
    const blob = JSON.stringify(report.json);
    expect(blob).not.toMatch(/aadhaar|payout_destination_ref|ifsc|pan_number/i);
    await ctx.close();
  });

  test("platform ops can open approvals filter; customer cannot review", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("platform-ops")), "no platform-ops");
    const ops = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const opsPage = await ops.newPage();
    await opsPage.goto("/ops/approvals?vertical=marketplace");
    await expect(opsPage).not.toHaveURL(/\/login/);
    const body = await opsPage.locator("body").innerText();
    expect(body).not.toMatch(/Application error|Internal Server Error/i);
    expect(body).toMatch(/Marketplace|All|Approvals/i);
    await ops.close();

    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const cust = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await cust.newPage();
    const review = await postJson(page.request, "/api/ops/admin", {
      action: "review_approval",
      approvalId: "00000000-0000-4000-8000-000000000001",
      decision: "approve",
      decisionReason: "customer must not review ops queues",
    });
    expect(review.status).toBeGreaterThanOrEqual(400);
    await cust.close();
  });
});
