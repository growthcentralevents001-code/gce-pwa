/**
 * Offer claim → visit → redemption + Ops inspection.
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
import { resetFixtureOfferClaims } from "../auth/fixture-reset";

loadTestEnv();
const ids = loadFixtureIds();

test.describe("offer visit → redemption journey", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("full flow: claim, venue visit, customer sees visited, redeem, ops inspect", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    test.skip(!existsSync(authStatePath("platform-ops")), "no ops");
    await resetFixtureOfferClaims(ids.mkt_offer);

    const customerCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const customerPage = await customerCtx.newPage();
    const claimed = await customerAction(customerPage, {
      action: "claim_offer",
      offerEventId: ids.mkt_offer,
    });
    expect(claimed.status).toBeLessThan(300);
    expect(claimed.json.isRevenue ?? claimed.json.data?.isRevenue).toBe(false);
    const claimId = (claimed.json.claim?.id ??
      claimed.json.data?.claim?.id) as string;
    const rawClaimToken = (claimed.json.rawClaimToken ??
      claimed.json.data?.rawClaimToken) as string;
    expect(claimId).toBeTruthy();
    expect(rawClaimToken).toBeTruthy();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const venuePage = await venueCtx.newPage();
    const visit = await customerAction(venuePage, {
      action: "confirm_offer_visit",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(visit.status).toBeLessThan(300);
    expect(
      visit.json.createsRevenue ?? visit.json.data?.createsRevenue
    ).toBe(false);

    const visitDup = await customerAction(venuePage, {
      action: "confirm_offer_visit",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(visitDup.status).toBeLessThan(300);
    expect(
      visitDup.json.idempotent ?? visitDup.json.data?.idempotent
    ).toBe(true);

    await customerPage.goto(`/customer/claims?focus=${claimId}`);
    await expect(
      customerPage.getByLabel("Claim timeline").getByText("Visited")
    ).toBeVisible({
      timeout: 20_000,
    });

    const redeem = await customerAction(venuePage, {
      action: "redeem_offer",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(redeem.status).toBeLessThan(300);
    expect(
      redeem.json.createsRevenue ?? redeem.json.data?.createsRevenue
    ).toBe(false);

    const redeemDup = await customerAction(venuePage, {
      action: "redeem_offer",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(redeemDup.status).toBeGreaterThanOrEqual(400);

    await customerPage.reload();
    await expect(
      customerPage.getByLabel("Claim timeline").getByText("Redeemed")
    ).toBeVisible({
      timeout: 20_000,
    });
    await customerCtx.close();
    await venueCtx.close();

    const opsCtx = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const opsPage = await opsCtx.newPage();
    await opsPage.goto(`/ops/marketplace/offers/${ids.mkt_offer}`);
    await expect(opsPage.locator("body")).toContainText(/Offer Event inspection/i);
    await expect(opsPage.locator("body")).toContainText(claimId.slice(0, 8));
    await expect(opsPage.locator("body")).toContainText(/Visit|visit/i);
    await opsCtx.close();
  });

  test("customer cannot self-confirm visit", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const res = await customerAction(page, {
      action: "confirm_offer_visit",
      claimId: ids.mkt_expired_claim || ids.mkt_offer,
      presentedToken: "not-a-real-token-12345",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });

  test("expired claim visit is denied", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    const claimIdExpired = ids.mkt_expired_claim;
    test.skip(!claimIdExpired, "no expired claim fixture");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    const res = await customerAction(page, {
      action: "confirm_offer_visit",
      claimId: claimIdExpired,
      presentedToken: "e2e-expired-claim-token",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await ctx.close();
  });
});

test.describe("offer visit responsive", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  for (const viewport of [
    { width: 390, height: 844 },
    { width: 768, height: 1024 },
    { width: 1366, height: 768 },
  ]) {
    test(`customer claims timeline @ ${viewport.width}`, async ({ browser }) => {
      test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
      const ctx = await browser.newContext({
        storageState: authStatePath("customer-b"),
        viewport,
      });
      const page = await ctx.newPage();
      await page.goto("/customer/claims");
      await expect(page.getByRole("heading", { name: /offer claims/i })).toBeVisible();
      await ctx.close();
    });
  }
});
