import { redirect } from "next/navigation";
import { ConnectPageHeader } from "@/components/connect/ConnectPageHeader";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listActiveSpecialisations } from "@/lib/architecture/connect/specialisations";
import { PowerSectorGrid } from "@/components/connect/PowerSectorGrid";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Specialisation · GCE Connect",
};

export default async function SpecialisationPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/connect/specialisation");

  const memberships = await listMembershipsForUser(supabase, user.id).catch(
    () => []
  );
  const primary = memberships[0];
  const specs = await listActiveSpecialisations(supabase).catch(() => []);
  const spec = specs.find((s) => s.id === primary?.specialisationId);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <ConnectPageHeader
        title="Business specialisation"
        description="One primary specialisation per seat. Eligibility and conflicts are decided by the platform — not this UI."
        backHref="/dashboard/connect-member"
      />

      {!primary ? (
        <EmptyState
          title="No membership"
          description="Start an Associate application to choose geography, specialisation, and Tags."
          primaryAction={{
            label: "Start application",
            href: "/memberships/apply",
          }}
          secondaryAction={{
            label: "Membership status",
            href: "/connect/membership",
          }}
        />
      ) : (
        <div className="space-y-6">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <StatusBadge label={primary.status} />
              <StatusBadge
                label={primary.allocationStatus.replaceAll("_", " ")}
                tone="pending"
              />
            </div>
            <p className="mt-4 text-sm">
              Primary specialisation:{" "}
              <span className="font-medium">
                {spec?.label ?? (primary.specialisationId ? "Assigned" : "not set")}
              </span>
            </p>
            {spec?.powerSector ? (
              <p className="mt-1 text-xs text-muted-foreground">
                GC Power Sector: {spec.powerSector}
              </p>
            ) : null}
            <p className="mt-2 text-xs text-muted-foreground">
              Change requests and conflict outcomes (alternative Circle, nearby,
              waitlist, formation, manual review) are server-driven.
            </p>
          </div>
          <section>
            <h2 className="mb-3 text-sm font-semibold">
              GC Power Sectors (taxonomy)
            </h2>
            <PowerSectorGrid />
          </section>
        </div>
      )}
    </main>
  );
}
