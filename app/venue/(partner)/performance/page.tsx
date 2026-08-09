import { redirect } from "next/navigation";
import { PartnerPageHeader, KpiCard } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";

export const metadata = { robots: { index: false, follow: false }, title: "Performance · Venue" };

export default async function VenuePerformancePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/performance");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Performance" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Performance"
        description="Backend-approved operational counts only. No invented Venue Performance Rank."
        backHref="/dashboard/venue"
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard label="Events" value={`${bundle.report.eventCount}`} />
        <KpiCard label="Offers" value={`${bundle.report.offerCount}`} />
        <KpiCard label="Bookings loaded" value={`${bundle.bookings.length}`} />
        <KpiCard label="Claims loaded" value={`${bundle.claims.length}`} />
      </div>
      <FeatureGated mode="disabled_in_environment" title="Venue Performance Rank" description="Rank weights remain unresolved / inactive. Do not invent scores." />
      <FeatureGated mode="coming_later" title="Aggregated non-purchase feedback" description="Customer non-purchase reasons may surface as aggregates when a redacted read-model is available." />
    </main>
  );
}
