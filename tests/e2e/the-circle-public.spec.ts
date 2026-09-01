/**
 * Public /the-circle — responsive smoke + marketing claim anchors.
 */
import { test, expect } from "@playwright/test";

const APPLY_HREF = "/login?next=/memberships/apply";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`the-circle public @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("/the-circle explains Circle model without horizontal overflow", async ({
      page,
    }) => {
      await page.goto("/the-circle");
      const body = page.locator("body");
      await expect(body).toContainText("How GCE Connect Circle works");
      await expect(body).toContainText("40 Members · 4 GC Power Sectors");
      await expect(body).toContainText("maximum of 40");
      await expect(body).toContainText("15 days");
      await expect(body).toContainText("Lead Assist");
      await expect(body).toContainText("GC Power Sector");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });

    test("Join CTA routes to membership application", async ({ page }) => {
      await page.goto("/the-circle");
      const applyLink = page.getByRole("link", { name: /Apply for Membership/i }).first();
      await expect(applyLink).toHaveAttribute("href", APPLY_HREF);
    });
  });
}
