/**
 * Marketplace BDP public opportunity page — responsive smoke.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`marketplace-bdp public @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("opportunity page explains role, economics, and apply CTA", async ({
      page,
    }) => {
      await page.goto("/marketplace-bdp");
      await expect(page.locator("body")).toContainText(
        "Marketplace BDP opportunity"
      );
      await expect(page.locator("body")).toContainText("80%");
      await expect(page.locator("body")).toContainText(
        "not pending Marketplace BDP commission"
      );
      await expect(page.locator("body")).toContainText(
        /not guaranteed|not assured/i
      );
      await expect(page.locator("body")).not.toContainText(/ZBP opportunity/i);
      await expect(
        page.getByRole("link", { name: /Apply now/i }).first()
      ).toHaveAttribute("href", "/login?next=/marketplace-bdp/apply");

      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });
  });
}

test("apply/role marketplace-bdp intent routes to opportunity page", async ({
  page,
}) => {
  await page.goto("/apply/role?intent=marketplace-bdp");
  await expect(
    page.locator('a[href="/marketplace-bdp"]')
  ).toBeVisible();
});
