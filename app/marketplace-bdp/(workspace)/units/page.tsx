import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { MarketplaceUnitCard } from "@/components/marketplace/MarketplaceUnitCard";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import {
  MBDP_PERSON_MAX_UNITS,
  MBDP_STANDARD_MAX_VENUES,
  MBDP_VENUES_PER_UNIT,
  mbdpPackageOptionLabel,
} from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Units · Marketplace BDP" };

export default async function MbdpUnitsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/units");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);

  if (bundle.units.length === 0) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Units" backHref="/dashboard/marketplace-bdp" />
        <EmptyState title="No units" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Marketplace BDP units"
        description={`1 unit = up to ${MBDP_VENUES_PER_UNIT} active venues. Max ${MBDP_PERSON_MAX_UNITS} units / ${MBDP_STANDARD_MAX_VENUES} venues per person. Second unit requires Platform approval — frontend does not decide eligibility.`}
        backHref="/dashboard/marketplace-bdp"
      />
      <div className="space-y-4">
        {bundle.units.map((u, idx) => (
          <MarketplaceUnitCard
            key={String(u.id)}
            unitLabel={`${mbdpPackageOptionLabel(String(u.package_option))} · ${String(u.id).slice(0, 8)}`}
            status={String(u.application_status)}
            activeVenues={Number(u.active_venue_count ?? (bundle.unit?.id === u.id ? bundle.report?.activeVenueCount : 0) ?? 0)}
            capacity={Number(u.venues_capacity_max ?? MBDP_VENUES_PER_UNIT)}
            unitIndex={idx + 1}
            totalUnits={bundle.units.length}
          />
        ))}
      </div>
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.muted} p-5 text-sm text-muted-foreground`}>
        No city ownership. Territory model is venue-attribution based (FD-033).
      </section>
      <FeatureGated mode="disabled_in_environment" title="Live pack payment" description="Live Marketplace BDP pack payment / settlement remains gated." />
    </main>
  );
}
