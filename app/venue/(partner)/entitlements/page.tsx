import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import { formatMinorInr } from "@/lib/frontend/marketplace/format";

export const metadata = { robots: { index: false, follow: false }, title: "Entitlements · Venue" };

export default async function VenueEntitlementsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/entitlements");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Entitlements" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  const venueShare = bundle.entitlements.reduce(
    (s, e) => s + Number(e.venue_share_minor ?? 0),
    0
  );
  const rows = bundle.entitlements.map((e) => ({
    id: String(e.id),
    state: String(e.state ?? ""),
    venue: Number(e.venue_share_minor ?? 0),
    key: String(e.earning_event_key ?? "—"),
  }));
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Venue entitlements"
        description="Backend-calculated venue shares only. Frontend does not compute 80%. MBDP/GCE internal amounts are not shown unless authorized."
        backHref="/dashboard/venue"
      />
      <PartnerCommercialSummary
        rows={[
          {
            id: "venue",
            label: "Gross Venue entitlement (loaded)",
            amountMinor: venueShare,
            emphasize: true,
          },
        ]}
        footerNote="Settlement and payout remain Finance Ops."
      />
      <PartnerDataTable
        rows={rows}
        mobileTitle={(r) => r.key}
        columns={[
          { id: "key", header: "Earning event", cell: (r) => r.key },
          { id: "state", header: "State", cell: (r) => <StatusBadge label={r.state.replace(/_/g, " ")} /> },
          { id: "venue", header: "Venue share", cell: (r) => formatMinorInr(r.venue) },
        ]}
        empty={<EmptyState title="No entitlements yet" />}
      />
      <FeatureGated mode="disabled_in_environment" title="Settlement & payout" description="Display only — no settlement execution from Venue workspace." />
    </main>
  );
}
