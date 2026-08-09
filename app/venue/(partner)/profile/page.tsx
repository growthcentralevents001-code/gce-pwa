import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { PartnerRelationshipCard } from "@/components/marketplace/PartnerRelationshipCard";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadVenueBundle } from "@/lib/frontend/marketplace/reads";
import { venueStatusLabel } from "@/lib/frontend/marketplace/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Profile · Venue" };

export default async function VenueProfilePage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/venue/profile");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadVenueBundle(supabase, admin, user.id);
  if (!bundle.venue || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Venue profile" />
        <EmptyState title="No Venue" primaryAction={{ label: "Apply", href: "/venue/apply" }} />
      </main>
    );
  }
  const v = bundle.venue;
  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader title="Venue profile" description="Onboarding and profile status. Venues cannot self-approve." backHref="/dashboard/venue" />
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{String(v.display_name)}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {[v.city, v.state, v.category].filter(Boolean).map(String).join(" · ")}
            </p>
          </div>
          <StatusBadge label={venueStatusLabel(String(v.status))} tone={v.status === "active" ? "success" : "pending"} />
        </div>
        {v.address ? <p className="mt-4 text-sm">{String(v.address)}</p> : null}
        <p className="mt-4 text-xs text-muted-foreground">
          Form submission ≠ Platform approval. MBDP recommendation and Marketplace Ops approval are separate steps.
        </p>
      </section>
      <PartnerRelationshipCard mbdpUserId={bundle.report.attributedMbdpUserId} unitId={bundle.report.attributedUnitId} />
      <FeatureGated mode="coming_later" title="Representative management" description="Invite/remove Venue representatives uses identity/RBAC services. Full self-serve console lands when organisation membership APIs are exposed for this workspace." />
    </main>
  );
}
