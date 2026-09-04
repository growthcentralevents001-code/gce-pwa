/**
 * Enterprise core client workflow — requirement intake + isolation.
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

test.describe("enterprise client requirement workflow", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("client submits requirement and can read own opportunity", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const page = await ctx.newPage();
    const submitted = await postJson(page.request, "/api/enterprise", {
      action: "submit_client_requirement",
      clientId: ids.ent_client,
      title: `E2E requirement ${Date.now()}`,
      rawRequirement:
        "Corporate event programme requiring structured GCE Enterprise review and quotation.",
    });
    expect(submitted.status).toBeLessThan(300);
    expect(submitted.json.requirement?.readiness_status).toBe("submitted");
    const oppId = submitted.json.opportunity?.id as string;
    expect(oppId).toBeTruthy();

    await page.goto(`/enterprise/opportunities/${oppId}`);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByLabel("Enterprise requirement timeline")).toBeVisible();
    await ctx.close();
  });

  test("client cannot submit requirement for another client org", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const page = await ctx.newPage();
    const res = await postJson(page.request, "/api/enterprise", {
      action: "submit_client_requirement",
      clientId: "00000000-0000-4000-8000-000000000099",
      title: "Cross-client attempt",
      rawRequirement: "Should be forbidden",
    });
    expect(res.status).toBeGreaterThanOrEqual(403);
    await ctx.close();
  });

  test("client cannot qualify own requirement", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    test.skip(!existsSync(authStatePath("enterprise-expert")), "no expert");
    const expertCtx = await browser.newContext({
      storageState: authStatePath("enterprise-expert"),
    });
    const expertPage = await expertCtx.newPage();
    const submitted = await postJson(expertPage.request, "/api/enterprise", {
      action: "create_opportunity",
      clientId: ids.ent_client,
      title: `Expert-opened ${Date.now()}`,
      summary: "For isolation test",
    });
    await expertCtx.close();
    test.skip(submitted.status >= 300, "could not seed opportunity");
    const oppId = submitted.json.opportunity?.id as string;

    const clientCtx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const clientPage = await clientCtx.newPage();
    const qualify = await postJson(clientPage.request, "/api/enterprise", {
      action: "qualify_requirement",
      opportunityId: oppId,
    });
    expect(qualify.status).toBe(403);
    await clientCtx.close();
  });

  test("public enterprise page links to canonical intake", async ({ page }) => {
    await page.goto("/enterprise");
    await expect(
      page.getByRole("link", { name: /submit a requirement|submit requirement/i }).first()
    ).toHaveAttribute("href", "/enterprise/intake");
  });
});
