import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import {
  PasswordUpdateForm,
  SignOutButton,
} from "@/components/settings/PasswordUpdateForm";
import { FeatureGated } from "@/components/states/FeatureGated";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Security · Settings · GCE",
};

/** SET-06 */
export default async function SettingsSecurityPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/security");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
  });
  const accountStatus = identity.identitySuspension ? "suspended" : "active";

  return (
    <SettingsShell
      title="Security"
      description="Serious but on-brand — orange accents, no blue “trust” cards. No fake MFA."
    >
      <SettingsSection title="Account status">
        <StatusBadge
          label={accountStatus}
          tone={accountStatus === "active" ? "success" : "error"}
        />
        <p className="mt-3 text-sm text-muted-foreground">
          {SETTINGS_COPY.roleVsAccount}
        </p>
        {user.last_sign_in_at ? (
          <p className="mt-2 text-xs text-muted-foreground">
            Last sign-in (auth): {user.last_sign_in_at}
          </p>
        ) : null}
      </SettingsSection>

      <PasswordUpdateForm />

      <SettingsSection
        title="Password reset email"
        description="If you prefer the email reset flow, use the forgot-password page."
      >
        <Link
          href="/forgot-password"
          className="text-sm text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Open password reset
        </Link>
      </SettingsSection>

      <SettingsSection title="Sessions & devices">
        <FeatureGated
          mode="unavailable"
          title="Session list unavailable"
          description={SETTINGS_COPY.noSessions}
        />
        <p className="mt-3 text-xs text-muted-foreground">
          {SETTINGS_COPY.noMfa}
        </p>
      </SettingsSection>

      <SettingsSection
        title="Sign out"
        description="Clears the auth session through Supabase — not a client-only fake logout."
      >
        <SignOutButton />
      </SettingsSection>
    </SettingsShell>
  );
}
