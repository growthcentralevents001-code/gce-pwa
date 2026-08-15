#!/usr/bin/env node
/**
 * npm run e2e:fixtures:validate
 */
import { resolve } from "node:path";
import {
  FIXTURE_FAMILY,
  FIXTURE_IDENTITIES,
  fixtureEmail,
} from "./constants.mjs";
import { createFixtureAdminClient } from "./client.mjs";
import { loadFixtureEnv } from "./env.mjs";
import { findAuthUserByEmail } from "./seed.mjs";

async function main() {
  const repoRoot = resolve(process.cwd());
  loadFixtureEnv(repoRoot);
  const admin = createFixtureAdminClient();

  const failures = [];
  const { data: assignments, error } = await admin.select("role_assignments", {
    filters: [
      `metadata=cs.${encodeURIComponent(
        JSON.stringify({ fixture_family: FIXTURE_FAMILY })
      )}`,
    ],
  });
  if (error) throw error;

  if ((assignments || []).some((a) => String(a.role_key).includes("super"))) {
    failures.push("Super Admin assignment present in fixtures");
  }

  for (const identity of FIXTURE_IDENTITIES) {
    const email = fixtureEmail(identity);
    const user = await findAuthUserByEmail(admin, email);
    if (!user) {
      failures.push(`missing auth user ${email}`);
      continue;
    }
    const { data: pubs } = await admin.select("users", {
      filters: [`id=eq.${user.id}`],
      select: "id",
      limit: 1,
    });
    if (!pubs?.length) failures.push(`missing public.users for ${email}`);

    const mine = (assignments || []).filter((a) => a.user_id === user.id);
    const expectedKeys = identity.roles.map((r) => r.roleKey).sort();
    const gotKeys = mine.map((a) => a.role_key).sort();
    if (JSON.stringify(expectedKeys) !== JSON.stringify(gotKeys)) {
      failures.push(
        `${identity.key} roles expected ${expectedKeys.join(",")} got ${gotKeys.join(",")}`
      );
    }
    if (mine.some((a) => a.status !== "active")) {
      failures.push(`${identity.key} has non-active assignments`);
    }

    console.log(
      `  ✓ ${identity.key} roles=[${gotKeys.join(", ")}] user=${user.id.slice(0, 8)}…`
    );
  }

  if (failures.length) {
    console.error("\nVALIDATION FAILED:");
    for (const f of failures) console.error(" -", f);
    process.exit(1);
  }

  console.log(
    `\nVALIDATION OK — ${FIXTURE_IDENTITIES.length} identities, ${(assignments || []).length} assignments`
  );
}

main().catch((err) => {
  console.error("Fixture validate FAILED:", err.message || err);
  process.exit(1);
});
