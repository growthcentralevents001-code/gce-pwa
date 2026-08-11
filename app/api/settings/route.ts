import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import {
  createPrivacyRequest,
  getNotificationPreferences,
  listInAppNotifications,
  markInAppRead,
  upsertNotificationPreferences,
} from "@/lib/architecture/ops-governance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { AppError } from "@/lib/errors";
import { z } from "zod";
import { channelLiveStatus } from "@/lib/frontend/settings/format";

/**
 * Customer/settings path for own notification prefs, inbox, and privacy requests.
 * Closes BG-07 without requiring Ops shell access.
 */
export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const view = url.searchParams.get("view") ?? "preferences";
  const admin = createPrivilegedSupabaseClient();

  if (view === "channels") {
    return jsonSuccess({ channels: channelLiveStatus() }, ctx);
  }

  if (view === "preferences") {
    const prefs = await getNotificationPreferences(admin, ctx.user.id);
    return jsonSuccess({ prefs, channels: channelLiveStatus() }, ctx);
  }

  if (view === "inbox") {
    const unreadOnly = url.searchParams.get("unread") === "1";
    const items = await listInAppNotifications(admin, ctx.user.id, {
      unreadOnly,
    });
    return jsonSuccess(
      {
        items,
        unread: items.filter((i) => !i.read_at).length,
        channels: channelLiveStatus(),
      },
      ctx
    );
  }

  if (view === "privacy_requests") {
    const { data } = await admin
      .from("privacy_requests")
      .select(
        "id, request_type, status, created_at, updated_at, completed_at"
      )
      .eq("requester_user_id", ctx.user.id)
      .order("created_at", { ascending: false })
      .limit(30);
    return jsonSuccess({ items: data ?? [] }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown view: ${view}`, {
    status: 400,
  });
});

export const POST = withAuthedRoute(async (request, ctx) => {
  const body = await request.json();
  const action = String(body.action ?? "");
  const admin = createPrivilegedSupabaseClient();

  if (action === "update_preferences") {
    const schema = z.object({
      inAppEnabled: z.boolean().optional(),
      emailEnabled: z.boolean().optional(),
      smsEnabled: z.boolean().optional(),
      pushEnabled: z.boolean().optional(),
      marketingOptIn: z.boolean().optional(),
    });
    const parsed = schema.parse(body);
    const prefs = await upsertNotificationPreferences(
      admin,
      ctx.user.id,
      parsed
    );
    return jsonSuccess(
      { prefs, channels: channelLiveStatus(), hint: "Preferences saved." },
      ctx
    );
  }

  if (action === "mark_read") {
    await markInAppRead(admin, ctx.user.id, body.notificationId);
    return jsonSuccess({ ok: true }, ctx);
  }

  if (action === "create_privacy_request") {
    const requestType = z
      .enum(["access", "correction", "erasure", "restricted_processing"])
      .parse(body.requestType);
    const row = await createPrivacyRequest(admin, {
      requesterUserId: ctx.user.id,
      requestType,
      details: body.details,
    });
    return jsonSuccess({ request: row }, ctx);
  }

  throw new AppError("VALIDATION_ERROR", `Unknown action: ${action}`, {
    status: 400,
  });
});
