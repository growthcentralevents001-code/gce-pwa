/**
 * Authenticated Connect Membership application closeout (P1).
 * Proves draft → applied persistence, gating, duplicates, and RBAC negatives.
 */
import { test, expect, type Page, type APIRequestContext } from "@playwright/test";
import { existsSync } from "node:fs";
import {
  authStatePath,
  fixturesAvailable,
  loadTestEnv,
} from "../auth/helpers";
import { loadFixtureIds } from "../auth/ids";
import { getJson, postJson, patchJson } from "../auth/api";

loadTestEnv();
const ids = loadFixtureIds();

const APPLICATION_PAYLOAD = {
  memberName: "E2E Customer One",
  businessName: "E2E Membership Applicant Pvt Ltd",
  businessDescription:
    "Synthetic governed membership application for Phase 14B closeout testing only.",
  phone: "+919876543210",
  email: process.env.E2E_CUSTOMER_EMAIL ?? "e2e.customer.01@gce-fixtures.test",
  businessAddress: "Indiranagar, Bengaluru",
  websiteOrSocial: "https://example.com",
  consentAccepted: true as const,
};

type MembershipRow = {
  id: string;
  status: string;
  allocationStatus?: string;
  allocation_status?: string;
  paymentIntentId?: string | null;
  payment_intent_id?: string | null;
  planKey?: string;
  plan_key?: string;
};

async function fetchMemberships(
  request: APIRequestContext
): Promise<MembershipRow[]> {
  const res = await getJson(request, "/api/connect/memberships");
  expect(res.status).toBe(200);
  return (res.json.memberships ?? []) as MembershipRow[];
}

async function fetchSpecialisationId(
  request: APIRequestContext
): Promise<string> {
  const res = await getJson(request, "/api/connect/specialisations");
  expect(res.status).toBe(200);
  const specs = res.json.specialisations as Array<{ id: string }>;
  expect(specs.length).toBeGreaterThan(0);
  return specs[0]!.id;
}

async function fillWizardAndSubmit(page: Page) {
  await page.goto("/memberships/apply");
  await expect(
    page.getByRole("heading", { name: /Associate membership application/i })
  ).toBeVisible();
  await expect(page.locator("body")).toContainText("Associate");
  await expect(page.locator("body")).not.toContainText(/Core Tier/i);

  await page.locator("#preferredState").fill("Karnataka");
  await page.locator("#preferredCity").fill("Bengaluru");
  const businessName = page.locator("#businessName");
  await businessName.fill("E2E Membership Applicant Pvt Ltd");
  const memberName = page.locator("#memberName");
  if (!(await memberName.inputValue())) {
    await memberName.fill("E2E Customer One");
  }
  const phone = page.locator("#phone");
  if (!(await phone.inputValue())) {
    await phone.fill("+919876543210");
  }
  await page
    .locator("#businessDescription")
    .fill(APPLICATION_PAYLOAD.businessDescription);
  await page.getByRole("button", { name: /^Continue$/i }).click();

  await expect(
    page.getByText(/Choose one primary business specialisation/i)
  ).toBeVisible({ timeout: 20_000 });
  await page.locator("button[aria-pressed]").first().click();
  await page.getByRole("button", { name: /^Continue$/i }).click();

  await page.getByRole("button", { name: /^Continue$/i }).click();

  await expect(
    page.getByText("Advisory seat check", { exact: false }).first()
  ).toBeVisible({ timeout: 20_000 });
  await expect(page.getByRole("button", { name: /Re-check/i })).toBeVisible({
    timeout: 20_000,
  });
  await page.getByRole("button", { name: /^Continue$/i }).click();

  await page.locator('input[type="checkbox"]').check();
  await page.getByRole("button", { name: /Submit application/i }).click();
  await page.waitForURL(/\/connect\/membership/, { timeout: 30_000 });
}

test.describe("Connect membership application", () => {
  test.skip(!fixturesAvailable(), "fixtures required");
  test.describe.configure({ mode: "serial" });

  test("eligible customer submits application via wizard (draft → applied)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer auth state");

    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();

    let memberships = await fetchMemberships(page.request);
    const existing = memberships[0];

    if (!existing) {
      await fillWizardAndSubmit(page);
    } else if (existing.status === "draft") {
      await fillWizardAndSubmit(page);
    } else if (existing.status === "applied") {
      await page.goto("/connect/membership");
      await expect(page.locator("body")).toContainText(
        /applied|under review|submitted/i
      );
    } else {
      test.skip(
        true,
        `customer membership in unexpected status: ${existing.status}`
      );
    }

    memberships = await fetchMemberships(page.request);
    const primary = memberships[0];
    expect(primary).toBeTruthy();
    expect(primary!.status).toBe("applied");
    expect(primary!.status).not.toBe("pending_payment");
    expect(primary!.status).not.toBe("active");
    expect(
      primary!.paymentIntentId ?? primary!.payment_intent_id ?? null
    ).toBeFalsy();

    await ctx.close();
  });

  test("applied status persists after refresh and new session", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer auth state");

    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const memberships = await fetchMemberships(page.request);
    const primary = memberships[0];
    test.skip(!primary, "no customer membership — run submit test first");
    expect(primary!.status).toBe("applied");

    await page.goto("/connect/membership");
    await page.reload();
    await expect(page.locator("body")).toContainText(/applied|under review/i);

    await page.goto("/memberships/apply");
    await expect(page).toHaveURL(/\/connect\/membership/);

    await ctx.close();

    const ctx2 = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page2 = await ctx2.newPage();
    const again = await fetchMemberships(page2.request);
    expect(again[0]?.status).toBe("applied");
    await ctx2.close();
  });
});

test.describe("Connect membership protections", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("active member cannot create duplicate application (API)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const specId = await fetchSpecialisationId(page.request);
    const res = await postJson(page.request, "/api/connect/memberships", {
      specialisationId: specId,
      preferredCity: "Bengaluru",
      preferredState: "Karnataka",
      application: APPLICATION_PAYLOAD,
      submit: true,
    });
    expect(res.status).toBe(409);
    expect(JSON.stringify(res.json).toLowerCase()).toMatch(
      /already have|in progress|conflict/
    );
    await ctx.close();
  });

  test("purchase flag off — payment_succeeded denied for applicant", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer state");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const page = await ctx.newPage();
    const memberships = await fetchMemberships(page.request);
    const primary = memberships[0];
    test.skip(!primary, "no customer membership");
    test.skip(
      primary!.status !== "applied" && primary!.status !== "draft",
      "need applied/draft membership"
    );

    const pay = await patchJson(page.request, "/api/connect/memberships", {
      action: "payment_succeeded",
      membershipId: primary!.id,
      paymentIntentId: "00000000-0000-4000-8000-000000000099",
    });
    expect(pay.status).toBeGreaterThanOrEqual(400);

    const after = await fetchMemberships(page.request);
    expect(after[0]?.status).not.toBe("pending_verification");
    expect(after[0]?.status).not.toBe("active");
    await ctx.close();
  });

  test("member cannot self-activate membership", async ({ browser }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const res = await patchJson(page.request, "/api/connect/memberships", {
      action: "activate",
      membershipId: ids.membership,
      reason: "E2E self-activate probe",
    });
    expect(res.status).toBeGreaterThanOrEqual(403);
    await ctx.close();
  });

  test("member cannot self-assign Circle seat via allocation API", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();
    const specId = await fetchSpecialisationId(page.request);
    const res = await postJson(page.request, "/api/connect/circles", {
      action: "propose_allocation",
      membershipId: ids.membership,
      circleId: ids.circle,
      specialisationId: specId,
      reason: "E2E self-assign probe",
    });
    expect(res.status).toBeGreaterThanOrEqual(403);
    await ctx.close();
  });

  test("apply wizard is Associate-only (no Core selection)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B state");
    const ctx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const page = await ctx.newPage();
    const memberships = await fetchMemberships(page.request);
    if (memberships.some((m) => m.status !== "draft" && m.status !== undefined)) {
      await ctx.close();
      return;
    }
    await page.goto("/memberships/apply");
    if (page.url().includes("/connect/membership")) {
      await ctx.close();
      return;
    }
    await expect(
      page.getByRole("heading", { name: /Associate membership application/i })
    ).toBeVisible();
    await expect(page.locator("body")).not.toContainText(
      /Select Core|Buy Core|Core Tier/i
    );
    await ctx.close();
  });

  test("customer B cannot submit or update customer A membership (IDOR)", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("customer")), "no customer A");
    test.skip(!existsSync(authStatePath("customer-b")), "no customer B");

    const aCtx = await browser.newContext({
      storageState: authStatePath("customer"),
    });
    const aPage = await aCtx.newPage();
    const memberships = await fetchMemberships(aPage.request);
    const target = memberships[0];
    await aCtx.close();
    test.skip(!target, "customer A has no membership");

    const bCtx = await browser.newContext({
      storageState: authStatePath("customer-b"),
    });
    const bPage = await bCtx.newPage();
    const submit = await patchJson(bPage.request, "/api/connect/memberships", {
      action: "submit",
      membershipId: target!.id,
    });
    expect(submit.status).toBeGreaterThanOrEqual(403);

    const update = await patchJson(bPage.request, "/api/connect/memberships", {
      action: "update_draft",
      membershipId: target!.id,
      preferredCity: "Mumbai",
    });
    expect(update.status).toBeGreaterThanOrEqual(403);

    const list = await fetchMemberships(bPage.request);
    expect(list.map((m) => m.id)).not.toContain(target!.id);
    await bCtx.close();
  });
});

test.describe("Connect active member experience", () => {
  test.skip(!fixturesAvailable(), "fixtures required");

  test("allocated member sees plan, Circle, and Lead Assist entry", async ({
    browser,
  }) => {
    test.skip(!existsSync(authStatePath("connect-member")), "no member state");
    const ctx = await browser.newContext({
      storageState: authStatePath("connect-member"),
    });
    const page = await ctx.newPage();

    const memberships = await fetchMemberships(page.request);
    const primary = memberships[0];
    expect(primary).toBeTruthy();
    expect(primary!.status).toBe("active");
    const allocation =
      primary!.allocationStatus ?? primary!.allocation_status ?? "";
    expect(allocation).toMatch(/allocated/i);

    await page.goto("/connect/membership");
    await expect(page.locator("body")).toContainText(/Associate/i);
    await expect(page.locator("body")).toContainText(/active|allocated/i);

    await page.goto("/connect/circle");
    await expect(page.locator("body")).not.toContainText(
      /No membership|Allocation status: unallocated/i
    );
    await expect(
      page.locator("#main-content").getByRole("link", { name: /Lead Assist/i })
    ).toBeVisible();

    await page.goto("/connect/specialisation");
    await expect(page.locator("body")).toContainText(/specialisation/i);

    await ctx.close();
  });
});

const RESPONSIVE_VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of RESPONSIVE_VIEWPORTS) {
  test.describe(`membership status UI @ ${vp.name}`, () => {
    test.skip(!fixturesAvailable(), "fixtures required");
    test.use({
      viewport: { width: vp.width, height: vp.height },
      storageState: existsSync(authStatePath("customer"))
        ? authStatePath("customer")
        : undefined,
    });

    test("customer membership status page renders without overflow", async ({
      page,
    }) => {
      test.skip(!existsSync(authStatePath("customer")), "no customer state");
      await page.goto("/connect/membership");
      await page.waitForLoadState("domcontentloaded");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });
  });
}
