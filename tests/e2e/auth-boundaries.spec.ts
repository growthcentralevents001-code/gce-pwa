import { test, expect } from "@playwright/test";

test.describe("Phase 14B — auth boundaries (unauthenticated)", () => {
  test("login page loads with email field", async ({ page }) => {
    const res = await page.goto("/login");
    expect(res?.status()).toBeLessThan(400);
    await expect(page.locator('input[type="email"]')).toBeVisible({
      timeout: 15_000,
    });
  });

  test("signup page loads", async ({ page }) => {
    const res = await page.goto("/signup");
    expect(res?.status()).toBeLessThan(400);
  });

  test("forgot-password page loads", async ({ page }) => {
    const res = await page.goto("/forgot-password");
    expect(res?.status()).toBeLessThan(400);
  });

  test("protected /customer redirects to login", async ({ page }) => {
    await page.goto("/customer");
    await expect(page).toHaveURL(/login/i);
  });

  test("protected /ops redirects to login", async ({ page }) => {
    await page.goto("/ops");
    await expect(page).toHaveURL(/login/i);
  });

  test("protected /settings redirects to login", async ({ page }) => {
    await page.goto("/settings");
    await expect(page).toHaveURL(/login/i);
  });

  test("protected /dashboard/finance redirects to login", async ({ page }) => {
    await page.goto("/dashboard/finance");
    await expect(page).toHaveURL(/login/i);
  });

  test("login does not open-redirect to external host", async ({ page }) => {
    await page.goto("/login?redirectTo=https://evil.example");
    expect(page.url()).toMatch(/\/login/);
    expect(new URL(page.url()).hostname).not.toBe("evil.example");
  });
});
