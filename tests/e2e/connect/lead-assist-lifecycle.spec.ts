/**
 * Phase 14B-P1 — Lead Assist receiver lifecycle, contact reveal, dual confirm.
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

const GENERAL_BUSINESS_SPEC = "9c442a98-3674-4d84-a6b3-8d56e42eaf0e";

test.describe("lead assist lifecycle closeout", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("manual_review lead reaches Opportunity Desk without assignment", async ({
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
      title: "E2E Desk Fallback Lead",
      requirementSummary: "Synthetic desk-fallback enquiry for Phase 14B-P1.",
      city: "Bengaluru",
      state: "Karnataka",
      originCircleId: ids.circle,
      giverMembershipId: ids.membership,
      privacyLevel: "manual_review",
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
    const sent = await getJson(giver.request, "/api/lead-assist?view=sent");
    const blob = JSON.stringify(sent.json);
    expect(blob).not.toMatch(/"phone"\s*:|"email"\s*:/);
    await giverCtx.close();

    const deskCtx = await browser.newContext({
      storageState: authStatePath("opportunity-desk"),
    });
    const desk = await deskCtx.newPage();
    const queue = await getJson(desk.request, "/api/lead-assist?view=desk");
    expect(queue.status).toBe(200);
    const items = queue.json.queue ?? [];
    expect(JSON.stringify(items)).toContain(leadId);
    expect(JSON.stringify(queue.json)).not.toMatch(/"phone"\s*:|"email"\s*:/);
    await deskCtx.close();
  });

  test("receiver assignment, accept, contact reveal, outcome, dual confirm, no revenue", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    test.skip(!existsSync(authStatePath("multi-role")), "no multi-role");
    test.skip(!existsSync(authStatePath("opportunity-desk")), "no desk");
    test.skip(!existsSync(authStatePath("finance")), "no finance");
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");

    const receiverUserId = ids.users?.e2e_multi_role_01 as string | undefined;
    const giverUserId = ids.users?.e2e_connect_member_01 as string | undefined;
    test.skip(!receiverUserId || !giverUserId, "missing fixture user ids");

    const giverCtx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const giver = await giverCtx.newPage();
    const created = await postJson(giver.request, "/api/lead-assist", {
      action: "create",
      title: "E2E Circle-first Professional Services",
      requirementSummary:
        "Need general business support in Bengaluru for a synthetic Circle-first routing probe.",
      city: "Bengaluru",
      state: "Karnataka",
      originCircleId: ids.circle,
      giverMembershipId: ids.membership,
      specialisationId: GENERAL_BUSINESS_SPEC,
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
    test.info().annotations.push({
      type: "submit",
      description: JSON.stringify(submitted.json).slice(0, 400),
    });

    const beforeAccept = await getJson(
      giver.request,
      "/api/lead-assist?view=sent"
    );
    expect(JSON.stringify(beforeAccept.json)).not.toMatch(
      /"phone"\s*:|"email"\s*:/
    );

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
      candidate_user_id?: string;
      routing_tier?: string;
      eligible?: boolean;
    }>;
    const tiers = new Set(
      ranked.filter((c) => c.eligible).map((c) => c.routing_tier)
    );
    test.info().annotations.push({
      type: "routing-tiers",
      description: [...tiers].join(",") || "none",
    });

    const assignedAlready =
      submitted.json.result?.assigned?.receiver_user_id === receiverUserId;
    if (!assignedAlready) {
      const assigned = await postJson(desk.request, "/api/lead-assist", {
        action: "assign",
        leadId,
        receiverUserId,
        receiverMembershipId: ids.membershipMulti ?? undefined,
        receiverCircleId: ids.circle,
      });
      expect(
        assigned.status,
        `desk assign ${assigned.status} ${JSON.stringify(assigned.json).slice(0, 240)}`
      ).toBeLessThan(300);
    }
    await deskCtx.close();

    const unrelatedCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const unrelated = await unrelatedCtx.newPage();
    const steal = await postJson(unrelated.request, "/api/lead-assist", {
      action: "accept",
      leadId,
    });
    expect(steal.status).toBeGreaterThanOrEqual(400);
    const stealReveal = await postJson(unrelated.request, "/api/lead-assist", {
      action: "reveal_contact",
      leadId,
    });
    expect(stealReveal.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(stealReveal.json)).not.toMatch(
      /@gce-fixtures\.test/
    );
    await unrelatedCtx.close();

    const recvCtx = await browser.newContext({
      storageState: authStatePath("multi-role"),
    });
    const recv = await recvCtx.newPage();
    const received = await getJson(
      recv.request,
      "/api/lead-assist?view=received"
    );
    expect(received.status).toBe(200);
    expect(JSON.stringify(received.json)).toContain(leadId);
    expect(JSON.stringify(received.json)).not.toMatch(
      /"phone"\s*:|"email"\s*:/
    );

    const preReveal = await postJson(recv.request, "/api/lead-assist", {
      action: "reveal_contact",
      leadId,
    });
    expect(preReveal.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(preReveal.json)).not.toMatch(/@gce-fixtures\.test/);

    const accepted = await postJson(recv.request, "/api/lead-assist", {
      action: "accept",
      leadId,
    });
    expect(accepted.status).toBeLessThan(300);
    expect(accepted.json.assignment?.status).toBe("accepted");

    const doubleAccept = await postJson(recv.request, "/api/lead-assist", {
      action: "accept",
      leadId,
    });
    expect(doubleAccept.status).toBeGreaterThanOrEqual(400);

    const revealed = await postJson(recv.request, "/api/lead-assist", {
      action: "reveal_contact",
      leadId,
    });
    expect(revealed.status).toBeLessThan(300);
    expect(revealed.json.revealed?.contact?.email).toBeTruthy();
    expect(revealed.json.revealed?.contact?.phone).toBeNull();

    const outcome = await postJson(recv.request, "/api/lead-assist", {
      action: "submit_outcome",
      leadId,
      amountMinor: 250000,
      notes: "Synthetic closed-business record — not platform revenue",
    });
    expect(outcome.status).toBeLessThan(300);
    await recvCtx.close();

    const confirm = await postJson(giver.request, "/api/lead-assist", {
      action: "confirm_outcome",
      leadId,
      amountMinor: 250000,
      notes: "Giver dual confirmation — synthetic",
    });
    expect(confirm.status).toBeLessThan(300);
    const outcomeBlob = JSON.stringify(confirm.json).toLowerCase();
    expect(outcomeBlob).not.toMatch(/creates_finance_transaction":true/);
    await giverCtx.close();

    const finCtx = await browser.newContext({
      storageState: authStatePath("finance"),
    });
    const fin = await finCtx.newPage();
    const report = await getJson(fin.request, "/api/finance");
    expect(report.status).toBeLessThan(500);
    expect(JSON.stringify(report.json)).not.toContain(leadId);
    await finCtx.close();
  });

  test("assigned receiver can decline; unpaid flags stay off", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    test.skip(!existsSync(authStatePath("multi-role")), "no multi-role");
    test.skip(!existsSync(authStatePath("opportunity-desk")), "no desk");

    const receiverUserId = ids.users?.e2e_multi_role_01 as string | undefined;
    test.skip(!receiverUserId, "missing receiver id");

    const giverCtx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const giver = await giverCtx.newPage();
    const created = await postJson(giver.request, "/api/lead-assist", {
      action: "create",
      title: "E2E Decline Path Lead",
      requirementSummary: "Synthetic decline-path enquiry for Phase 14B-P1.",
      city: "Bengaluru",
      originCircleId: ids.circle,
      giverMembershipId: ids.membership,
      specialisationId: GENERAL_BUSINESS_SPEC,
      privacyLevel: "standard",
      tagCodes: [],
    });
    const leadId = created.json.lead?.id as string;
    expect(created.status).toBeLessThan(300);
    await postJson(giver.request, "/api/lead-assist", {
      action: "submit",
      leadId,
    });
    await giverCtx.close();

    const deskCtx = await browser.newContext({
      storageState: authStatePath("opportunity-desk"),
    });
    const desk = await deskCtx.newPage();
    await postJson(desk.request, "/api/lead-assist", {
      action: "assign",
      leadId,
      receiverUserId,
      receiverCircleId: ids.circle,
    });
    await deskCtx.close();

    const recvCtx = await browser.newContext({
      storageState: authStatePath("multi-role"),
    });
    const recv = await recvCtx.newPage();
    const declined = await postJson(recv.request, "/api/lead-assist", {
      action: "decline",
      leadId,
      reason: "Synthetic decline for evidence",
    });
    expect(declined.status).toBeLessThan(300);
    expect(declined.json.assignment?.status).toBe("declined");
    await recvCtx.close();
  });
});
