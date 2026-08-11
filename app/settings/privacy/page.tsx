import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { PrivacyRequestForm } from "@/components/settings/PrivacyRequestForm";
import { StatusBadge } from "@/components/states/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadOwnPrivacyRequests } from "@/lib/frontend/settings/reads";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";
import { opsStatusTone } from "@/lib/frontend/ops/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Privacy · Settings · GCE",
};

/** SET-05 */
export default async function SettingsPrivacyPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/privacy");

  const requests = await loadOwnPrivacyRequests(
    createPrivilegedSupabaseClient(),
    user.id
  );

  return (
    <SettingsShell
      title="Privacy"
      description={`${SETTINGS_COPY.contactReveal} ${SETTINGS_COPY.noDataOwnership}`}
    >
      <SettingsSection title="Contact & directory privacy">
        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            Lead contact reveal is server-authorized. There is no Settings
            toggle to always expose your phone to all leads.
          </li>
          <li>
            Circle / member directory visibility follows Circle access rules —
            Settings cannot force global exposure.
          </li>
          <li>
            Read the public{" "}
            <Link
              href="/privacy"
              className="text-primary underline-offset-4 hover:underline"
            >
              Privacy policy
            </Link>{" "}
            for approved wording.
          </li>
        </ul>
      </SettingsSection>

      <PrivacyRequestForm />

      <SettingsSection title="Your requests">
        {requests.length === 0 ? (
          <EmptyState
            title="No privacy requests yet"
            description="Submitted access, correction, erasure, or restriction requests appear here."
          />
        ) : (
          <ul className="space-y-2">
            {requests.map((r) => (
              <li
                key={r.id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-border bg-muted/30 p-3 text-sm"
              >
                <span>
                  {r.request_type}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {r.created_at}
                  </span>
                </span>
                <StatusBadge
                  label={r.status}
                  tone={opsStatusTone(r.status)}
                />
              </li>
            ))}
          </ul>
        )}
        <p className="mt-3 text-xs text-muted-foreground">
          {SETTINGS_COPY.privacyRequest}
        </p>
      </SettingsSection>

      <SettingsSection title="Consent records">
        <FeatureGated
          mode="coming_later"
          title="Consent history"
          description="Canonical consent version records will appear here when the consent read-model is exposed. Settings does not invent legal acceptance history."
        />
      </SettingsSection>
    </SettingsShell>
  );
}
