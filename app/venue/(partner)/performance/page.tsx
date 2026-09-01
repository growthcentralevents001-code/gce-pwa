import { redirect } from "next/navigation";
import { PartnerPageHeader, KpiCard } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "Performance · Venue" };

export default async function VenuePerformancePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/performance");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Performance" />
        <EmptyState title="No Venue" primaryAction={{ label: "Join", href: "/venue/apply" }} />
      </main>
    );
  }

  const engagement = bundle.engagement;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Performance"
        description="Backend-derived engagement from first-party views, bookings, and claims. No invented rank scores."
        backHref="/dashboard/venue"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Venue profile views" value={`${engagement?.venueViews ?? 0}`} />
        <KpiCard label="Event views" value={`${engagement?.eventViews ?? 0}`} />
        <KpiCard label="Offer views" value={`${engagement?.offerViews ?? 0}`} />
        <KpiCard label="Total customer actions" value={`${engagement?.totalCustomerActions ?? 0}`} />
        <KpiCard label="Events" value={`${bundle.report.eventCount}`} />
        <KpiCard label="Offers" value={`${bundle.report.offerCount}`} />
        <KpiCard label="Bookings" value={`${engagement?.totalBookings ?? 0}`} />
        <KpiCard label="Claims" value={`${engagement?.totalClaims ?? 0}`} />
        <KpiCard label="Redemptions" value={`${engagement?.totalRedemptions ?? 0}`} />
      </div>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Event performance</h2>
        {(engagement?.eventPerformance.length ?? 0) === 0 ? (
          <EmptyState title="No Events yet" primaryAction={{ label: "Create", href: "/venue/events/new" }} />
        ) : (
          <PartnerDataTable
            rows={engagement!.eventPerformance.map((r) => ({ ...r, id: r.eventId }))}
            mobileTitle={(r) => r.title}
            columns={[
              { id: "title", header: "Event", cell: (r) => r.title },
              { id: "views", header: "Views", cell: (r) => String(r.views) },
              { id: "bookings", header: "Bookings", cell: (r) => String(r.bookings) },
            ]}
            empty={null}
          />
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-base font-semibold">Offer performance</h2>
        {(engagement?.offerPerformance.length ?? 0) === 0 ? (
          <EmptyState title="No Offers yet" primaryAction={{ label: "Offers", href: "/venue/offers" }} />
        ) : (
          <PartnerDataTable
            rows={engagement!.offerPerformance.map((r) => ({ ...r, id: r.offerId }))}
            mobileTitle={(r) => r.title}
            columns={[
              { id: "title", header: "Offer", cell: (r) => r.title },
              { id: "views", header: "Views", cell: (r) => String(r.views) },
              { id: "claims", header: "Claims", cell: (r) => String(r.claims) },
              {
                id: "active",
                header: "Active",
                cell: (r) => String(r.activeClaims),
                hideOnMobile: true,
              },
              {
                id: "expired",
                header: "Expired",
                cell: (r) => String(r.expiredClaims),
                hideOnMobile: true,
              },
              {
                id: "redemptions",
                header: "Redemptions",
                cell: (r) => String(r.redemptions),
              },
              {
                id: "redeemRate",
                header: "Redemption rate",
                cell: (r) =>
                  r.redemptionRate != null ? `${r.redemptionRate}%` : "—",
                hideOnMobile: true,
              },
              {
                id: "conv",
                header: "View→claim",
                cell: (r) =>
                  r.conversionRate != null ? `${r.conversionRate}%` : "—",
                hideOnMobile: true,
              },
            ]}
            empty={null}
          />
        )}
      </section>

      <FeatureGated mode="disabled_in_environment" title="Venue Performance Rank" description="Rank weights remain unresolved / inactive. Do not invent scores." />
    </main>
  );
}
