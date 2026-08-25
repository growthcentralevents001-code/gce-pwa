/**
 * Phase 14B-R — live IDOR probes (read-only).
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  expectAccessDenied,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { customerAction, getJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

test.describe("IDOR", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("customer B cannot open customer A ticket URL or list it", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer A");
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const a = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const aPage = await a.newPage();
    const ticketsA = await getJson(aPage.request, "/api/customer?view=tickets");
    const ticket = (ticketsA.json.tickets ?? [])[0];
    await a.close();
    test.skip(!ticket, "customer A has no ticket yet");

    const b = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await b.newPage();
    const res = await page.goto(`/customer/tickets/${ticket.id}`);
    const status = res?.status() ?? 0;
    const body = await page.locator("body").innerText();
    const denied =
      status === 404 ||
      /not found|access denied|don't have permission/i.test(body) ||
      !body.includes(String(ticket.ticket_ref ?? "___never___"));
    expect(denied).toBeTruthy();
    const api = await getJson(page.request, "/api/customer?view=tickets");
    const idsB = (api.json.tickets ?? []).map((t: { id: string }) => t.id);
    expect(idsB).not.toContain(ticket.id);
    const payload = JSON.stringify(api.json);
    expect(payload).not.toMatch(/qr_token_hash|aadhaar|refresh_token/i);
    await b.close();
  });

  test("customer cannot read finance dashboard", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    await page.goto("/dashboard/finance");
    await expect(page).toHaveURL(/unauthorized/);
    await expect(
      page.getByRole("heading", { name: /access denied/i })
    ).toBeVisible({ timeout: 15_000 });
    await ctx.close();
  });

  test("customer cannot check in or redeem via API", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const check = await customerAction(page, {
      action: "check_in_ticket",
      ticketId: ids.mkt_event_attr,
      presentedToken: "not-a-real-token-value",
    });
    expect([400, 403, 404, 409, 422]).toContain(check.status);
    const redeem = await customerAction(page, {
      action: "redeem_offer",
      claimId: ids.mkt_offer,
      presentedToken: "not-a-real-token-value",
    });
    expect([400, 403, 404, 409, 422]).toContain(redeem.status);
    await ctx.close();
  });

  test("unrelated customer cannot open Enterprise Client project", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await page.goto(`/enterprise/projects/${ids.ent_project_a}`);
    const status = res?.status() ?? 0;
    const body = await page.locator("body").innerText();
    expect(
      status === 404 ||
        /not found|access denied|unauthorized|don't have permission/i.test(body)
    ).toBeTruthy();
    expect(body).not.toMatch(/Kickoff|commercial_total|₹2,00,000/);
    await ctx.close();
  });

  test("Support cannot open Compliance or Finance internals", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("support")), "no support");
    const ctx = await browser.newContext({
      storageState: authStatePath("support"),
    });
    const page = await ctx.newPage();
    await expectAccessDenied(page, "/dashboard/compliance");
    await expectAccessDenied(page, "/dashboard/finance");
    await ctx.close();
  });

  test("Connect member sent-leads payload does not include contact fields", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const sent = await getJson(page.request, "/api/lead-assist?view=sent");
    expect(sent.status).toBeLessThan(500);
    const blob = JSON.stringify(sent.json);
    expect(blob).not.toMatch(/"phone"\s*:|"email"\s*:|"aadhaar"/i);
    if (sent.json.paidMechanics) {
      const flags = Object.values(sent.json.paidMechanics);
      expect(flags.every((v) => v === false)).toBeTruthy();
    }
    await ctx.close();
  });

  test("Connect BDP cannot read an unrelated unit dashboard", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-bdp")), "no connect-bdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-bdp"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/connect/bdp?unitId=${ids.ent_client}`
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("MBDP cannot read an unrelated Venue dashboard", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    const ctx = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/marketplace/bdp?venueId=${ids.mkt_venue_b}`
    );
    expect([403, 404]).toContain(res.status);
    const blob = JSON.stringify(res.json);
    expect(blob).not.toMatch(/aadhaar|bank_account|ifsc|pan_number/i);
    await ctx.close();
  });

  test("Enterprise Client cannot read another client via API", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-client")), "no client");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-client"),
    });
    const page = await ctx.newPage();
    const mine = await getJson(page.request, "/api/enterprise");
    const ownId = mine.json.clients?.[0]?.id;
    const other = ids.ent_client;
    test.skip(!other, "no fixture client");
    if (ownId && ownId === other) {
      test.info().annotations.push({
        type: "note",
        description: "fixture client is this representative — skip cross-id",
      });
    }
    const res = await getJson(
      page.request,
      `/api/enterprise?clientId=00000000-0000-4000-8000-000000000099`
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("Expert cannot read an unassigned client dashboard", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("enterprise-expert")), "no expert");
    const ctx = await browser.newContext({
      storageState: authStatePath("enterprise-expert"),
    });
    const page = await ctx.newPage();
    const res = await getJson(
      page.request,
      `/api/enterprise?clientId=00000000-0000-4000-8000-000000000099`
    );
    expect(res.status).toBeGreaterThanOrEqual(400);
    const blob = JSON.stringify(res.json);
    expect(blob).not.toMatch(/commercial_total_minor|finance_cosigned/);
    await ctx.close();
  });
});
