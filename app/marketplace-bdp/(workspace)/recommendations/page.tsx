import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { EventManagementCard, OfferManagementCard } from "@/components/marketplace/EventOfferCards";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import { OFFER_CLAIM_VALIDITY_HOURS } from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Recommendations · Marketplace BDP" };

export default async function MbdpRecommendationsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/recommendations");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Recommendations" />
        <EmptyState title="No unit" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Event / Offer recommendations"
        description="Marketplace BDP may recommend. Platform Marketplace Ops final-approves. Do not treat submitted as approved."
        backHref="/dashboard/marketplace-bdp"
      />
      <section>
        <h2 className="mb-3 text-base font-semibold">Portfolio Events</h2>
        {bundle.events.length === 0 ? (
          <EmptyState title="No Events in attributed portfolio" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bundle.events.map((e) => (
              <EventManagementCard
                key={String(e.id)}
                title={String(e.title ?? "Event")}
                status={String(e.status ?? "draft")}
                startsAt={e.starts_at ? String(e.starts_at) : null}
                capacity={typeof e.capacity === "number" ? e.capacity : null}
                priceMinor={typeof e.price_minor === "number" ? e.price_minor : null}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-base font-semibold">Portfolio Offers</h2>
        {bundle.offers.length === 0 ? (
          <EmptyState title="No Offer Events in attributed portfolio" />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {bundle.offers.map((o) => (
              <OfferManagementCard
                key={String(o.id)}
                title={String(o.title ?? "Offer")}
                status={String(o.status ?? "draft")}
                campaignStartsAt={o.campaign_starts_at ? String(o.campaign_starts_at) : null}
                campaignEndsAt={o.campaign_ends_at ? String(o.campaign_ends_at) : null}
                customerCap={typeof o.customer_cap === "number" ? o.customer_cap : null}
                claimsCount={typeof o.claims_count === "number" ? o.claims_count : null}
                plannedValueMinor={typeof o.planned_commercial_value_minor === "number" ? o.planned_commercial_value_minor : null}
                claimValidityHours={typeof o.claim_validity_hours === "number" ? o.claim_validity_hours : OFFER_CLAIM_VALIDITY_HOURS}
              />
            ))}
          </div>
        )}
      </section>
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5 text-sm text-muted-foreground`}>
        Venue onboard assist and Event/Offer recommendation actions that require additional Platform tooling remain constrained to propose/submit flows. Final approval buttons are Ops-only.
      </section>
      <FeatureGated mode="unavailable" title="Final approval" description="Platform Marketplace Ops owns final Event/Offer/Venue approval. This workspace does not expose Ops-only approve actions." />
    </main>
  );
}
