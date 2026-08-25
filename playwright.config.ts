import { defineConfig, devices } from "@playwright/test";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

/** Load .env.test.local into process.env for workers. */
function loadEnvFile(name: string) {
  const path = resolve(process.cwd(), name);
  if (!existsSync(path)) return;
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
loadEnvFile(".env.local");
loadEnvFile(".env.test.local");

/**
 * Phase 14B browser E2E — development only.
 * Authenticated projects depend on setup → .playwright/.auth/*.json
 */
const baseURL = process.env.PLAYWRIGHT_BASE_URL ?? "http://127.0.0.1:3010";

/** Public/unauthenticated specs only — authenticated deep files have dedicated projects. */
const publicIgnore = [
  /auth\.setup\.ts/,
  /authenticated-matrix\.spec\.ts/,
  /authenticated-representative\.spec\.ts/,
  /authenticated-a11y\.spec\.ts/,
  /\/(customer|venue|offers|connect|marketplace|enterprise|finance|security)\//,
];

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: process.env.PLAYWRIGHT_PARALLEL === "1",
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: Number(process.env.PLAYWRIGHT_WORKERS ?? 1),
  reporter: [["list"], ["html", { open: "never", outputFolder: "playwright-report" }]],
  use: {
    baseURL,
    trace: "on-first-retry",
    screenshot: "only-on-failure",
    navigationTimeout: Number(process.env.PLAYWRIGHT_NAV_TIMEOUT_MS ?? 45_000),
    actionTimeout: 15_000,
  },
  projects: [
    { name: "setup", testMatch: /auth\.setup\.ts/ },
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
      testIgnore: publicIgnore,
    },
    {
      name: "chromium-auth",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testMatch: /authenticated-matrix\.spec\.ts/,
    },
    {
      name: "chromium-deep",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testMatch:
        /\/(customer|venue|offers|connect|marketplace|enterprise|finance|security)\/.*\.spec\.ts/,
    },
    {
      name: "firefox",
      use: { ...devices["Desktop Firefox"] },
      testIgnore: publicIgnore,
    },
    {
      name: "firefox-auth",
      use: { ...devices["Desktop Firefox"] },
      dependencies: ["setup"],
      testMatch: /authenticated-representative\.spec\.ts/,
    },
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] },
      testIgnore: publicIgnore,
    },
    {
      name: "webkit-auth",
      use: { ...devices["Desktop Safari"] },
      dependencies: ["setup"],
      testMatch: /authenticated-representative\.spec\.ts/,
    },
    {
      name: "mobile-chrome",
      use: { ...devices["Pixel 7"] },
      testIgnore: publicIgnore,
    },
    {
      name: "mobile-auth",
      use: {
        ...devices["Pixel 7"],
        viewport: { width: 390, height: 844 },
      },
      dependencies: ["setup"],
      testMatch: /authenticated-representative\.spec\.ts/,
    },
    {
      name: "tablet-auth",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 768, height: 1024 },
      },
      dependencies: ["setup"],
      testMatch: /authenticated-representative\.spec\.ts/,
    },
    {
      name: "desktop-auth",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1366, height: 768 },
      },
      dependencies: ["setup"],
      testMatch: /authenticated-representative\.spec\.ts/,
    },
    {
      name: "chromium-a11y-auth",
      use: { ...devices["Desktop Chrome"] },
      dependencies: ["setup"],
      testMatch: /authenticated-a11y\.spec\.ts/,
    },
  ],
  timeout: 45_000,
  expect: { timeout: 10_000 },
});
