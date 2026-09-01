import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

describe("venue onboarding RLS migration", () => {
  it("scopes MBDP venue reads to attribution or submitter without active-only bug", () => {
    const sql = readFileSync(
      resolve(
        process.cwd(),
        "supabase/migrations/20260901180000_venue_onboarding_mbdp_rls.sql"
      ),
      "utf8"
    );
    expect(sql).toContain("submitted_by = public.gce_current_user_id()");
    expect(sql).toContain("a.bdp_user_id = public.gce_current_user_id()");
    expect(sql).toContain("a.venue_id = marketplace_venues.id");
    expect(sql).not.toContain("a.status = 'active'");
  });
});
