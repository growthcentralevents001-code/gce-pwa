import type { SupabaseClient } from "@supabase/supabase-js";
import {
  getNotificationPreferences,
  listInAppNotifications,
} from "@/lib/architecture/ops-governance";
import { channelLiveStatus } from "@/lib/frontend/settings/format";

export async function loadSettingsNotificationBundle(
  client: SupabaseClient,
  userId: string
) {
  const [prefs, items] = await Promise.all([
    getNotificationPreferences(client, userId).catch(() => null),
    listInAppNotifications(client, userId, { unreadOnly: false }).catch(
      () => []
    ),
  ]);
  const unread = (items ?? []).filter((i) => !i.read_at).length;
  return {
    prefs,
    items: items ?? [],
    unread,
    channels: channelLiveStatus(),
  };
}

export async function loadOwnPrivacyRequests(
  client: SupabaseClient,
  userId: string,
  limit = 20
) {
  try {
    const { data } = await client
      .from("privacy_requests")
      .select(
        "id, request_type, status, created_at, updated_at, completed_at, review_notes"
      )
      .eq("requester_user_id", userId)
      .order("created_at", { ascending: false })
      .limit(limit);
    return data ?? [];
  } catch {
    return [];
  }
}
