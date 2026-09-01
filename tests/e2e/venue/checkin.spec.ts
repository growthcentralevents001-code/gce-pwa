/**
 * Phase 14B-R — Venue check-in cross-role.
 */
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { customerAction } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

test.describe.configure({ mode: "serial" });

let ticketId = "";
let rawToken = "";

test.describe("venue check-in", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("customer sandbox booking yields check-in token", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    await page.goto("/customer", { waitUntil: "domcontentloaded" });
    const created = await customerAction(page, {
      action: "create_booking",
      eventId: ids.mkt_event_checkin,
      quantity: 1,
      acceptPolicyVersion: "fd039-48h-default-v1",
      idempotencyKey: `e2e-checkin-${Date.now()}`,
    });
    expect(created.status).toBeLessThan(300);
    const bookingId = created.json.booking?.id as string;
    const confirmed = await customerAction(page, {
      action: "confirm_booking_sandbox",
      bookingId,
    });
    expect(confirmed.status).toBeLessThan(300);
    ticketId = confirmed.json.tickets?.[0]?.id;
    rawToken = confirmed.json.qrTokens?.[0];
    expect(ticketId).toBeTruthy();
    expect(rawToken).toBeTruthy();
    await ctx.close();
  });

  test("venue check-in succeeds then duplicate is rejected", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue state");
    test.skip(!ticketId || !rawToken, "no ticket token");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    await page.goto("/venue/check-in");
    await expect(
      page.getByRole("heading", { name: "Ticket check-in", level: 1 })
    ).toBeVisible();
    await page.locator("#ticketId").fill(ticketId);
    await page.locator("#presentedToken").fill(rawToken);
    await page.getByRole("button", { name: /^check in$/i }).click();
    await expect(page.getByText(/check-in recorded by server/i)).toBeVisible({
      timeout: 20_000,
    });

    const dup = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: rawToken,
    });
    expect(dup.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("invalid token is rejected", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue state");
    test.skip(!ticketId, "no ticket");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    const bad = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: "invalid-token-value-xxxx",
    });
    expect(bad.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("customer cannot check in (role)", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    test.skip(!ticketId || !rawToken, "no ticket token");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const res = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: rawToken,
    });
    expect(res.status).toBe(403);
    await ctx.close();
  });

  test("venue A check-in of venue B ticket is denied (scope)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    const customerCtx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const customerPage = await customerCtx.newPage();
    await customerPage.goto("/customer", { waitUntil: "domcontentloaded" });
    const created = await customerAction(customerPage, {
      action: "create_booking",
      eventId: ids.mkt_event_unattr,
      quantity: 1,
      acceptPolicyVersion: "fd039-48h-default-v1",
      idempotencyKey: `e2e-venue-b-${Date.now()}`,
    });
    test.skip(created.status >= 300, "could not book unattributed event");
    const confirmed = await customerAction(customerPage, {
      action: "confirm_booking_sandbox",
      bookingId: created.json.booking?.id,
    });
    await customerCtx.close();
    const otherTicket = confirmed.json.tickets?.[0]?.id;
    const otherToken = confirmed.json.qrTokens?.[0];
    test.skip(!otherTicket || !otherToken, "no venue B ticket");

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const venuePage = await venueCtx.newPage();
    const res = await customerAction(venuePage, {
      action: "check_in_ticket",
      ticketId: otherTicket,
      presentedToken: otherToken,
    });
    test.info().annotations.push({
      type: "venue-scope",
      description: `venue A check-in of venue B ticket → ${res.status} ${JSON.stringify(res.json).slice(0, 240)}`,
    });
    expect(
      res.status,
      "Venue A must not check in Venue B tickets (scope IDOR)"
    ).toBeGreaterThanOrEqual(400);
    await venueCtx.close();
  });
});
