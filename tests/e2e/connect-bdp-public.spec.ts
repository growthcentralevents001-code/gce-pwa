/**
 * CBDP verification — public opportunity page + responsive overflow smoke.
 */
import { test, expect } from "@playwright/test";

const VIEWPORTS = [
  { name: "mobile", width: 390, height: 844 },
  { name: "tablet", width: 768, height: 1024 },
  { name: "desktop", width: 1366, height: 768 },
] as const;

for (const vp of VIEWPORTS) {
  test.describe(`connect BDP public @ ${vp.name}`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test("/connect-bdp renders opportunity content without horizontal overflow", async ({
      page,
    }) => {
      await page.goto("/connect-bdp");
      await expect(page.locator("body")).toContainText("Connect BDP opportunity");
      await expect(page.locator("body")).toContainText("Apply now");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });

    test("/for-partners renders without horizontal overflow", async ({ page }) => {
      await page.goto("/for-partners");
      await expect(page.locator("body")).toContainText("Connect BDP");
      const overflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth + 1
      );
      expect(overflow).toBe(false);
    });
  });
}
