/**
 * Circle meetings — persisted schedule validation (gce-dev / Phase 14B fixtures).
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

/** E2E Bengaluru Test Circle on gce-dev (fixture seat for e2e.connect.member.01). */
const E2E_CIRCLE_ID = "913f0c95-deeb-4c2a-8b07-791a068f2cd5";
const INVALID_CIRCLE_ID = "00000000-0000-4000-8000-000000000099";

const MEETING_TITLE = `E2E Circle Meeting Validation ${Date.now()}`;

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

test.describe("circle meetings lifecycle", () => {
  test.describe.configure({ mode: "serial" });
  test.skip(!fixturesAvailable(), "fixtures required");
  test.skip(!existsSync(authStatePath("platform-ops")), "no platform-ops state");
  test.skip(!existsSync(authStatePath("connect-member")), "no connect-member state");

  let meetingId: string | undefined;

  test("Ops schedules meeting and DB persists", async ({ browser }) => {
    const ctx = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const page = await ctx.newPage();

    const existing = await getJson(
      page.request,
      `/api/connect/circle-meetings?circleId=${E2E_CIRCLE_ID}`
    );
    if (existing.status === 200) {
      const prior = (existing.json.meetings ?? []) as Array<{
        id: string;
        status: string;
        title?: string | null;
      }>;
      for (const m of prior) {
        if (
          m.status === "scheduled" &&
          String(m.title ?? "").includes("E2E Circle Meeting Validation")
        ) {
          await postJson(page.request, "/api/connect/circle-meetings", {
            action: "update_status",
            meetingId: m.id,
            status: "cancelled",
          });
        }
      }
    }

    const scheduledAt = new Date(Date.now() + 7 * 86400000).toISOString();
    const created = await postJson(page.request, "/api/connect/circle-meetings", {
      action: "schedule",
      circleId: E2E_CIRCLE_ID,
      scheduledAt,
      title: MEETING_TITLE,
      location: "Bengaluru — fixture venue",
    });
    expect(created.status).toBe(201);
    meetingId = created.json.meeting?.id as string | undefined;
    expect(meetingId).toBeTruthy();
    expect(created.json.meeting?.circleId).toBe(E2E_CIRCLE_ID);
    await ctx.close();
  });

  test("authorized member sees backend-derived upcoming meeting", async ({
    browser,
  }) => {
    test.skip(!meetingId, "schedule step did not produce meeting id");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const listed = await getJson(
      page.request,
      `/api/connect/circle-meetings?circleId=${E2E_CIRCLE_ID}`
    );
    expect(listed.status).toBe(200);
    expect(listed.json.upcoming?.id).toBe(meetingId);
    expect(listed.json.upcoming?.title).toBe(MEETING_TITLE);
    await ctx.close();
  });

  test("meeting survives refresh / new session", async ({ browser }) => {
    test.skip(!meetingId, "schedule step did not produce meeting id");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const listed = await getJson(
      page.request,
      `/api/connect/circle-meetings?circleId=${E2E_CIRCLE_ID}`
    );
    expect(listed.status).toBe(200);
    expect(listed.json.upcoming?.id).toBe(meetingId);
    await ctx.close();
  });

  for (const vp of VIEWPORTS) {
    test(`member UI shows upcoming meeting @ ${vp.name}`, async ({ browser }) => {
      test.skip(!meetingId, "schedule step did not produce meeting id");
      const ctx = await browser.newContext({
        storageState: authStatePath("connect-member"),
        viewport: { width: vp.width, height: vp.height },
      });
      const page = await ctx.newPage();
      await page.goto("/connect/circle");
      await page.waitForLoadState("domcontentloaded");
      const body = await page.locator("body").innerText();
      expect(body).toMatch(/Upcoming meeting/i);
      expect(body).toMatch(new RegExp(MEETING_TITLE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
      expect(body).toMatch(/Referrals stay in the app/i);
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
      await ctx.close();
    });
  }

  test("Ops marks meeting completed — member sees history", async ({
    browser,
  }) => {
    test.skip(!meetingId, "schedule step did not produce meeting id");
    const opsCtx = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const opsPage = await opsCtx.newPage();
    const updated = await postJson(
      opsPage.request,
      "/api/connect/circle-meetings",
      { action: "update_status", meetingId, status: "completed" }
    );
    expect(updated.status).toBe(200);
    expect(updated.json.meeting?.status).toBe("completed");
    await opsCtx.close();

    const memberCtx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const memberPage = await memberCtx.newPage();
    const listed = await getJson(
      memberPage.request,
      `/api/connect/circle-meetings?circleId=${E2E_CIRCLE_ID}`
    );
    expect(listed.status).toBe(200);
    expect(listed.json.upcoming).toBeNull();
    const prev = (listed.json.previous ?? []) as Array<{ id: string }>;
    expect(prev.some((m) => m.id === meetingId)).toBe(true);

    await memberPage.goto("/connect/circle");
    await memberPage.waitForLoadState("domcontentloaded");
    const body = await memberPage.locator("body").innerText();
    expect(body).toMatch(/Previous meetings/i);
    expect(body).toMatch(/completed/i);
    await memberCtx.close();
  });
});

test.describe("circle meetings API RBAC", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("member cannot schedule or update meetings", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const schedule = await postJson(page.request, "/api/connect/circle-meetings", {
      action: "schedule",
      circleId: E2E_CIRCLE_ID,
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      title: "Blocked",
    });
    expect(schedule.status).toBe(403);
    const update = await postJson(page.request, "/api/connect/circle-meetings", {
      action: "update_status",
      meetingId: "00000000-0000-4000-8000-000000000001",
      status: "cancelled",
    });
    expect(update.status).toBe(403);
    await ctx.close();
  });

  test("unrelated customer cannot read Circle meetings", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/connect/circle-meetings?circleId=${E2E_CIRCLE_ID}`
    );
    expect(res.status).toBe(403);
    await ctx.close();
  });

  test("Connect BDP cannot read unrelated Circle meetings", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-bdp")), "no connect-bdp state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-bdp"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/connect/circle-meetings?circleId=${INVALID_CIRCLE_ID}`
    );
    expect([403, 404]).toContain(res.status);
    await ctx.close();
  });

  test("invalid Circle schedule denied for Ops", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("platform-ops")), "no platform-ops");
    const ctx = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/connect/circle-meetings", {
      action: "schedule",
      circleId: INVALID_CIRCLE_ID,
      scheduledAt: new Date(Date.now() + 86400000).toISOString(),
      title: "Invalid circle",
    });
    expect(res.status).toBe(404);
    await ctx.close();
  });
});
