import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerDataTable } from "@/components/partner/PartnerDataTable";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "Bookings · Venue" };

export default async function VenueBookingsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/bookings");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Bookings" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  const rows = bundle.bookings.map((b) => ({
    id: String(b.id),
    eventId: String(b.event_id ?? "").slice(0, 8),
    qty: Number(b.quantity ?? 0),
    status: String(b.status ?? ""),
    createdAt: b.created_at ? String(b.created_at) : null,
  }));
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader title="Bookings" description="Operational fields only — unnecessary customer PII is not shown." backHref="/dashboard/venue" />
      <PartnerDataTable
        rows={rows}
        mobileTitle={(r) => `Booking ${r.id.slice(0, 8)}`}
        columns={[
          { id: "id", header: "Booking", cell: (r) => r.id.slice(0, 8) },
          { id: "event", header: "Event", cell: (r) => r.eventId },
          { id: "qty", header: "Qty", cell: (r) => String(r.qty) },
          { id: "status", header: "Status", cell: (r) => <StatusBadge label={r.status.replace(/_/g, " ")} /> },
          { id: "created", header: "Created", cell: (r) => (r.createdAt ? new Date(r.createdAt).toLocaleDateString("en-IN") : "—") },
        ]}
        empty={<EmptyState title="No bookings loaded" />}
      />
    </main>
  );
}
