import { redirect, notFound } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { VenueRelationshipPanel } from "@/components/marketplace/VenueRelationshipPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import {
  attributionStatusLabel,
  venueStatusLabel,
} from "@/lib/frontend/marketplace/format";
import { parseVenueRelationship } from "@/lib/architecture/marketplace/relationship";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Venue relationship · Marketplace BDP",
};

type PageProps = {
  params: Promise<{ venueId: string }>;
};

export default async function MbdpVenueRelationshipPage({ params }: PageProps) {
  const { venueId } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/marketplace-bdp/venues/${venueId}`);

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Venue relationship" />
        <EmptyState
          title="No unit"
          primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }}
        />
      </main>
    );
  }

  const attribution = bundle.attributions.find((a) => {
    const vRaw = a.marketplace_venues;
    const v = (Array.isArray(vRaw) ? vRaw[0] : vRaw) as
      | Record<string, unknown>
      | null
      | undefined;
    return String(v?.id ?? a.venue_id) === venueId;
  });

  if (!attribution || String(attribution.bdp_user_id) !== user.id) {
    notFound();
  }

  const vRaw = attribution.marketplace_venues;
  const venue = (Array.isArray(vRaw) ? vRaw[0] : vRaw) as Record<
    string,
    unknown
  >;
  const venueName = String(venue?.display_name ?? "Venue");
  const relationship = parseVenueRelationship(attribution.metadata);

  const recentActivity = [
    ...bundle.events
      .filter((e) => String(e.venue_id) === venueId)
      .slice(0, 5)
      .map((e) => ({
        label: `Event: ${String(e.title ?? "Untitled")}`,
        at: String(e.created_at ?? e.starts_at ?? ""),
      })),
    ...bundle.offers
      .filter((o) => String(o.venue_id) === venueId)
      .slice(0, 5)
      .map((o) => ({
        label: `Offer: ${String(o.title ?? "Untitled")}`,
        at: String(o.created_at ?? ""),
      })),
  ]
    .filter((a) => a.at)
    .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
    .slice(0, 8);

  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader
        title={venueName}
        description="Relationship notes for your attributed Venue."
        backHref="/marketplace-bdp/venues"
      />
      <VenueRelationshipPanel
        attributionId={String(attribution.id)}
        venueName={venueName}
        venueStatus={venueStatusLabel(String(venue?.status ?? "—"))}
        attributionStatus={attributionStatusLabel(String(attribution.status ?? ""))}
        relationship={relationship}
        recentActivity={recentActivity}
      />
    </main>
  );
}
