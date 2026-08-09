import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { OfferManagementCard } from "@/components/marketplace/EventOfferCards";
import { CreateOfferForm } from "@/components/marketplace/VenueCreateForms";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import {
  OFFER_CLAIM_VALIDITY_HOURS,
  offerCampaignRulesNote,
  plannedSaleValueNote,
} from "@/lib/frontend/marketplace/format";

export const metadata = { robots: { index: false, follow: false }, title: "Offers · Venue" };

export default async function VenueOffersPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/offers");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Offers" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Offer Events"
        description={`${plannedSaleValueNote()} ${offerCampaignRulesNote()}`}
        backHref="/dashboard/venue"
      />
      {bundle.offers.length === 0 ? (
        <EmptyState title="No Offer Events yet" />
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
      <CreateOfferForm venueId={String(bundle.venue.id)} />
      <FeatureGated mode="disabled_in_environment" title="Offer listing billing" description="Offer listing fee collection remains inactive / future unless Founder-activated." />
    </main>
  );
}
