import Link from "next/link";
import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { EventManagementCard } from "@/components/marketplace/EventOfferCards";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "Events · Venue" };

export default async function VenueEventsPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/events");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Events" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader
        title="Events"
        description="Create drafts and submit for Platform review. Ticket price truth is backend-owned."
        backHref="/dashboard/venue"
        actions={<Button asChild className="min-h-11"><Link href="/venue/events/new">New Event</Link></Button>}
      />
      {bundle.events.length === 0 ? (
        <EmptyState title="No Events" primaryAction={{ label: "Create", href: "/venue/events/new" }} />
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
              href={`/venue/events/${e.id}`}
            />
          ))}
        </div>
      )}
    </main>
  );
}
