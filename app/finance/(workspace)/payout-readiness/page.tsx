import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { PAYOUT_GATED_COPY, formatMinorInr, moneyFlagIsOff } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Payout readiness · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/payout-readiness");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.payoutItems ?? []).map((p) => ({
    id: String(p.id),
    status: p.status,
    amount_minor: p.net_minor,
    stakeholder_type: p.stakeholder_type,
  }));
  const off = moneyFlagIsOff(bundle?.report?.moneyFlags, "payout_execution");
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Payout-ready items" description="Queue is display/review only." />
      {off ? <FeatureGated title="Payout execution OFF" description={PAYOUT_GATED_COPY} mode="disabled_in_environment" /> : null}
      {rows.length === 0 ? <EmptyState title="No payout items" /> : (
        <PartnerDataTable
          columns={[
            { id: "status", header: "Status", cell: (r) => String(r.status ?? "—").replace(/_/g, " ") },
            { id: "stakeholder", header: "Stakeholder", cell: (r) => String(r.stakeholder_type ?? "—").replace(/_/g, " ") },
            { id: "amt", header: "Amount", cell: (r) => formatMinorInr(Number(r.amount_minor ?? 0)) },
          ]}
          rows={rows}
          mobileTitle={(r) => String(r.status ?? "Payout").replace(/_/g, " ")}
        />
      )}
    </main>
  );
}
