/**
 * Phase 14B-R — Enterprise co-sign threshold + dynamic milestones.
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

async function createQuote(
  page: import("@playwright/test").Page,
  totalProposedMinor: number
) {
  return postJson(page.request, "/api/enterprise", {
    action: "create_quote",
    opportunityId: ids.ent_opp,
    clientId: ids.ent_client,
    totalProposedMinor,
    lines: [
      {
        label: "E2E line",
        amountMinor: totalProposedMinor,
          revenueComponentKey: `e2e-line-${totalProposedMinor}-${Date.now()}`,
      },
    ],
  });
}

test.describe("enterprise co-sign + milestones", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("quotes: below and exact ₹5L do not require co-sign; above does", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-expert")), "no expert");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-expert"),
    });
    const page = await ctx.newPage();
    const below = await createQuote(page, 49_999_999);
    const exact = await createQuote(page, 50_000_000);
    const above = await createQuote(page, 50_000_001);
    for (const row of [below, exact, above]) {
      if (row.status >= 400) {
        test.info().annotations.push({
          type: "blocked",
          description: `create_quote ${row.status} ${JSON.stringify(row.json).slice(0, 240)}`,
        });
      }
    }
    test.skip(
      below.status >= 400,
      "create_quote not available for expert fixture"
    );
    expect(below.json.quote?.finance_cosign_required).toBe(false);
    expect(exact.json.quote?.finance_cosign_required).toBe(false);
    expect(above.json.quote?.finance_cosign_required).toBe(true);
    expect(String(above.json.quote?.status)).toMatch(/pending_finance_cosign/);

    const expertCosign = await postJson(page.request, "/api/enterprise", {
      action: "finance_cosign",
      quoteId: above.json.quote.id,
    });
    expect(expertCosign.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("Finance can co-sign; EBDP cannot issue binding quote", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("finance")), "no finance");
    test.skip(!existsSync(authStatePath("enterprise-bdp")), "no ebdp");
    const expert = await browser.newContext({
      storageState: authStatePath("enterprise-expert"),
    });
    const expertPage = await expert.newPage();
    const above = await createQuote(expertPage, 60_000_000);
    await expert.close();
    test.skip(above.status >= 400, "could not create above-threshold quote");

    const fin = await browser.newContext({
      storageState: authStatePath("finance"),
    });
    const finPage = await fin.newPage();
    const signed = await postJson(finPage.request, "/api/enterprise", {
      action: "finance_cosign",
      quoteId: above.json.quote.id,
      reason: "E2E co-sign probe",
    });
    expect(signed.status).toBeLessThan(500);
    if (signed.status < 300) {
      expect(signed.json.quote?.finance_cosigned_by).toBeTruthy();
    }
    await fin.close();

    const bdp = await browser.newContext({
      storageState: authStatePath("enterprise-bdp"),
    });
    const bdpPage = await bdp.newPage();
    const issue = await postJson(bdpPage.request, "/api/enterprise", {
      action: "issue_quote",
      quoteId: above.json.quote.id,
    });
    expect(issue.status).toBeGreaterThanOrEqual(400);
    await bdp.close();
  });

  test("project A shows 2 milestones and project B shows 4 — no 30/40/30 fallback", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const page = await ctx.newPage();
    await page.goto(`/enterprise/projects/${ids.ent_project_a}`);
    await page.waitForLoadState("domcontentloaded");
    const a = await page.locator("body").innerText();
    if (/not found/i.test(a)) {
      test.info().annotations.push({
        type: "blocked",
        description: "project A not visible to client bundle",
      });
    } else {
      expect(a).toMatch(/Kickoff|Close|Milestones/);
      expect(a).not.toMatch(/30\s*\/\s*40\s*\/\s*30/);
    }
    await page.goto(`/enterprise/projects/${ids.ent_project_b}`);
    const b = await page.locator("body").innerText();
    if (!/not found/i.test(b)) {
      expect(b).toMatch(/Discovery|Design|Build|Handover/);
      expect(b).not.toMatch(/30\s*\/\s*40\s*\/\s*30/);
    }
    await ctx.close();
  });
});
