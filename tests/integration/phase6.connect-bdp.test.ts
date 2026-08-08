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

describeDb("Phase 6 Connect BDP concurrency (local Postgres)", () => {
  it("enforces city caps, recovery limits, and one-time target credit", () => {
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
          "supabase/migrations/20260808170000_phase6_connect_bdp.sql"
        ),
      ],
      { encoding: "utf8", stdio: "pipe" }
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
        path.join(
          process.cwd(),
          "tests/integration/sql/phase6_connect_bdp_concurrency.sql"
        ),
      ],
      { encoding: "utf8" }
    );
    expect(out).toContain("PHASE6_CONNECT_BDP_OK");
  });
});
