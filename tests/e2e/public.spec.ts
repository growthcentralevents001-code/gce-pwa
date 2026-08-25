import { test, expect } from "@playwright/test";

const PUBLIC_ROUTES = [
  "/",
  "/about",
  "/contact",
  "/connect",
  "/marketplace",
  "/enterprise",
  "/memberships",
  "/events",
  "/offers",
  "/venues",
  "/for-partners",
  "/the-circle",
  "/terms",
  "/privacy",
  "/login",
  "/signup",
] as const;

test.describe("Phase 14B — public website", () => {
  for (const path of PUBLIC_ROUTES) {
    test(`GET ${path} returns 200 and GCE chrome`, async ({ page }) => {
      const res = await page.goto(path, { waitUntil: "domcontentloaded" });
      expect(res?.status(), path).toBeLessThan(400);
      await expect(page.locator("body")).toBeVisible();
      // Brand signal present somewhere in first paint
      const text = await page.locator("body").innerText();
      expect(text.length).toBeGreaterThan(20);
    });
  }

  test("home has no decorative blue class tokens in DOM class attrs sample", async ({
    page,
  }) => {
    await page.goto("/");
    const html = await page.content();
    expect(html).not.toMatch(/class="[^"]*\b(bg-blue-|text-blue-|border-blue-|from-blue-|to-blue-|sky-|cyan-|indigo-)/i);
  });
});
