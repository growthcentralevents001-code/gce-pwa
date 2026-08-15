import { createHash, randomBytes } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  GCE_DEV_PROJECT_REF,
  GCE_PROD_PROJECT_REF,
} from "./constants.mjs";

/**
 * Load KEY=VALUE pairs from a dotenv-style file into process.env (no overwrite).
 */
export function loadEnvFile(path) {
  if (!existsSync(path)) return;
  const text = readFileSync(path, "utf8");
  for (const line of text.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq <= 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (process.env[key] === undefined) process.env[key] = value;
  }
}

export function loadFixtureEnv(repoRoot = process.cwd()) {
  loadEnvFile(resolve(repoRoot, ".env.local"));
  loadEnvFile(resolve(repoRoot, ".env.test.local"));
}

export function requireDevSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceKey) {
    throw new Error(
      "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY (load .env.local)."
    );
  }

  let host;
  try {
    host = new URL(url).hostname;
  } catch {
    throw new Error(`Invalid NEXT_PUBLIC_SUPABASE_URL: ${url}`);
  }

  if (host.includes(GCE_PROD_PROJECT_REF)) {
    throw new Error(
      `REFUSED: production Supabase project detected (${GCE_PROD_PROJECT_REF}).`
    );
  }
  if (!host.includes(GCE_DEV_PROJECT_REF)) {
    throw new Error(
      `REFUSED: expected gce-dev project ref ${GCE_DEV_PROJECT_REF}, got host ${host}.`
    );
  }
  if (process.env.GCE_ALLOW_E2E_FIXTURES === "false") {
    throw new Error("REFUSED: GCE_ALLOW_E2E_FIXTURES=false");
  }
  if (
    process.env.NODE_ENV === "production" &&
    process.env.GCE_ALLOW_E2E_FIXTURES !== "true"
  ) {
    throw new Error(
      "REFUSED: NODE_ENV=production without GCE_ALLOW_E2E_FIXTURES=true"
    );
  }

  return { url, serviceKey, projectRef: GCE_DEV_PROJECT_REF };
}

/**
 * Shared fixture password — never logged. Persists to .env.test.local if missing.
 */
export function ensureFixturePassword(repoRoot = process.cwd()) {
  let password = process.env.E2E_FIXTURE_PASSWORD || "";
  if (!password) {
    password = `E2E_${randomBytes(18).toString("base64url")}_x9`;
    process.env.E2E_FIXTURE_PASSWORD = password;
  }

  const testEnvPath = resolve(repoRoot, ".env.test.local");
  let existing = existsSync(testEnvPath) ? readFileSync(testEnvPath, "utf8") : "";
  const lines = existing.split("\n").filter((l) => !l.startsWith("E2E_FIXTURE_PASSWORD="));
  if (!existing.includes("E2E_FIXTURE_PASSWORD=")) {
    lines.push(`E2E_FIXTURE_PASSWORD=${password}`);
  } else {
    // keep generated/current in memory; refresh file line
    lines.push(`E2E_FIXTURE_PASSWORD=${password}`);
  }
  // Always refresh password line from process.env
  const filtered = existing
    .split("\n")
    .filter((l) => l.trim() && !l.startsWith("E2E_FIXTURE_PASSWORD="));
  filtered.push(`E2E_FIXTURE_PASSWORD=${password}`);
  writeFileSync(testEnvPath, filtered.join("\n") + "\n", { mode: 0o600 });

  return password;
}

/** Deterministic UUID from fixture key (stable across runs). */
export function fixtureUuid(key) {
  const hash = createHash("sha256").update(`gce:phase14b:${key}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function writeEnvTestEmails(repoRoot, identityEmails) {
  const testEnvPath = resolve(repoRoot, ".env.test.local");
  const password = process.env.E2E_FIXTURE_PASSWORD;
  const keep = existsSync(testEnvPath)
    ? readFileSync(testEnvPath, "utf8")
        .split("\n")
        .filter(
          (l) =>
            l.trim() &&
            !l.startsWith("E2E_") &&
            !l.startsWith("# Phase 14B")
        )
    : [];
  const out = [
    "# Phase 14B-F development E2E fixtures — DO NOT COMMIT",
    `E2E_FIXTURE_PASSWORD=${password}`,
    "E2E_FIXTURE_PASSWORD_NOTE=shared synthetic password for all phase14b fixtures",
  ];
  for (const [envKey, email] of Object.entries(identityEmails)) {
    out.push(`${envKey}=${email}`);
    // Convenience aliases used by Playwright matrix
    if (envKey.endsWith("_EMAIL")) {
      const passKey = envKey.replace(/_EMAIL$/, "_PASSWORD");
      out.push(`${passKey}=${password}`);
    }
  }
  writeFileSync(testEnvPath, [...keep, ...out].join("\n") + "\n", {
    mode: 0o600,
  });
}
