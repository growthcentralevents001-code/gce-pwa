/**
 * Phase 14B-P1 — credential IDOR / unauthenticated / list-secret probes.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { customerAction, getJson } from "../auth/api";

loadTestEnv();

test.describe("token IDOR", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("unauthenticated credential fetch is denied", async ({ request }) => {
    const res = await request.get(
      "/api/customer?view=ticket_credential&id=00000000-0000-4000-8000-000000000001"
    );
    expect(res.status()).toBeGreaterThanOrEqual(401);
    const json = await res.json().catch(() => ({}));
    expect(JSON.stringify(json)).not.toMatch(/displayToken":"[A-Za-z0-9_-]{16,}/);
  });

  test("customer B cannot fetch customer A ticket or claim credential", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer A");
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");

    const a = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const aPage = await a.newPage();
    const tickets = await getJson(aPage.request, "/api/customer?view=tickets");
    const ticket = (tickets.json.tickets ?? [])[0];
    const claims = await getJson(aPage.request, "/api/customer?view=claims");
    const claim = (claims.json.claims ?? [])[0];
    await a.close();

    const b = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await b.newPage();
    if (ticket?.id) {
      const cred = await getJson(
        page.request,
        `/api/customer?view=ticket_credential&id=${ticket.id}`
      );
      expect(cred.status).toBeGreaterThanOrEqual(400);
      expect(JSON.stringify(cred.json)).not.toMatch(
        /displayToken":"[A-Za-z0-9_-]{16,}/
      );
    }
    if (claim?.id) {
      const cred = await getJson(
        page.request,
        `/api/customer?view=claim_credential&id=${claim.id}`
      );
      expect(cred.status).toBeGreaterThanOrEqual(400);
      expect(JSON.stringify(cred.json)).not.toMatch(
        /displayToken":"[A-Za-z0-9_-]{16,}/
      );
    }
    await b.close();
  });

  test("ticket list never returns hash or ciphertext", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const tickets = await getJson(page.request, "/api/customer?view=tickets");
    const blob = JSON.stringify(tickets.json);
    expect(blob).not.toMatch(/qr_token_hash|ciphertext|displayToken/);
    await ctx.close();
  });

  test("customer cannot check in with another customer's ticket id", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await customerAction(page, {
      action: "check_in_ticket",
      ticketId: "00000000-0000-4000-8000-000000000001",
      presentedToken: "not-a-real-token",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });
});
