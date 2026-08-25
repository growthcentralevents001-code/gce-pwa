import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { test as base, expect, type Page } from "@playwright/test";

const AUTH_DIR = resolve(process.cwd(), ".playwright/.auth");

export function loadTestEnv() {
  for (const file of [".env.test.local", ".env.local"]) {
    const path = resolve(process.cwd(), file);
    if (!existsSync(path)) continue;
    for (const line of readFileSync(path, "utf8").split("\n")) {
      const t = line.trim();
      if (!t || t.startsWith("#")) continue;
      const eq = t.indexOf("=");
      if (eq <= 0) continue;
      const key = t.slice(0, eq).trim();
      let val = t.slice(eq + 1).trim();
      if (
        (val.startsWith('"') && val.endsWith('"')) ||
        (val.startsWith("'") && val.endsWith("'"))
      ) {
        val = val.slice(1, -1);
      }
      if (process.env[key] === undefined) process.env[key] = val;
    }
  }
}

export function authStatePath(role: string) {
  return resolve(AUTH_DIR, `${role}.json`);
}

export function ensureAuthDir() {
  mkdirSync(AUTH_DIR, { recursive: true });
}

export function fixturesAvailable() {
  loadTestEnv();
  return Boolean(
    process.env.E2E_CUSTOMER_EMAIL && process.env.E2E_FIXTURE_PASSWORD
  );
}

export async function loginViaUi(
  page: Page,
  email: string,
  password: string,
  nextPath = "/dashboard/personal"
) {
  const attempt = async () => {
    await page.goto(`/login?next=${encodeURIComponent(nextPath)}`, {
      waitUntil: "load",
      timeout: 30_000,
    });
    const emailInput = page.locator("#email");
    await expect(emailInput).toBeVisible({ timeout: 20_000 });
    await emailInput.click();
    await emailInput.fill(email);
    await expect(emailInput).toHaveValue(email, { timeout: 10_000 });
    const passwordInput = page.locator("#password");
    await passwordInput.fill(password);
    await expect(passwordInput).toHaveValue(password);
    await Promise.all([
      page.waitForURL((url) => !url.pathname.startsWith("/login"), {
        timeout: 45_000,
      }),
      page.getByRole("button", { name: /^sign in$/i }).click(),
    ]);
  };

  let lastError: unknown;
  for (let i = 0; i < 3; i++) {
    try {
      await attempt();
      return;
    } catch (err) {
      lastError = err;
      const body = await page.locator("body").innerText().catch(() => "");
      if (!/database error granting user/i.test(body) && i === 0) {
        // First failure that is not the known Supabase grant flake: still retry once.
      }
      await page.waitForTimeout(1_500 * (i + 1));
    }
  }
  throw lastError;
}

export async function expectAccessDenied(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState("domcontentloaded");
  const heading = page.getByRole("heading", { name: /access denied/i });
  await heading.waitFor({ state: "visible", timeout: 8_000 }).catch(() => null);
  const url = page.url();
  const body = await page.locator("body").innerText();
  const denied =
    (await heading.isVisible().catch(() => false)) ||
    url.includes("/unauthorized") ||
    url.includes("/login") ||
    /access denied|access required|access restricted|not authorized|forbidden|don't have permission|requires [\w.]+/i.test(
      body
    );
  expect(
    denied,
    `Expected denial for ${path}; url=${url}; body snip=${body.slice(0, 240)}`
  ).toBeTruthy();
}

type Fixtures = {
  customerPage: Page;
};

export const test = base.extend<Fixtures>({
  // Playwright fixture callback is named `run` to avoid react-hooks lint on `use`
  customerPage: async ({ browser }, run) => {
    loadTestEnv();
    const state = authStatePath("customer");
    const context = await browser.newContext(
      existsSync(state) ? { storageState: state } : {}
    );
    const page = await context.newPage();
    await run(page);
    await context.close();
  },
});

export { expect };
