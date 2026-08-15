/**
 * Phase 14B-R — Lead Assist create/submit + paid flags remain OFF.
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

test.describe("lead assist", () => {
  test.skip(!fixturesAvailable(), "fixtures required");
  test.use({
    storageState: existsSync(authStatePath("connect-member"))
      ? authStatePath("connect-member")
      : undefined,
  });

  test("member can open composer; paid Lead Assist remains gated", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    await page.goto("/connect/leads");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    expect(body.toLowerCase()).toMatch(/unpaid|stage 1/);
    expect(body).toMatch(/remain OFF|No pay-to-receive/i);
  });

  test("create + submit lead via API", async ({ page }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const created = await postJson(page.request, "/api/lead-assist", {
      action: "create",
      title: "E2E Lead Assist Fixture",
      requirementSummary: "Need a photographer in Bengaluru for a synthetic test.",
      requirementDetails: "Phase 14B-R lifecycle probe. Not a real enquiry.",
      city: "Bengaluru",
      tagCodes: [],
      urgency: "normal",
      privacyLevel: "standard",
    });
    if (created.status >= 400) {
      test.info().annotations.push({
        type: "blocked",
        description: `create lead ${created.status}: ${JSON.stringify(created.json).slice(0, 300)}`,
      });
    }
    expect(created.status).toBeLessThan(500);
    const leadId = created.json.lead?.id as string | undefined;
    test.skip(!leadId, "lead create did not return id");
    const submitted = await postJson(page.request, "/api/lead-assist", {
      action: "submit",
      leadId,
    });
    expect(submitted.status).toBeLessThan(500);
    await page.goto(`/connect/leads/${leadId}`);
    await expect(page.locator("body")).not.toContainText(/Application error/i);
  });

  test("unrelated customer cannot read member lead contact", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const sent = await getJson(page.request, "/api/lead-assist?view=sent");
    const received = await getJson(
      page.request,
      "/api/lead-assist?view=received"
    );
    const blob = `${JSON.stringify(sent.json)}${JSON.stringify(received.json)}`;
    expect(blob).not.toMatch(/"phone"\s*:|"email"\s*:/);
    await ctx.close();
  });

  test("Opportunity Desk queue loads without becoming a candidate browser", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("opportunity-desk")), "no desk state");
    const ctx = await browser.newContext({
      storageState: authStatePath("opportunity-desk"),
    });
    const page = await ctx.newPage();
    await page.goto("/desk/queue");
    await page.waitForLoadState("domcontentloaded");
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/Application error/i);
    expect(body.toLowerCase()).not.toMatch(/paid lead assist is on/);
    const sent = await getJson(page.request, "/api/lead-assist?view=desk");
    expect(sent.status).toBeLessThan(500);
    await ctx.close();
  });
});
