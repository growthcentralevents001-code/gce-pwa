import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { EbdpPackActivateButton } from "@/components/ops/EbdpPackActivateButton";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { loadPendingEbdpPacks } from "@/lib/frontend/ops/enterprise-packs";
import { ebdpPackageOptionLabel } from "@/lib/frontend/enterprise/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Enterprise BDP pack applications · Ops",
};

export default async function EnterpriseEbdpPacksOpsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/enterprise/packs");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const isReviewer = entitlements.activeAssignments.some(
    (a) =>
      a.status === "active" &&
      (a.roleKey === "platform_admin" || a.roleKey === "support_admin")
  );
  if (!isReviewer) redirect("/ops");

  const packs = await loadPendingEbdpPacks(createPrivilegedSupabaseClient());

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Enterprise BDP pack applications"
        description="Review pending Enterprise BDP Franchise Pack applications. Activation grants workspace access — it does not enable live settlement or payout execution."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Enterprise", href: "/ops/enterprise" },
          { label: "BDP packs" },
        ]}
      />

      {packs.length === 0 ? (
        <EmptyState
          title="No pending Enterprise BDP applications"
          description="Packs in submitted, pending payment, or pending approval status appear here."
        />
      ) : (
        <ul className="space-y-3">
          {packs.map((pack) => {
            const canActivate =
              pack.application_status === "pending_approval" &&
              Boolean(pack.terms_accepted_at) &&
              Boolean(pack.payment_intent_id || pack.offline_payment_ref);
            return (
              <li key={String(pack.id)}>
                <OpsQueueCard
                  title={`EBDP pack ${String(pack.id).slice(0, 8)}`}
                  summary={`Applicant ${String(pack.user_id).slice(0, 8)} · ${ebdpPackageOptionLabel(String(pack.package_option))} · ${
                    pack.terms_accepted_at ? "Terms accepted" : "Terms pending"
                  } · ${
                    pack.payment_intent_id || pack.offline_payment_ref
                      ? "Payment recorded"
                      : "Payment missing"
                  }`}
                  status={String(pack.application_status)}
                  meta={pack.created_at ? String(pack.created_at) : undefined}
                  actions={
                    pack.application_status === "pending_approval" ? (
                      <EbdpPackActivateButton
                        packId={String(pack.id)}
                        applicantUserId={String(pack.user_id)}
                        actorUserId={user.id}
                        canActivate={canActivate}
                      />
                    ) : undefined
                  }
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
