import { redirect } from "next/navigation";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { NotificationInbox } from "@/components/settings/NotificationInbox";
import { NotificationPrefsForm } from "@/components/settings/NotificationPrefsForm";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadSettingsNotificationBundle } from "@/lib/frontend/settings/reads";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Notifications · Settings · GCE",
};

/** SET-04 — inbox + preferences (non-ops path; BG-07). */
export default async function SettingsNotificationsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/notifications");

  // Privileged read for prefs upsert defaults / inbox (own user only via service helpers).
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadSettingsNotificationBundle(admin, user.id);
  const prefs = bundle.prefs;

  return (
    <SettingsShell
      title="Notifications"
      description={`${SETTINGS_COPY.marketingSeparate} ${SETTINGS_COPY.channelPrefVsLive}`}
    >
      <NotificationInbox items={bundle.items} unread={bundle.unread} />
      <NotificationPrefsForm
        channels={bundle.channels}
        initial={{
          inAppEnabled: prefs?.in_app_enabled ?? true,
          emailEnabled: prefs?.email_enabled ?? true,
          smsEnabled: prefs?.sms_enabled ?? false,
          pushEnabled: prefs?.push_enabled ?? false,
          marketingOptIn: prefs?.marketing_opt_in ?? false,
        }}
      />
    </SettingsShell>
  );
}
