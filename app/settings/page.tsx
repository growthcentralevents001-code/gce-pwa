import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { StatusBadge } from "@/components/states/StatusBadge";
import { SignOutButton } from "@/components/settings/PasswordUpdateForm";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadSettingsNotificationBundle } from "@/lib/frontend/settings/reads";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Settings · GCE",
};

/** Settings overview — identity-level home (not a mega-admin). */
export default async function SettingsOverviewPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    displayName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  });
  const notif = await loadSettingsNotificationBundle(supabase, user.id);
  const accountStatus = identity.identitySuspension ? "suspended" : "active";
  const suspendedRoles = identity.entitlements.assignments.filter(
    (a) => a.status === "suspended"
  ).length;

  return (
    <SettingsShell
      title="Settings"
      description={SETTINGS_COPY.oneAccount}
      breadcrumbs={[{ label: "Settings" }]}
      primaryAction={<SignOutButton />}
    >
      <div
        className={cn(
          GCE_RADIUS.card,
          GCE_SURFACE.glassLight,
          "px-4 py-4 text-sm"
        )}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="font-medium text-foreground">
              {identity.profile?.displayName || user.email || "Account"}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>
          <StatusBadge
            label={accountStatus}
            tone={accountStatus === "active" ? "success" : "error"}
          />
        </div>
        <p className="mt-3 text-xs text-muted-foreground">
          {SETTINGS_COPY.roleVsAccount}
          {suspendedRoles > 0
            ? ` ${suspendedRoles} assignment(s) may be suspended while your account remains active.`
            : ""}
        </p>
      </div>

      <PartnerActionCenter
        title="Settings areas"
        items={[
          {
            id: "profile",
            title: "Profile",
            href: "/settings/profile",
            description: "Personal display name and phone",
          },
          {
            id: "workspaces",
            title: "Workspaces & roles",
            href: "/settings/workspaces",
            description: `${identity.workspaces.length} workspace(s) · read-only assignment status`,
          },
          {
            id: "notifications",
            title: "Notifications",
            href: "/settings/notifications",
            description: `${notif.unread} unread in-app`,
          },
          {
            id: "privacy",
            title: "Privacy",
            href: "/settings/privacy",
            description: "Requests and contact privacy notes",
          },
          {
            id: "security",
            title: "Security",
            href: "/settings/security",
            description: "Password and sign-out",
          },
          {
            id: "org",
            title: "Organisation links",
            href: "/settings/organisation",
            description: "Business profiles live in workspaces",
          },
        ]}
      />

      <SettingsSection title="Channel delivery status">
        <ul className="space-y-2 text-sm text-muted-foreground">
          <li>In-app: available when the inbox pipeline is enabled</li>
          <li>
            Email live: {notif.channels.emailLive ? "on" : "off"} · SMS live:{" "}
            {notif.channels.smsLive ? "on" : "off"} · Push live:{" "}
            {notif.channels.pushLive ? "on" : "off"}
          </li>
          <li>
            Marketing automation:{" "}
            {notif.channels.marketingLive ? "on" : "off"}
          </li>
        </ul>
        <p className="mt-3 text-xs text-muted-foreground">
          {SETTINGS_COPY.channelPrefVsLive}
        </p>
        <p className="mt-2 text-xs">
          <Link
            href="/forgot-password"
            className="text-primary underline-offset-4 hover:underline"
          >
            Password reset link
          </Link>
        </p>
      </SettingsSection>
    </SettingsShell>
  );
}
