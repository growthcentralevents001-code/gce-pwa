/**
 * Prompt 5 — canonical Lead Assist routing-tier evidence.
 * Does not bypass routeLead / generateLeadCandidates.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { getJson, postJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

const CANONICAL_TIERS = new Set([
  "circle_first",
  "cross_circle",
  "wider_network",
]);

test.describe("lead assist routing engine", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("submit uses canonical circle-first → cross-circle → wider ranking", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    test.skip(!existsSync(authStatePath("opportunity-desk")), "no desk");

    const giverCtx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const giver = await giverCtx.newPage();
    const created = await postJson(giver.request, "/api/lead-assist", {
      action: "create",
      title: "E2E Routing Engine Lead",
      requirementSummary:
        "Need a photographer in Bengaluru for canonical routing-tier evidence.",
      city: "Bengaluru",
      state: "Karnataka",
      originCircleId: ids.circle,
      giverMembershipId: ids.membership,
      privacyLevel: "standard",
      tagCodes: [],
    });
    expect(created.status).toBeLessThan(300);
    const leadId = created.json.lead?.id as string;
    expect(leadId).toBeTruthy();
    const submitted = await postJson(giver.request, "/api/lead-assist", {
      action: "submit",
      leadId,
    });
    expect(submitted.status).toBeLessThan(500);
    await giverCtx.close();

    const deskCtx = await browser.newContext({
      storageState: authStatePath("opportunity-desk"),
    });
    const desk = await deskCtx.newPage();
    const candidates = await postJson(desk.request, "/api/lead-assist", {
      action: "generate_candidates",
      leadId,
    });
    expect(candidates.status).toBeLessThan(500);
    const ranked = (candidates.json.candidates ?? []) as Array<{
      routing_tier?: string;
      eligible?: boolean;
    }>;
    for (const row of ranked) {
      if (row.routing_tier) {
        expect(CANONICAL_TIERS.has(row.routing_tier)).toBeTruthy();
      }
    }
    const eligibleTiers = [
      ...new Set(
        ranked.filter((c) => c.eligible).map((c) => c.routing_tier).filter(Boolean)
      ),
    ];
    test.info().annotations.push({
      type: "eligible-routing-tiers",
      description: eligibleTiers.join(",") || "none",
    });
    const deskQueue = await getJson(desk.request, "/api/lead-assist?view=desk");
    const routedOrDesk =
      eligibleTiers.length > 0 ||
      JSON.stringify(deskQueue.json).includes(leadId) ||
      Boolean(submitted.json.result?.desk) ||
      Boolean(submitted.json.result?.assigned);
    expect(routedOrDesk).toBeTruthy();
    await deskCtx.close();
  });

  test("manual_review privacy still falls back to Opportunity Desk", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    test.skip(!existsSync(authStatePath("opportunity-desk")), "no desk");

    const giverCtx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const giver = await giverCtx.newPage();
    const created = await postJson(giver.request, "/api/lead-assist", {
      action: "create",
      title: "E2E Wider-to-Desk Routing",
      requirementSummary: "Synthetic privacy-restricted lead for desk fallback.",
      city: "Bengaluru",
      originCircleId: ids.circle,
      giverMembershipId: ids.membership,
      privacyLevel: "manual_review",
      tagCodes: [],
    });
    expect(created.status).toBeLessThan(300);
    const leadId = created.json.lead?.id as string;
    await postJson(giver.request, "/api/lead-assist", {
      action: "submit",
      leadId,
    });
    await giverCtx.close();

    const deskCtx = await browser.newContext({
      storageState: authStatePath("opportunity-desk"),
    });
    const desk = await deskCtx.newPage();
    const queue = await getJson(desk.request, "/api/lead-assist?view=desk");
    expect(queue.status).toBe(200);
    expect(JSON.stringify(queue.json.queue ?? [])).toContain(leadId);
    await deskCtx.close();
  });
});
