import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { VenueBusinessInsightsPanel } from "@/components/marketplace/VenueBusinessInsightsPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Performance · Venue",
};

export default async function VenuePerformancePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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
  const insights = bundle.insights;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 pb-16 space-y-10">
      <PartnerPageHeader
        title="Performance & insights"
        description="Aggregate customer reach and listing activity from canonical Marketplace records. Visibility and engagement are reported separately."
        backHref="/dashboard/venue"
      />

      {insights ? (
        <VenueBusinessInsightsPanel insights={insights} />
      ) : (
        <EmptyState
          title="Insights unavailable"
          description="Could not load business insights for this Venue."
        />
      )}

      {engagement && (
        <section className="space-y-6 border-t border-border pt-8">
          <div>
            <h2 className="text-base font-semibold">Listing funnel detail</h2>
            <p className="text-sm text-muted-foreground">
              View counts and claim funnel metrics. Views are visibility signals,
              not unique customers.
            </p>
          </div>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Event listings</h3>
            {(engagement.eventPerformance.length ?? 0) === 0 ? (
              <EmptyState
                title="No Events yet"
                primaryAction={{ label: "Create", href: "/venue/events/new" }}
              />
            ) : (
              <PartnerDataTable
                rows={engagement.eventPerformance.map((r) => ({
                  ...r,
                  id: r.eventId,
                }))}
                mobileTitle={(r) => r.title}
                columns={[
                  { id: "title", header: "Event", cell: (r) => r.title },
                  { id: "views", header: "Views", cell: (r) => String(r.views) },
                  {
                    id: "bookings",
                    header: "Bookings",
                    cell: (r) => String(r.bookings),
                  },
                ]}
                empty={null}
              />
            )}
          </section>

          <section className="space-y-3">
            <h3 className="text-sm font-semibold">Offer listings</h3>
            {(engagement.offerPerformance.length ?? 0) === 0 ? (
              <EmptyState
                title="No Offers yet"
                primaryAction={{ label: "Offers", href: "/venue/offers" }}
              />
            ) : (
              <PartnerDataTable
                rows={engagement.offerPerformance.map((r) => ({
                  ...r,
                  id: r.offerId,
                }))}
                mobileTitle={(r) => r.title}
                columns={[
                  { id: "title", header: "Offer", cell: (r) => r.title },
                  { id: "views", header: "Views", cell: (r) => String(r.views) },
                  { id: "claims", header: "Claims", cell: (r) => String(r.claims) },
                  {
                    id: "visits",
                    header: "Visits",
                    cell: (r) => String(r.visits),
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
        </section>
      )}

      <FeatureGated
        mode="disabled_in_environment"
        title="Venue Performance Rank"
        description="Rank weights remain unresolved / inactive. Do not invent scores."
      />
    </main>
  );
}
