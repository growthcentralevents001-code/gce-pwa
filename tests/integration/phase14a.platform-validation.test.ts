import { describe, expect, it } from "vitest";
import { execFileSync } from "node:child_process";
import path from "node:path";
import {
  calculateConnectBdpCommission,
  calculateMarketplaceSplit,
  calculateEnterpriseEntitlement,
  MONEY_FLAGS_MUST_STAY_OFF,
} from "@/lib/architecture/finance/constants";
import { assertOpsNotSelfApproval } from "@/lib/architecture/ops-admin/permissions";
import { AppError } from "@/lib/architecture/errors";
import { FEATURE_FLAG_KEYS, INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

const PGHOST = process.env.PHASE14A_PGHOST || "/var/run/gce-phase14a-pg";
const PGPORT = process.env.PHASE14A_PGPORT || "55433";
const PGUSER = process.env.PHASE14A_PGUSER || "postgres";
const PGDATABASE = process.env.PHASE14A_PGDATABASE || "gce_phase14a_rebuild";
const PSQL = process.env.PHASE14A_PSQL || "/usr/lib/postgresql/18/bin/psql";

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

describe("Phase 14A unit invariants", () => {
  it("keeps money execution flags in the hard-off set", () => {
    for (const k of MONEY_FLAGS_MUST_STAY_OFF) {
      expect(INACTIVE_FEATURE_FLAGS as readonly string[]).toContain(k);
    }
    // Additional production-risk gates (Phase 10–12) tracked outside MONEY_FLAGS set
    for (const k of [
      "refund_processing",
      "paid_lead_assist",
      "marketing_notifications",
      "retention_enforcement",
      "notifications_email_live",
    ] as const) {
      expect(FEATURE_FLAG_KEYS as readonly string[]).toContain(k);
    }
  });

  it("registers Phase 2–13 feature flag keys", () => {
    expect(FEATURE_FLAG_KEYS).toContain("ops_case_management");
    expect(FEATURE_FLAG_KEYS).toContain("notifications_in_app");
    expect(FEATURE_FLAG_KEYS).toContain("lead_assist_stage1");
    expect(FEATURE_FLAG_KEYS).toContain("retention_enforcement");
  });

  it("encodes Founder finance splits", () => {
    expect(
      calculateConnectBdpCommission({
        eligibleAttributedSubscriptionMinor: 600_000,
        hasValidAttribution: true,
      }).grossEntitlementMinor
    ).toBe(120_000);
    expect(
      calculateMarketplaceSplit({
        eligibleEventRevenueMinor: 1_000_000,
        hasValidMbdpAttribution: true,
      })
    ).toMatchObject({
      venueShareMinor: 800_000,
      mbdpShareMinor: 100_000,
      gceShareMinor: 100_000,
    });
    expect(
      calculateMarketplaceSplit({
        eligibleEventRevenueMinor: 1_000_000,
        hasValidMbdpAttribution: false,
      })
    ).toMatchObject({
      venueShareMinor: 800_000,
      mbdpShareMinor: 0,
      gceShareMinor: 200_000,
    });
    expect(
      calculateEnterpriseEntitlement({
        eligibleEventRevenueMinor: 2_000_000,
        hasValidAttribution: true,
      }).ebdpEntitlementMinor
    ).toBe(100_000);
  });

  it("denies ops self-approval", () => {
    expect(() => assertOpsNotSelfApproval("u1", "u1")).toThrow(AppError);
    expect(() => assertOpsNotSelfApproval("u1", "u2")).not.toThrow();
  });
});

describeDb("Phase 14A SQL platform validation (clean rebuild)", () => {
  it("passes platform validation harness", () => {
    const sqlFile = path.join(
      process.cwd(),
      "tests/integration/sql/phase14a_platform_validation.sql"
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
    expect(out).toContain("PHASE14A_PLATFORM_VALIDATION_OK");
  });

  it("passes Phase 5 connect concurrency harness", () => {
    const sqlFile = path.join(
      process.cwd(),
      "tests/integration/sql/phase5_connect_concurrency.sql"
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
    expect(out).toContain("PHASE5_CONNECT_OK");
  });

  it("passes Phase 4 RLS identity harness", () => {
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

  it("passes Phase 13 ops admin SQL harness", () => {
    const sqlFile = path.join(
      process.cwd(),
      "tests/integration/sql/phase13_ops_admin.sql"
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
    expect(out).toContain("PHASE13_OPS_ADMIN_OK");
  });
});
