/**
 * Phase 14B-R — Offer claim → venue redemption.
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

test.describe("offer claim → redemption", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("customer-b claims; venue redeems once; repeat rejected; not revenue", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    await resetFixtureOfferClaims(ids.mkt_offer);
    const customerCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const customerPage = await customerCtx.newPage();
    await customerPage.goto(`/customer/offers/${ids.mkt_offer}`);
    await expect(
      customerPage.getByText(/claiming is not a purchase/i)
    ).toBeVisible({ timeout: 20_000 });
    const claimed = await customerAction(customerPage, {
      action: "claim_offer",
      offerEventId: ids.mkt_offer,
    });
    expect(claimed.status).toBeLessThan(300);
    expect(claimed.json.isRevenue).toBe(false);
    const claimId = claimed.json.claim?.id as string;
    const rawClaimToken = claimed.json.rawClaimToken as string;
    expect(claimId).toBeTruthy();
    expect(rawClaimToken).toBeTruthy();
    await customerCtx.close();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await venueCtx.newPage();
    await page.goto("/venue/redemptions");
    await expect(
      page.getByRole("heading", { name: "Claims & redemptions" })
    ).toBeVisible();
    const first = await customerAction(page, {
      action: "redeem_offer",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(first.status).toBeLessThan(300);
    expect(first.json.createsRevenue).toBe(false);
    const second = await customerAction(page, {
      action: "redeem_offer",
      claimId,
      presentedToken: rawClaimToken,
    });
    expect(second.status).toBeGreaterThanOrEqual(400);
    await venueCtx.close();
  });

  test("expired claim is rejected without becoming revenue", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    const claimIdExpired = ids.mkt_expired_claim;
    test.skip(!claimIdExpired, "no expired claim fixture");
    const ctx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await ctx.newPage();
    const res = await customerAction(page, {
      action: "redeem_offer",
      claimId: claimIdExpired,
      presentedToken: "e2e-expired-claim-token",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(JSON.stringify(res.json).toLowerCase()).not.toMatch(
      /createsrevenue":true/
    );
    await ctx.close();
  });
});
