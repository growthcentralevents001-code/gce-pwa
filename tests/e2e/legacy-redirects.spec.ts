import { test, expect } from "@playwright/test";

test.describe("Phase 14B — legacy redirects", () => {
  test("/admin redirects toward Ops (or login then ops)", async ({ page }) => {
    const res = await page.goto("/admin", { waitUntil: "domcontentloaded" });
    expect(res?.status()).toBeLessThan(400);
    await expect(page).toHaveURL(/\/(ops|login)/);
  });

  test("/venue/plans redirects to apply", async ({ request }) => {
    const res = await request.get("/venue/plans", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/venue\/apply/);
  });

  test("/partner-dashboard redirects to venue workspace", async ({ request }) => {
    const res = await request.get("/partner-dashboard", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/dashboard\/venue/);
  });

  test("/bdm-dashboard redirects to for-partners", async ({ request }) => {
    const res = await request.get("/bdm-dashboard", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/for-partners/);
  });

  test("/dashboard/venue/events redirects to canonical venue events", async ({
    request,
  }) => {
    const res = await request.get("/dashboard/venue/events", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/venue\/events/);
  });

  test("/wishlist redirects to customer wishlist", async ({ request }) => {
    const res = await request.get("/wishlist", { maxRedirects: 0 });
    expect([301, 302, 307, 308]).toContain(res.status());
    expect(res.headers()["location"]).toMatch(/\/customer\/wishlist/);
  });
});
