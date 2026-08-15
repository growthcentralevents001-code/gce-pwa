#!/usr/bin/env node
/**
 * npm run e2e:fixtures:setup
 */
import { resolve } from "node:path";
import {
  FIXTURE_IDENTITIES,
  FIXTURE_FAMILY,
  GCE_DEV_PROJECT_REF,
  fixtureEmail,
} from "./constants.mjs";
import { createFixtureAdminClient } from "./client.mjs";
import {
  ensureFixturePassword,
  loadFixtureEnv,
  writeEnvTestEmails,
} from "./env.mjs";
import {
  upsertDomainFixtures,
  upsertFixtureUser,
  upsertRoleAssignments,
} from "./seed.mjs";
import { upsertLifecycleFixtures } from "./lifecycle.mjs";
import { mkdirSync, writeFileSync } from "node:fs";
import { resolve as resolvePath } from "node:path";

async function main() {
  const repoRoot = resolve(process.cwd());
  loadFixtureEnv(repoRoot);
  const password = ensureFixturePassword(repoRoot);
  const admin = createFixtureAdminClient();

  console.log(`Phase 14B-F fixture setup → gce-dev (${GCE_DEV_PROJECT_REF})`);
  console.log("Passwords are written only to .env.test.local (gitignored).");

  const userIds = {};
  const emailMap = {};

  for (const identity of FIXTURE_IDENTITIES) {
    const id = await upsertFixtureUser(admin, identity, password);
    userIds[identity.key] = id;
    emailMap[identity.envEmailKey] = fixtureEmail(identity);
    console.log(`  ✓ user ${identity.key} → ${fixtureEmail(identity)}`);
  }

  const scopeIds = await upsertDomainFixtures(admin, userIds);
  console.log("  ✓ domain fixtures (org/venue/circle/event/offer)");

  const lifecycle = await upsertLifecycleFixtures(admin, userIds, scopeIds);
  console.log("  ✓ lifecycle fixtures (marketplace events/offers + enterprise)");

  const assignments = await upsertRoleAssignments(admin, userIds, scopeIds);
  console.log(`  ✓ role_assignments: ${assignments.length}`);

  writeEnvTestEmails(repoRoot, emailMap);

  const { data: sa, error } = await admin.select("role_assignments", {
    filters: [
      `metadata=cs.${encodeURIComponent(
        JSON.stringify({ fixture_family: FIXTURE_FAMILY })
      )}`,
    ],
    select: "id,role_key",
  });
  if (error) throw error;
  const bad = (sa || []).filter((r) =>
    String(r.role_key).toLowerCase().includes("super")
  );
  if (bad.length) {
    throw new Error("REFUSED: Super Admin fixture detected — aborting");
  }

  console.log("\nSAFE SUMMARY (no passwords):");
  for (const a of assignments) {
    console.log(
      `  ${a.fixture} | ${a.email} | ${a.role} | scope=${a.scopeType}:${a.scopeId ?? "-"}`
    );
  }
  const allIds = { ...scopeIds, ...lifecycle, users: userIds };
  const authDir = resolvePath(repoRoot, ".playwright");
  mkdirSync(authDir, { recursive: true });
  writeFileSync(
    resolvePath(authDir, "fixture-ids.json"),
    JSON.stringify(allIds, null, 2) + "\n"
  );

  console.log("\nDomain IDs:");
  for (const [k, v] of Object.entries(allIds)) {
    if (typeof v === "string") console.log(`  ${k}: ${v}`);
  }
  console.log("\nNext: npm run e2e:fixtures:validate");
}

main().catch((err) => {
  console.error("Fixture setup FAILED:", err.message || err);
  process.exit(1);
});
