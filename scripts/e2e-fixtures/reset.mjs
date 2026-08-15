#!/usr/bin/env node
/**
 * npm run e2e:fixtures:reset
 */
import { resolve } from "node:path";
import {
  FIXTURE_FAMILY,
  FIXTURE_IDENTITIES,
  fixtureEmail,
} from "./constants.mjs";
import { createFixtureAdminClient } from "./client.mjs";
import { loadFixtureEnv, fixtureUuid } from "./env.mjs";
import { findAuthUserByEmail } from "./seed.mjs";

async function main() {
  const repoRoot = resolve(process.cwd());
  loadFixtureEnv(repoRoot);
  const admin = createFixtureAdminClient();

  console.log(`Phase 14B-F fixture RESET → family=${FIXTURE_FAMILY}`);

  const { error: raErr, count } = await admin.delete("role_assignments", [
    `metadata=cs.${encodeURIComponent(
      JSON.stringify({ fixture_family: FIXTURE_FAMILY })
    )}`,
  ]);
  if (raErr) throw raErr;
  console.log(`  deleted role_assignments: ${count ?? "?"}`);

  const domainIds = {
    event: fixtureUuid("event:01"),
    offer: fixtureUuid("offer:01"),
    membership: fixtureUuid("membership:01"),
    membershipMulti: fixtureUuid("membership:multi"),
    circle: fixtureUuid("circle:01"),
    venue: fixtureUuid("venue:01"),
    project: fixtureUuid("project:01"),
    venueOrg: fixtureUuid("org:venue"),
    enterpriseOrg: fixtureUuid("org:enterprise"),
  };

  await admin.delete("events", [`id=eq.${domainIds.event}`]);
  await admin.delete("offers", [`id=eq.${domainIds.offer}`]);
  await admin.delete("connect_memberships", [`id=eq.${domainIds.membership}`]);
  await admin.delete("connect_memberships", [
    `id=eq.${domainIds.membershipMulti}`,
  ]);
  await admin.delete("connect_circles", [`id=eq.${domainIds.circle}`]);
  await admin.delete("venues", [`id=eq.${domainIds.venue}`]);
  await admin.delete("enterprise_projects", [`id=eq.${domainIds.project}`]);
  await admin.delete("organisations", [`id=eq.${domainIds.venueOrg}`]);
  await admin.delete("organisations", [`id=eq.${domainIds.enterpriseOrg}`]);
  console.log("  deleted domain fixture rows (best-effort)");

  for (const identity of FIXTURE_IDENTITIES) {
    const email = fixtureEmail(identity);
    const user = await findAuthUserByEmail(admin, email);
    if (!user) continue;
    await admin.delete("profiles", [`user_id=eq.${user.id}`]);
    await admin.delete("users", [`id=eq.${user.id}`]);
    const del = await admin.auth.admin.deleteUser(user.id);
    if (del.error) {
      console.warn(`  warn delete auth ${email}:`, del.error.message);
    } else {
      console.log(`  deleted auth user ${email}`);
    }
  }

  console.log("Reset complete (fixture-scoped only).");
}

main().catch((err) => {
  console.error("Fixture reset FAILED:", err.message || err);
  process.exit(1);
});
