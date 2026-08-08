import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { logStructured } from "../logging";
import type { FeatureFlagKey } from "../types";
import {
  FEATURE_FLAG_KEYS,
  INACTIVE_FEATURE_FLAGS,
  LEAD_ASSIST_STAGE1_FLAGS,
  CUSTOMER_CX_FLAGS,
  OPS_GOVERNANCE_FLAGS,
  OPS_ADMIN_FLAGS,
} from "../types";

const DEFAULT_FLAGS: Record<FeatureFlagKey, boolean> = {
  ...(Object.fromEntries(INACTIVE_FEATURE_FLAGS.map((k) => [k, false])) as Record<
    (typeof INACTIVE_FEATURE_FLAGS)[number],
    boolean
  >),
  ...(Object.fromEntries(LEAD_ASSIST_STAGE1_FLAGS.map((k) => [k, true])) as Record<
    (typeof LEAD_ASSIST_STAGE1_FLAGS)[number],
    boolean
  >),
  ...(Object.fromEntries(
    CUSTOMER_CX_FLAGS.map((k) => [
      k,
      k === "venue_rank_display" || k === "refund_processing" ? false : true,
    ])
  ) as Record<(typeof CUSTOMER_CX_FLAGS)[number], boolean>),
  ...(Object.fromEntries(
    OPS_GOVERNANCE_FLAGS.map((k) => [
      k,
      k === "notifications_email_live" ||
      k === "notifications_sms_live" ||
      k === "notifications_push_live" ||
      k === "marketing_notifications" ||
      k === "retention_enforcement"
        ? false
        : true,
    ])
  ) as Record<(typeof OPS_GOVERNANCE_FLAGS)[number], boolean>),
  ...(Object.fromEntries(OPS_ADMIN_FLAGS.map((k) => [k, true])) as Record<
    (typeof OPS_ADMIN_FLAGS)[number],
    boolean
  >),
};

export function isKnownFeatureFlag(key: string): key is FeatureFlagKey {
  return (FEATURE_FLAG_KEYS as readonly string[]).includes(key);
}

/** In-memory defaults when DB is unavailable — always fail closed for money/inactive flags. */
export function getDefaultFlag(key: FeatureFlagKey): boolean {
  return DEFAULT_FLAGS[key] ?? false;
}

export async function isFeatureEnabled(
  client: SupabaseClient | null,
  key: FeatureFlagKey
): Promise<boolean> {
  if (!client) return getDefaultFlag(key);
  const { data, error } = await client
    .from("feature_flags")
    .select("enabled")
    .eq("key", key)
    .maybeSingle();

  if (error) {
    logStructured({
      level: "warn",
      message: "feature_flag_lookup_failed",
      code: "FEATURE_FLAG_LOOKUP",
      meta: { key, error: error.message },
    });
    return getDefaultFlag(key);
  }
  if (!data) return getDefaultFlag(key);
  return Boolean(data.enabled);
}

export async function assertFeatureEnabled(
  client: SupabaseClient | null,
  key: FeatureFlagKey
): Promise<void> {
  const enabled = await isFeatureEnabled(client, key);
  if (!enabled) {
    throw new AppError("FEATURE_DISABLED", `Feature is disabled: ${key}`, {
      status: 403,
      details: { key },
    });
  }
}
