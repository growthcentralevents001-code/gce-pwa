/**
 * Phase 14B-P1 — Ticket QR first display, reopen, owner isolation, check-in.
 */
import { createHash } from "node:crypto";
import { test, expect } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { customerAction, getJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

function fingerprint(token: string) {
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}

test.describe.configure({ mode: "serial" });

let ticketId = "";
let firstFingerprint = "";

test.describe("ticket QR redisplay (BG-11)", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("sandbox confirm issues QR; list does not dump the secret", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const created = await customerAction(page, {
      action: "create_booking",
      eventId: ids.mkt_event_attr,
      quantity: 1,
      acceptPolicyVersion: "fd039-48h-default-v1",
      idempotencyKey: `e2e-qr-reopen-${Date.now()}`,
    });
    expect(created.status).toBeLessThan(300);
    const confirmed = await customerAction(page, {
      action: "confirm_booking_sandbox",
      bookingId: created.json.booking?.id,
    });
    expect(confirmed.status).toBeLessThan(300);
    ticketId = confirmed.json.tickets?.[0]?.id;
    const raw = confirmed.json.qrTokens?.[0] as string;
    expect(ticketId).toBeTruthy();
    expect(typeof raw).toBe("string");
    expect(raw.length).toBeGreaterThan(20);
    firstFingerprint = fingerprint(raw);

    const list = await getJson(page.request, "/api/customer?view=tickets");
    expect(list.status).toBe(200);
    const blob = JSON.stringify(list.json);
    expect(blob).not.toContain(raw);
    expect(blob).not.toMatch(/qr_token_hash/);
    expect(blob).not.toMatch(/ciphertext/);
    await ctx.close();
  });

  test("new session redisplay returns the same owner credential", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    test.skip(!ticketId, "no ticket");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const cred = await getJson(
      page.request,
      `/api/customer?view=ticket_credential&id=${ticketId}`
    );
    expect(cred.status).toBe(200);
    expect(cred.res.headers()["cache-control"] ?? "").toMatch(/no-store/i);
    const token = cred.json.credential?.displayToken as string;
    expect(cred.json.credential?.displayable).toBe(true);
    expect(typeof token).toBe("string");
    expect(fingerprint(token)).toBe(firstFingerprint);
    expect(JSON.stringify(cred.json)).not.toMatch(/ciphertext|token_hash|qr_token_hash/);

    await page.goto(`/customer/tickets/${ticketId}`);
    await expect(page.getByText(/present this code at the venue/i)).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.locator("img[aria-hidden='true']")).toHaveCount(1);
    await ctx.close();
  });

  test("customer B cannot retrieve customer A credential", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    test.skip(!ticketId, "no ticket");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const cred = await getJson(
      page.request,
      `/api/customer?view=ticket_credential&id=${ticketId}`
    );
    expect(cred.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(cred.json)).not.toMatch(/displayToken":"[A-Za-z0-9_-]{16,}/);
    await ctx.close();
  });

  test("venue check-in after reopen succeeds; duplicate and invalid rejected", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    test.skip(!ticketId, "no ticket");

    const ownerCtx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const ownerPage = await ownerCtx.newPage();
    const cred = await getJson(
      ownerPage.request,
      `/api/customer?view=ticket_credential&id=${ticketId}`
    );
    const token = cred.json.credential?.displayToken as string;
    expect(cred.status).toBe(200);
    expect(token).toBeTruthy();
    await ownerCtx.close();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await venueCtx.newPage();
    const first = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: token,
    });
    expect(first.status).toBeLessThan(300);

    const dup = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: token,
    });
    expect(dup.status).toBeGreaterThanOrEqual(400);

    const bad = await customerAction(page, {
      action: "check_in_ticket",
      ticketId,
      presentedToken: "invalid-token-value-xxxx",
    });
    expect(bad.status).toBeGreaterThanOrEqual(400);
    await venueCtx.close();
  });

  test("checked-in ticket redisplay does not present a usable credential", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    test.skip(!ticketId, "no ticket");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const cred = await getJson(
      page.request,
      `/api/customer?view=ticket_credential&id=${ticketId}`
    );
    expect(cred.status).toBe(200);
    expect(cred.json.credential?.displayable).toBe(false);
    expect(cred.json.credential?.displayToken).toBeFalsy();
    expect(cred.json.credential?.reason).toBe("already_used");
    await page.goto(`/customer/tickets/${ticketId}`);
    await expect(page.getByText(/already been checked in/i)).toBeVisible({
      timeout: 20_000,
    });
    await ctx.close();
  });
});
