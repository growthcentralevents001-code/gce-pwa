import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import {
  getNotificationPreferences,
  listInAppNotifications,
} from "@/lib/architecture/ops-governance";
import { PrefsForm } from "./prefs-form";
import { MarkReadButton } from "./mark-read-button";

export default async function OpsNotificationsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const [items, prefs] = await Promise.all([
    listInAppNotifications(supabase, user.id),
    getNotificationPreferences(supabase, user.id),
  ]);
  const unread = items.filter((i) => !i.read_at).length;

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Notifications
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Notification center</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Unread {unread} · live email/SMS/push providers remain OFF
      </p>

      <section className="mt-6 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-medium">Inbox</h2>
          <MarkReadButton />
        </div>
        {items.length === 0 ? (
          <p className="text-sm text-neutral-600">No notifications yet.</p>
        ) : (
          <ul className="space-y-2">
            {items.map((n) => (
              <li
                key={n.id}
                className="rounded border border-neutral-200 p-3 text-sm"
              >
                <div className="flex justify-between gap-3">
                  <strong>{n.title}</strong>
                  <span className="text-xs text-neutral-500">
                    {n.read_at ? "read" : "unread"}
                  </span>
                </div>
                <p className="mt-1 text-neutral-700">{n.body}</p>
                {n.deep_link ? (
                  <p className="mt-1">
                    <Link href={n.deep_link} className="underline">
                      Open
                    </Link>
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="text-sm font-medium">Preferences</h2>
        <p className="mt-1 text-xs text-neutral-500">
          Security / transactional notices are not treated as marketing opt-outs.
        </p>
        <PrefsForm
          initial={{
            inAppEnabled: prefs.in_app_enabled,
            emailEnabled: prefs.email_enabled,
            smsEnabled: prefs.sms_enabled,
            pushEnabled: prefs.push_enabled,
            marketingOptIn: prefs.marketing_opt_in,
          }}
        />
      </section>
    </main>
  );
}
