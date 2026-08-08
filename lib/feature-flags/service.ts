import type { SupabaseClient } from "@supabase/supabase-js";
import {
  assertFeatureEnabled,
  getDefaultFlag,
  isFeatureEnabled,
  isKnownFeatureFlag,
} from "@/lib/architecture/feature-flags/flags";
import type { FeatureFlagKey } from "@/lib/architecture/types";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { logger } from "@/lib/logging";

export type { FeatureFlagKey };
export { INACTIVE_FEATURE_FLAGS, isKnownFeatureFlag, getDefaultFlag };

/**
 * Application feature-flag service (Phase 3).
 * Defaults OFF for inactive/money flags. Clients cannot enable flags.
 */
export async function getFlag(
  client: SupabaseClient | null,
  key: string
): Promise<{ key: string; enabled: boolean; known: boolean }> {
  if (!isKnownFeatureFlag(key)) {
    logger.warn("unknown_feature_flag", { code: "FEATURE_FLAG_UNKNOWN", meta: { key } });
    return { key, enabled: false, known: false };
  }
  const enabled = await isFeatureEnabled(client, key);
  return { key, enabled, known: true };
}

export async function isEnabled(
  client: SupabaseClient | null,
  key: FeatureFlagKey
): Promise<boolean> {
  return isFeatureEnabled(client, key);
}

export async function requireEnabled(
  client: SupabaseClient | null,
  key: FeatureFlagKey
): Promise<void> {
  await assertFeatureEnabled(client, key);
}

/** Known inactive/money flag keys — values resolved via DB/defaults. */
export function listKnownInactiveFlags(): readonly FeatureFlagKey[] {
  return INACTIVE_FEATURE_FLAGS;
}
