import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { VenuePortfolioCard } from "@/components/marketplace/VenuePortfolioCard";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { RecommendVenueForm } from "@/components/marketplace/RecommendVenueForm";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import { attributionStatusLabel, venueStatusLabel } from "@/lib/frontend/marketplace/format";

export const metadata = { robots: { index: false, follow: false }, title: "Venues · Marketplace BDP" };

export default async function MbdpVenuesPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/venues");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Venues" />
        <EmptyState title="No unit" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }

  const rows = bundle.attributions.map((a) => {
    const vRaw = a.marketplace_venues;
    const v = (Array.isArray(vRaw) ? vRaw[0] : vRaw) as Record<string, unknown> | null;
    return {
      id: String(a.id),
      venueId: String(v?.id ?? a.venue_id ?? ""),
      venueName: String(v?.display_name ?? a.venue_id ?? "Venue"),
      city: v?.city ? String(v.city) : "—",
      venueStatus: String(v?.status ?? "—"),
      attrStatus: String(a.status ?? ""),
    };
  });

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Venue portfolio"
        description="MBDP recommends; Platform Marketplace Ops final-approves. No city ownership implication."
        backHref="/dashboard/marketplace-bdp"
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:hidden">
        {rows.map((r) => (
          <VenuePortfolioCard
            key={r.id}
            name={r.venueName}
            city={r.city}
            status={r.venueStatus}
            attributionLabel={attributionStatusLabel(r.attrStatus)}
            href={r.venueId ? `/marketplace-bdp/venues/${r.venueId}` : undefined}
          />
        ))}
      </div>
      <div className="hidden lg:block">
        <PartnerDataTable
          rows={rows}
          mobileTitle={(r) => r.venueName}
          columns={[
            { id: "venue", header: "Venue", cell: (r) => r.venueName },
            { id: "city", header: "City", cell: (r) => r.city },
            { id: "vstatus", header: "Venue status", cell: (r) => <StatusBadge label={venueStatusLabel(r.venueStatus)} /> },
            { id: "attr", header: "Attribution", cell: (r) => <StatusBadge label={attributionStatusLabel(r.attrStatus)} tone="info" /> },
            {
              id: "rel",
              header: "Relationship",
              cell: (r) =>
                r.venueId ? (
                  <Button asChild variant="outline" size="sm">
                    <Link href={`/marketplace-bdp/venues/${r.venueId}`}>
                      Manage
                    </Link>
                  </Button>
                ) : (
                  "—"
                ),
            },
          ]}
          empty={<EmptyState title="No venues in portfolio yet" />}
        />
      </div>
      {rows.length === 0 ? <EmptyState title="No venues in portfolio yet" description="Recommend a Venue or propose attribution. Marketplace Ops final-approves." /> : null}
      <RecommendVenueForm unitId={bundle.unit.id} />
    </main>
  );
}
