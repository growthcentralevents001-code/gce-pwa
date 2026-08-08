import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";

const PGHOST = process.env.PHASE2_PGHOST || "/var/run/gce-phase2-pg";
const PGPORT = process.env.PHASE2_PGPORT || "55432";
const PGUSER = process.env.PHASE2_PGUSER || "gce_phase2";
const PGDATABASE = process.env.PHASE2_PGDATABASE || "gce_phase2_test";
const PSQL = process.env.PHASE2_PSQL || "/usr/lib/postgresql/18/bin/psql";

function dbAvailable(): boolean {
  try {
    execFileSync(
      PSQL,
      ["-h", PGHOST, "-p", PGPORT, "-U", PGUSER, "-d", PGDATABASE, "-c", "select 1"],
      { stdio: "pipe" }
    );
    return true;
  } catch {
    return false;
  }
}

const describeDb = dbAvailable() ? describe : describe.skip;

describeDb("Phase 4 identity RLS (local Postgres)", () => {
  it("enforces profile/org isolation, SoD, legacy quarantine, emergency deny", () => {
    const migrations = [
      "supabase/migrations/20260808150000_phase4_identity_rbac_organisation.sql",
    ];
    for (const rel of migrations) {
      execFileSync(
        PSQL,
        [
          "-h",
          PGHOST,
          "-p",
          PGPORT,
          "-U",
          PGUSER,
          "-d",
          PGDATABASE,
          "-v",
          "ON_ERROR_STOP=1",
          "-f",
          path.join(process.cwd(), rel),
        ],
        { encoding: "utf8", stdio: "pipe" }
      );
    }

    execFileSync(
      PSQL,
      [
        "-h",
        PGHOST,
        "-p",
        PGPORT,
        "-U",
        PGUSER,
        "-d",
        PGDATABASE,
        "-v",
        "ON_ERROR_STOP=1",
        "-c",
        [
          "ALTER TABLE public.profiles FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.organisations FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.organisation_memberships FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.role_assignments FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.user_workspace_preferences FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.identity_suspensions FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.emergency_access_grants FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.emergency_access_uses FORCE ROW LEVEL SECURITY;",
        ].join(" "),
      ],
      { encoding: "utf8" }
    );

    const sqlFile = path.join(
      process.cwd(),
      "tests/integration/sql/phase4_rls_identity.sql"
    );
    const out = execFileSync(
      PSQL,
      [
        "-h",
        PGHOST,
        "-p",
        PGPORT,
        "-U",
        PGUSER,
        "-d",
        PGDATABASE,
        "-v",
        "ON_ERROR_STOP=1",
        "-f",
        sqlFile,
      ],
      { encoding: "utf8" }
    );
    expect(out).toContain("PHASE4_RLS_OK");
  });
});
