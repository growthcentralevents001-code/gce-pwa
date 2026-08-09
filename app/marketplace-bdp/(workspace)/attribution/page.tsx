import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { VenueAttributionProposeForm } from "@/components/marketplace/VenueAttributionProposeForm";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import { ATTRIBUTED_SPLIT_COPY, UNATTRIBUTED_SPLIT_COPY, attributionStatusLabel } from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Attribution · Marketplace BDP" };

export default async function MbdpAttributionPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/attribution");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Attribution" />
        <EmptyState title="No unit" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }

  const rows = bundle.attributions.map((a) => ({
    id: String(a.id),
    venueId: String(a.venue_id ?? "").slice(0, 8),
    status: String(a.status ?? ""),
    createdAt: a.created_at ? String(a.created_at) : null,
  }));

  const stages = [
    { id: "proposed", label: "Proposed", count: rows.filter((r) => r.status === "proposed").length, description: "Platform confirmation required." },
    { id: "active", label: "Attributed", count: rows.filter((r) => r.status === "active").length },
    { id: "unattributed", label: "Organic noted", count: rows.filter((r) => r.status === "unattributed").length, description: attributionStatusLabel("unattributed") },
  ];

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader title="Venue attribution" description="Propose only. Organic/unattributed remains valid. Reassignment is prospective by default." backHref="/dashboard/marketplace-bdp" />
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-2"><PartnerPipelineList title="Pipeline" stages={stages} /></div>
        <div className="lg:col-span-3"><VenueAttributionProposeForm unitId={bundle.unit.id} /></div>
      </div>
      <PartnerDataTable
        rows={rows}
        mobileTitle={(r) => `Venue ${r.venueId}`}
        columns={[
          { id: "venue", header: "Venue", cell: (r) => r.venueId },
          { id: "status", header: "Status", cell: (r) => <StatusBadge label={attributionStatusLabel(r.status)} /> },
          { id: "created", header: "Created", cell: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—") },
        ]}
        empty={<EmptyState title="No attribution records" />}
      />
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.muted} p-5 space-y-2 text-sm text-muted-foreground`}>
        <p>{ATTRIBUTED_SPLIT_COPY}</p>
        <p>{UNATTRIBUTED_SPLIT_COPY}</p>
      </section>
    </main>
  );
}
