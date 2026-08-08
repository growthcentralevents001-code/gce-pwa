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

describeDb("Phase 2 foundation RLS (local Postgres)", () => {
  it("enforces deny-by-default isolation for foundation tables", () => {
    // FORCE RLS so table owner path still respects policies when SET ROLE authenticated
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
          "ALTER TABLE public.feature_flags FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.audit_events FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.payment_intents FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.payment_webhook_events FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.ledger_accounts FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.ledger_entries FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.financial_transactions FORCE ROW LEVEL SECURITY;",
          "ALTER TABLE public.background_jobs FORCE ROW LEVEL SECURITY;",
        ].join(" "),
      ],
      { encoding: "utf8" }
    );

    const sqlFile = path.join(
      process.cwd(),
      "tests/integration/sql/phase2_rls_foundation.sql"
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
    expect(out).toContain("PHASE2_RLS_OK");
  });
});
