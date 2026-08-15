/**
 * Phase 14B-R — Customer booking → ticket → QR redisplay.
 */
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

test.describe.configure({ mode: "serial" });

test.describe("customer booking → ticket → QR", () => {
  test.skip(!fixturesAvailable(), "fixtures required");
  test.use({
    storageState: existsSync(authStatePath("customer"))
      ? authStatePath("customer")
      : undefined,
  });

  test("sandbox booking creates owned ticket without live payments", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const eventId = ids.mkt_event_attr;
    await page.goto(`/customer/events/${eventId}/book`);
    await expect(page.getByRole("heading", { name: /book tickets/i })).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByText(/ticket payments gated/i)).toBeVisible();
    await page.getByRole("checkbox").check();
    const [confirm] = await Promise.all([
      page.waitForResponse(
        (r) =>
          r.url().includes("/api/customer") &&
          r.request().method() === "POST" &&
          r.request().postDataJSON()?.action === "confirm_booking_sandbox"
      ),
      page.getByRole("button", { name: /confirm booking/i }).click(),
    ]);
    const body = await confirm.json();
    expect(body.paymentMode).toBe("sandbox_flag_off");
    expect(Array.isArray(body.tickets)).toBeTruthy();
    expect(body.tickets.length).toBeGreaterThan(0);
    expect(Array.isArray(body.qrTokens)).toBeTruthy();
    expect(body.qrTokens.length).toBeGreaterThan(0);
    await page.waitForURL(/\/customer\/bookings\//, { timeout: 20_000 });
    await expect(page.getByRole("heading", { name: "Booking", exact: true })).toBeVisible();
    test.info().annotations.push({
      type: "bookingId",
      description: String(body.booking?.id ?? ""),
    });
    test.info().annotations.push({
      type: "ticketId",
      description: String(body.tickets[0]?.id ?? ""),
    });
  });

  test("duplicate booking uses backend idempotency / no crash", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const eventId = ids.mkt_event_attr;
    const key = `e2e-dup-${Date.now()}`;
    const first = await customerAction(page, {
      action: "create_booking",
      eventId,
      quantity: 1,
      acceptPolicyVersion: "fd039-48h-default-v1",
      idempotencyKey: key,
    });
    const second = await customerAction(page, {
      action: "create_booking",
      eventId,
      quantity: 1,
      acceptPolicyVersion: "fd039-48h-default-v1",
      idempotencyKey: key,
    });
    expect(first.status).toBeLessThan(500);
    expect(second.status).toBeLessThan(500);
    if (first.status < 300 && second.status < 300) {
      expect(second.json.booking?.id).toBe(first.json.booking?.id);
    }
  });

  test("ticket list and detail load; QR is not redisplayed (BG-11)", async ({
    page,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const tickets = await getJson(page.request, "/api/customer?view=tickets");
    expect(tickets.status).toBe(200);
    const list = tickets.json.tickets ?? [];
    expect(list.length).toBeGreaterThan(0);
    const ticket = list[0];
    expect(ticket.qr_token_hash).toBeUndefined();
    await page.goto(`/customer/tickets/${ticket.id}`);
    await expect(page.getByRole("heading", { name: /ticket/i })).toBeVisible();
    await expect(page.getByText(/gce pass/i)).toBeVisible();
    await expect(page.getByText(/qr issued at confirmation/i)).toBeVisible();
    await expect(page.locator("img[alt*='QR' i]")).toHaveCount(0);
  });

  test("new session cannot redisplay QR from ticket page", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const tickets = await getJson(page.request, "/api/customer?view=tickets");
    const ticket = (tickets.json.tickets ?? [])[0];
    test.skip(!ticket, "no ticket");
    await page.goto(`/customer/tickets/${ticket.id}`);
    await expect(page.getByText(/qr issued at confirmation/i)).toBeVisible();
    await expect(page.locator("canvas, img[alt*='QR' i]")).toHaveCount(0);
    await ctx.close();
  });
});
