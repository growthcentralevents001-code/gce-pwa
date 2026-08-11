import { redirect } from "next/navigation";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { ProfileSettingsForm } from "@/components/settings/ProfileSettingsForm";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Profile · Settings · GCE",
};

/** SET-01 */
export default async function SettingsProfilePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/profile");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    displayName:
      typeof user.user_metadata?.full_name === "string"
        ? user.user_metadata.full_name
        : null,
  });

  return (
    <SettingsShell
      title="Profile"
      description="Personal identity profile. Profile ≠ role. Avatar upload is not exposed until a storage convention is productized."
    >
      <ProfileSettingsForm
        email={user.email ?? null}
        initialDisplayName={identity.profile?.displayName ?? ""}
        initialPhone={identity.profile?.phone ?? ""}
      />
      <SettingsSection title="Notes">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>{SETTINGS_COPY.oneAccount}</li>
          <li>
            Manage Circle / Venue / Enterprise business profiles from those
            workspaces — not here.
          </li>
          <li>
            Avatar / media upload is FeatureGated until a canonical upload
            path is approved (no bucket details exposed).
          </li>
        </ul>
      </SettingsSection>
    </SettingsShell>
  );
}
