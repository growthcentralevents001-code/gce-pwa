import { redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadMbdpBundle } from "@/lib/frontend/marketplace/reads";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Reassignment · Marketplace BDP" };

export default async function MbdpReassignmentPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/marketplace-bdp/reassignment");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadMbdpBundle(supabase, admin, user.id);
  if (!bundle.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-8">
        <PartnerPageHeader title="Reassignment" />
        <EmptyState title="No unit" primaryAction={{ label: "Apply", href: "/marketplace-bdp/apply" }} />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 pb-16 space-y-8">
      <PartnerPageHeader
        title="Reassignment"
        description="Prospective by default. Historical entitlement is not rewritten client-side. Platform approval required for handover."
        backHref="/dashboard/marketplace-bdp"
      />
      <section className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-5 space-y-3 text-sm text-muted-foreground`}>
        <p>Current unit: <span className="font-medium text-foreground tabular-nums">{bundle.unit.id.slice(0, 8)}</span></p>
        <p>Reassignment does not automatically create retroactive commission on historical unattributed revenue.</p>
        <p>Missing MBDP 10% on unattributed events is not pending commission.</p>
      </section>
      <EmptyState title="No open reassignment requests" description="When Platform initiates a Venue handover, status will appear here." />
      <FeatureGated mode="unavailable" title="Self-serve reassignment" description="Creating or approving Venue reassignment/handover is Platform-gated." />
    </main>
  );
}
