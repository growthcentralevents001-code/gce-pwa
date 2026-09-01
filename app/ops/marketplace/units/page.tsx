import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { MbdpUnitActivateButton } from "@/components/ops/MbdpUnitActivateButton";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasMarketplacePermission } from "@/lib/architecture/marketplace";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { loadPendingMbdpUnits } from "@/lib/frontend/ops/marketplace-units";
import { mbdpPackageOptionLabel } from "@/lib/frontend/marketplace/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "MBDP unit applications · Marketplace Ops",
};

export default async function MarketplaceMbdpUnitsOpsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/marketplace/units");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasMarketplacePermission(
      entitlements.activeAssignments,
      "marketplace_bdp.unit.approve"
    )
  ) {
    redirect("/ops");
  }

  const units = await loadPendingMbdpUnits(createPrivilegedSupabaseClient());

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Marketplace BDP unit applications"
        description="Review pending MBDP units awaiting Platform activation. Pack payment must be recorded; this does not enable live settlement or payout execution."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Marketplace", href: "/ops/marketplace" },
          { label: "MBDP units" },
        ]}
      />

      {units.length === 0 ? (
        <EmptyState
          title="No pending MBDP applications"
          description="Units in pending_approval status appear here for authorized activation."
        />
      ) : (
        <ul className="space-y-3">
          {units.map((unit) => (
            <li key={unit.id}>
              <OpsQueueCard
                title={`MBDP unit ${String(unit.id).slice(0, 8)}`}
                summary={`Applicant ${String(unit.user_id).slice(0, 8)} · ${mbdpPackageOptionLabel(String(unit.package_option))} · ${
                  unit.terms_accepted_at ? "Terms accepted" : "Terms pending"
                } · ${
                  unit.payment_intent_id || unit.offline_payment_ref
                    ? "Payment recorded"
                    : "Payment missing"
                }`}
                status={String(unit.application_status)}
                meta={unit.created_at ? String(unit.created_at) : undefined}
                actions={
                  <MbdpUnitActivateButton
                    unitId={String(unit.id)}
                    applicantUserId={String(unit.user_id)}
                    actorUserId={user.id}
                  />
                }
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
