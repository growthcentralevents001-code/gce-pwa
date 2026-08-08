import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export type ProfileRecord = {
  userId: string;
  displayName: string | null;
  legalName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  locale: string | null;
  timezone: string | null;
  metadata: Record<string, unknown>;
};

function mapProfile(row: Record<string, unknown>): ProfileRecord {
  return {
    userId: String(row.user_id),
    displayName: (row.display_name as string | null) ?? null,
    legalName: (row.legal_name as string | null) ?? null,
    phone: (row.phone as string | null) ?? null,
    avatarUrl: (row.avatar_url as string | null) ?? null,
    locale: (row.locale as string | null) ?? null,
    timezone: (row.timezone as string | null) ?? null,
    metadata: (row.metadata as Record<string, unknown>) ?? {},
  };
}

export async function getProfile(
  client: SupabaseClient,
  userId: string
): Promise<ProfileRecord | null> {
  const { data, error } = await client
    .from("profiles")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load profile", { cause: error });
  }
  return data ? mapProfile(data as Record<string, unknown>) : null;
}

/**
 * Ensure a profile row exists for the permanent User identity.
 * Profile never stores commercial role entitlement (FD-035).
 */
export async function ensureProfile(
  client: SupabaseClient,
  input: {
    userId: string;
    displayName?: string | null;
    correlationId?: string;
  }
): Promise<ProfileRecord> {
  const existing = await getProfile(client, input.userId);
  if (existing) return existing;

  const { data, error } = await client
    .from("profiles")
    .upsert(
      {
        user_id: input.userId,
        display_name: input.displayName ?? null,
      },
      { onConflict: "user_id" }
    )
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create profile", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.userId,
    action: "profile.ensure",
    resourceType: "profile",
    resourceId: input.userId,
    after: data,
    correlationId: input.correlationId,
  });

  return mapProfile(data as Record<string, unknown>);
}

export async function updateOwnProfile(
  client: SupabaseClient,
  input: {
    userId: string;
    displayName?: string | null;
    phone?: string | null;
    avatarUrl?: string | null;
    locale?: string | null;
    timezone?: string | null;
    correlationId?: string;
  }
): Promise<ProfileRecord> {
  const patch: Record<string, unknown> = {};
  if (input.displayName !== undefined) patch.display_name = input.displayName;
  if (input.phone !== undefined) patch.phone = input.phone;
  if (input.avatarUrl !== undefined) patch.avatar_url = input.avatarUrl;
  if (input.locale !== undefined) patch.locale = input.locale;
  if (input.timezone !== undefined) patch.timezone = input.timezone;

  const { data, error } = await client
    .from("profiles")
    .update(patch)
    .eq("user_id", input.userId)
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to update profile", { cause: error });
  }

  await writeAuditEvent(client, {
    actorUserId: input.userId,
    action: "profile.update",
    resourceType: "profile",
    resourceId: input.userId,
    after: data,
    correlationId: input.correlationId,
  });

  return mapProfile(data as Record<string, unknown>);
}
