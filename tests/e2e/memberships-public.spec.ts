/**
 * Connect Membership public pages — responsive smoke + governed copy.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`memberships public @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("/memberships explains governed journey and plans", async ({ page }) => {
      await page.goto("/memberships");
      await expect(page.locator("body")).toContainText(
        "How GCE Connect Membership Works"
      );
      await expect(page.locator("body")).toContainText("Associate");
      await expect(page.locator("body")).toContainText(
        "not available for direct purchase"
      );
      await expect(page.locator("body")).toContainText("GC Power Sector");
      await expect(page.locator("body")).toContainText(
        "Referrals are not guaranteed"
      );
      await expect(page.locator("body")).toContainText(
        "Activation ≠ Circle allocation"
      );

      const applyLink = page.getByRole("link", {
        name: /Apply for membership/i,
      }).first();
      await expect(applyLink).toHaveAttribute(
        "href",
        "/login?next=/memberships/apply"
      );

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });
  });
}

test("/how-membership-works redirects to /memberships", async ({ page }) => {
  await page.goto("/how-membership-works");
  await expect(page).toHaveURL(/\/memberships$/);
});
