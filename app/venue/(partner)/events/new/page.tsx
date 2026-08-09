import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { CreateEventForm } from "@/components/marketplace/VenueCreateForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "New Event · Venue" };

export default async function VenueNewEventPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/events/new");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="New Event" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 pb-16">
      <PartnerPageHeader title="New Event" backHref="/venue/events" backLabel="Events" />
      <CreateEventForm venueId={String(bundle.venue.id)} />
    </main>
  );
}
