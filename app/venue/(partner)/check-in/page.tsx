import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { CheckInPanel } from "@/components/marketplace/CheckInPanel";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "Check-in · Venue" };

export default async function VenueCheckInPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/check-in");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Check-in" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-xl px-4 py-8 pb-16 space-y-6">
      <PartnerPageHeader
        title="Ticket check-in"
        description="Utility-first. Large targets. Server validates presented tokens — QR parse alone is not authority."
        backHref="/dashboard/venue"
      />
      <CheckInPanel />
    </main>
  );
}
