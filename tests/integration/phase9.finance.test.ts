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

describeDb("Phase 9 Finance concurrency (local Postgres)", () => {
  it("enforces revenue/entitlement/settlement/ledger invariants", () => {
    try {
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
          path.join(
            process.cwd(),
            "supabase/migrations/20260808200000_phase9_finance_revenue_commission_settlement.sql"
          ),
        ],
        { encoding: "utf8", stdio: "pipe", env: process.env }
      );
    } catch {
      // may already be applied
    }

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
        path.join(
          process.cwd(),
          "tests/integration/sql/phase9_finance_concurrency.sql"
        ),
      ],
      { encoding: "utf8", env: process.env }
    );
    expect(out).toContain("PHASE9_FINANCE_OK");
  });
});
