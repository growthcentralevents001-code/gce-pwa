/**
 * Phase 14B-P1 — Offer claim credential reopen + redemption.
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
import { resetFixtureOfferClaims } from "../auth/fixture-reset";

loadTestEnv();
const ids = loadFixtureIds();

function fingerprint(token: string) {
  return createHash("sha256").update(token).digest("hex").slice(0, 16);
}

test.describe("offer claim redisplay (BG-12)", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("claim, new session reopen, venue redeem once, repeat rejected", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    await resetFixtureOfferClaims(ids.mkt_offer);

    const claimCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const claimPage = await claimCtx.newPage();
    const claimed = await customerAction(claimPage, {
      action: "claim_offer",
      offerEventId: ids.mkt_offer,
    });
    expect(claimed.status).toBeLessThan(300);
    const claimId = claimed.json.claim?.id as string;
    const first = claimed.json.rawClaimToken as string;
    expect(claimId).toBeTruthy();
    expect(first.length).toBeGreaterThan(20);
    const firstFp = fingerprint(first);
    await claimCtx.close();

    const reopenCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const reopenPage = await reopenCtx.newPage();
    const list = await getJson(reopenPage.request, "/api/customer?view=claims");
    expect(JSON.stringify(list.json)).not.toContain(first);
    expect(JSON.stringify(list.json)).not.toMatch(/claim_token_hash|ciphertext/);

    const cred = await getJson(
      reopenPage.request,
      `/api/customer?view=claim_credential&id=${claimId}`
    );
    expect(cred.status).toBe(200);
    expect(cred.res.headers()["cache-control"] ?? "").toMatch(/no-store/i);
    const token = cred.json.credential?.displayToken as string;
    expect(cred.json.credential?.displayable).toBe(true);
    expect(fingerprint(token)).toBe(firstFp);

    await reopenPage.goto(`/customer/claims?focus=${claimId}`);
    await expect(
      reopenPage.getByText(/present this code at the venue/i)
    ).toBeVisible({ timeout: 20_000 });
    await reopenCtx.close();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const venuePage = await venueCtx.newPage();
    const firstRedeem = await customerAction(venuePage, {
      action: "redeem_offer",
      claimId,
      presentedToken: token,
    });
    expect(firstRedeem.status).toBeLessThan(300);
    expect(firstRedeem.json.createsRevenue).toBe(false);
    const second = await customerAction(venuePage, {
      action: "redeem_offer",
      claimId,
      presentedToken: token,
    });
    expect(second.status).toBeGreaterThanOrEqual(400);
    await venueCtx.close();
  });

  test("expired claim cannot be redeemed and is not displayable as active", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("venue")), "no venue");
    test.skip(!existsSync(authStatePath("customer")), "no customer");
    const claimIdExpired = ids.mkt_expired_claim;
    test.skip(!claimIdExpired, "no expired claim fixture");

    const ownerCtx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const ownerPage = await ownerCtx.newPage();
    const cred = await getJson(
      ownerPage.request,
      `/api/customer?view=claim_credential&id=${claimIdExpired}`
    );
    if (cred.status === 200) {
      expect(cred.json.credential?.displayable).not.toBe(true);
    } else {
      expect(cred.status).toBeGreaterThanOrEqual(400);
    }
    await ownerCtx.close();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const page = await venueCtx.newPage();
    const res = await customerAction(page, {
      action: "redeem_offer",
      claimId: claimIdExpired,
      presentedToken: "e2e-expired-claim-token",
    });
    expect(res.status).toBeGreaterThanOrEqual(400);
    await venueCtx.close();
  });
});
