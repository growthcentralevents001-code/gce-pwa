import { redirect } from "next/navigation";
import Link from "next/link";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Organisation · Settings · GCE",
};

/** SET-02 — links only; no duplicated business profile forms. */
export default async function SettingsOrganisationPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/organisation");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
  });

  const links: Array<{ href: string; label: string; hint: string }> = [];
  if (identity.workspaces.includes("connect-member")) {
    links.push({
      href: "/dashboard/connect-member",
      label: "Manage business profile in My Circle",
      hint: "Connect member / Circle surfaces",
    });
  }
  if (identity.workspaces.includes("venue")) {
    links.push({
      href: "/dashboard/venue",
      label: "Manage Venue profile",
      hint: "Venue representative ≠ Venue organisation",
    });
  }
  if (identity.workspaces.includes("enterprise-client")) {
    links.push({
      href: "/dashboard/enterprise-client",
      label: "Manage Enterprise organisation",
      hint: "Enterprise representative ≠ Enterprise client organisation",
    });
  }
  if (identity.workspaces.includes("connect-bdp")) {
    links.push({
      href: "/dashboard/connect-bdp",
      label: "Connect BDP workspace",
      hint: "Partner operational profile",
    });
  }
  if (identity.workspaces.includes("marketplace-bdp")) {
    links.push({
      href: "/dashboard/marketplace-bdp",
      label: "Marketplace BDP workspace",
      hint: "Partner operational profile",
    });
  }
  if (identity.workspaces.includes("enterprise-bdp")) {
    links.push({
      href: "/dashboard/enterprise-bdp",
      label: "Enterprise BDP workspace",
      hint: "Partner operational profile",
    });
  }

  return (
    <SettingsShell
      title="Organisation"
      description="Business and organisation profiles are authoritative in their workspaces. Settings does not duplicate those forms."
    >
      <SettingsSection title="Where to manage business details">
        <p className="mb-4 text-sm text-muted-foreground">
          {SETTINGS_COPY.oneAccount}
        </p>
        {links.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No business workspaces on your active assignments. Personal profile
            remains under{" "}
            <Link
              href="/settings/profile"
              className="text-primary underline-offset-4 hover:underline"
            >
              Profile
            </Link>
            .
          </p>
        ) : (
          <ul className="space-y-3">
            {links.map((l) => (
              <li
                key={l.href}
                className="flex flex-col gap-2 rounded-xl border border-border bg-muted/30 p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-sm font-medium">{l.label}</p>
                  <p className="text-xs text-muted-foreground">{l.hint}</p>
                </div>
                <Button asChild size="sm" variant="outline">
                  <Link href={l.href}>Open</Link>
                </Button>
              </li>
            ))}
          </ul>
        )}
      </SettingsSection>
    </SettingsShell>
  );
}
