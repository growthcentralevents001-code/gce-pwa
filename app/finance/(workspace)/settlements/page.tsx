import { PartnerPageHeader } from "@/components/partner";
import { SettlementBatchCard } from "@/components/finance/FinanceCards";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { SETTLEMENT_GATED_COPY, moneyFlagIsOff } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Settlements · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/settlements");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = bundle?.settlementBatches ?? [];
  const off = moneyFlagIsOff(bundle?.report?.moneyFlags, "settlement_execution");
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Settlement batches" description="Review settlement batches. Execution remains feature-gated." />
      {off ? <FeatureGated title="Settlement execution OFF" description={SETTLEMENT_GATED_COPY} mode="disabled_in_environment" /> : null}
      {rows.length === 0 ? <EmptyState title="No settlement batches" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{rows.map((b) => (
          <SettlementBatchCard key={String(b.id)} batchRef={String(b.batch_ref ?? b.id ?? "Batch")} status={String(b.status ?? "")} payableTotalMinor={typeof b.net_total_minor === "number" ? b.net_total_minor : typeof b.gross_total_minor === "number" ? b.gross_total_minor : null} periodLabel={[b.period_start, b.period_end].filter(Boolean).map(String).join(" → ") || null} />
        ))}</div>
      )}
    </main>
  );
}
