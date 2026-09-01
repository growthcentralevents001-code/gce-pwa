/**
 * Venue Partner onboarding — MBDP recommend → eligibility → documents → Ops approve.
 */
import { test, expect } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { randomUUID } from "node:crypto";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { fixtureUuid, loadFixtureIds } from "../auth/ids";
import { postJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

function fixtureUsers(): Record<string, string> {
  const path = resolve(process.cwd(), ".playwright/fixture-ids.json");
  if (!existsSync(path)) return {};
  const parsed = JSON.parse(readFileSync(path, "utf8")) as {
    users?: Record<string, string>;
  };
  return parsed.users ?? {};
}

test.describe("venue partner onboarding", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("MBDP onboarding flow; venue gated until Ops approves", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("marketplace-bdp")), "no mbdp");
    test.skip(!existsSync(authStatePath("platform-ops")), "no ops");
    test.skip(!existsSync(authStatePath("venue")), "no venue");

    const users = fixtureUsers();
    const venueRepId = users.e2e_venue_rep_01;
    test.skip(!venueRepId, "no venue rep fixture user");

    const mbdpUnitId = ids.mbdp_unit ?? fixtureUuid("unit:marketplace_bdp");
    const venueName = `E2E Onboard ${randomUUID().slice(0, 8)}`;

    const ops = await browser.newContext({
      storageState: authStatePath("platform-ops"),
    });
    const opsPage = await ops.newPage();

    const orgRes = await postJson(opsPage.request, "/api/admin/organisations", {
      kind: "venue_partner",
      legalName: `${venueName} Legal`,
      tradingName: venueName,
      countryCode: "IN",
      primaryCity: "Bengaluru",
      primaryRepresentativeUserId: venueRepId,
    });
    expect(orgRes.status).toBeLessThan(300);
    const orgId = String(
      orgRes.json?.organisation?.id ?? orgRes.json?.data?.organisation?.id ?? ""
    );
    expect(orgId).toBeTruthy();

    const mbdp = await browser.newContext({
      storageState: authStatePath("marketplace-bdp"),
    });
    const mbdpPage = await mbdp.newPage();

    const created = await postJson(mbdpPage.request, "/api/marketplace/bdp", {
      action: "create_venue",
      organisationId: orgId,
      displayName: venueName,
      city: "Bengaluru",
      state: "Karnataka",
      category: "Restaurant",
      recommendUnitId: mbdpUnitId,
      recommendationNotes: "E2E onboarding recommendation",
      businessProfile: {
        ownerContactName: "E2E Owner",
        contactPhone: "+919999999999",
        contactEmail: "e2e-venue@example.com",
      },
    });
    expect(created.status).toBeLessThan(300);
    const venueId = String(
      created.json?.venue?.id ?? created.json?.data?.venue?.id ?? ""
    );
    expect(venueId).toBeTruthy();
    expect(
      String(created.json?.venue?.status ?? created.json?.data?.venue?.status ?? "")
    ).toMatch(/pending_platform_approval/i);

    await postJson(mbdpPage.request, "/api/marketplace/bdp", {
      action: "record_venue_eligibility",
      venueId,
      result: "eligible",
      notes: "E2E eligibility assist",
    });

    const pdfBody = Buffer.from("%PDF-1.4\n%E2E test document\n");
    const upload = await mbdpPage.request.post("/api/marketplace/venue-documents", {
      multipart: {
        venueId,
        label: "Business registration",
        file: {
          name: "e2e-registration.pdf",
          mimeType: "application/pdf",
          buffer: pdfBody,
        },
      },
    });
    expect(upload.status()).toBeLessThan(300);
    const uploadJson = await upload.json();
    const documentId = String(
      uploadJson?.document?.id ?? uploadJson?.data?.document?.id ?? ""
    );
    expect(documentId).toBeTruthy();

    if (existsSync(authStatePath("customer-b"))) {
      const foreign = await browser.newContext({
        storageState: authStatePath("customer-b"),
      });
      const foreignPage = await foreign.newPage();
      const deniedDoc = await postJson(foreignPage.request, "/api/marketplace/venue-documents", {
        action: "signed_url",
        venueId,
        documentId,
      });
      expect(deniedDoc.status).toBeGreaterThanOrEqual(400);
      await foreign.close();
    }

    const denied = await postJson(mbdpPage.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId,
      reason: "MBDP self-approve attempt",
    });
    expect(denied.status).toBeGreaterThanOrEqual(400);
    await mbdp.close();

    const venueCtx = await browser.newContext({
      storageState: authStatePath("venue"),
    });
    const venuePage = await venueCtx.newPage();
    const blockedEvent = await postJson(venuePage.request, "/api/marketplace/bdp", {
      action: "create_event",
      venueId,
      title: "Pre-approval event",
      startsAt: new Date(Date.now() + 86_400_000).toISOString(),
      capacity: 10,
      priceMinor: 0,
    });
    expect(blockedEvent.status).toBeGreaterThanOrEqual(400);
    await venueCtx.close();

    await opsPage.goto(`/ops/marketplace/venues/${venueId}`);
    await expect(opsPage.locator("body")).toContainText(venueName);
    await expect(opsPage.locator("body")).toContainText(/Eligibility review/i);
    await expect(opsPage.locator("body")).toContainText(/e2e-registration\.pdf|Stored file/i);

    const opsDoc = await postJson(opsPage.request, "/api/marketplace/venue-documents", {
      action: "signed_url",
      venueId,
      documentId,
    });
    expect(opsDoc.status).toBeLessThan(300);
    expect(String(opsDoc.json?.signedUrl ?? opsDoc.json?.data?.signedUrl ?? "")).toContain(
      "http"
    );

    const approved = await postJson(opsPage.request, "/api/marketplace/bdp", {
      action: "approve_venue",
      venueId,
      reason: "E2E Marketplace Ops final approval",
    });
    expect(approved.status).toBeLessThan(300);
    expect(
      String(approved.json?.venue?.status ?? approved.json?.data?.venue?.status ?? "")
    ).toMatch(/active/i);
    await ops.close();
  });
});
