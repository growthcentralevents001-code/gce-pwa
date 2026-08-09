import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { RedemptionPanel } from "@/components/marketplace/RedemptionPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import { OFFER_CLAIM_VALIDITY_HOURS } from "@/lib/frontend/marketplace/format";

export const metadata = { robots: { index: false, follow: false }, title: "Redemptions · Venue" };

export default async function VenueRedemptionsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/redemptions");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Redemptions" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  const rows = bundle.claims.map((c) => ({
    id: String(c.id),
    status: String(c.status ?? ""),
    expiresAt: c.expires_at ? String(c.expires_at) : null,
    offerId: String(c.offer_event_id ?? "").slice(0, 8),
  }));
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Claims & redemptions"
        description={`Claim ≠ redemption ≠ conversion ≠ revenue. Default claim validity ${OFFER_CLAIM_VALIDITY_HOURS}h where backend records it.`}
        backHref="/dashboard/venue"
      />
      <PartnerDataTable
        rows={rows}
        mobileTitle={(r) => `Claim ${r.id.slice(0, 8)}`}
        columns={[
          { id: "id", header: "Claim", cell: (r) => r.id.slice(0, 8) },
          { id: "offer", header: "Offer", cell: (r) => r.offerId },
          { id: "status", header: "Status", cell: (r) => <StatusBadge label={r.status.replace(/_/g, " ")} /> },
          { id: "exp", header: "Expires", cell: (r) => (r.expiresAt ? new Date(r.expiresAt).toLocaleString("en-IN") : "—") },
        ]}
        empty={<EmptyState title="No claims loaded" />}
      />
      <RedemptionPanel />
    </main>
  );
}
