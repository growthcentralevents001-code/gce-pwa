/**
 * Phase 14B — authenticated role matrix.
 *
 * BLOCKED until BG-32 gce-dev fixtures exist (no passwords / role_assignments).
 * Do not invent credentials or fabricate browser auth state.
 */
import { test } from "@playwright/test";

const FIXTURE =
  process.env.E2E_CUSTOMER_EMAIL && process.env.E2E_CUSTOMER_PASSWORD;

test.describe("Phase 14B — authenticated role matrix", () => {
  test.skip(!FIXTURE, "BG-32: authenticated Playwright fixtures required");

  test("placeholder — customer login when fixtures present", async () => {
    // Implemented when E2E_* env + role_assignments seeds are Founder-approved.
  });
});
