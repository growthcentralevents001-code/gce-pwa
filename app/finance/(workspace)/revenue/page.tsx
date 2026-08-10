import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { RevenueComponentCard } from "@/components/finance/FinanceCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { PAYMENT_VS_REVENUE_COPY, formatMinorInr, recognitionStatusLabel } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Revenue · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/revenue");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.revenueComponents ?? []).map((r) => ({
    id: String(r.id),
    revenue_component_key: r.revenue_component_key,
    vertical: r.vertical,
    recognition_status: r.recognition_status,
    gross_amount_minor: r.gross_amount_minor,
    eligible_base_minor: r.eligible_base_minor,
  }));
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Revenue components" description={`${PAYMENT_VS_REVENUE_COPY} Component identity is preserved for no-double-commission.`} />
      {rows.length === 0 ? <EmptyState title="No revenue components" /> : (
        <>
          <div className="grid gap-3 md:hidden">{rows.map((r) => (
            <RevenueComponentCard key={r.id} revenueComponentKey={String(r.revenue_component_key ?? "")} vertical={String(r.vertical ?? "")} recognitionStatus={String(r.recognition_status ?? "")} grossAmountMinor={Number(r.gross_amount_minor ?? 0)} eligibleBaseMinor={Number(r.eligible_base_minor ?? 0)} />
          ))}</div>
          <div className="hidden md:block">
            <PartnerDataTable
              columns={[
                { id: "key", header: "Component key", cell: (r) => String(r.revenue_component_key ?? "—") },
                { id: "vertical", header: "Vertical", cell: (r) => String(r.vertical ?? "—") },
                { id: "status", header: "Recognition", cell: (r) => recognitionStatusLabel(String(r.recognition_status ?? "")) },
                { id: "gross", header: "Gross", cell: (r) => formatMinorInr(Number(r.gross_amount_minor ?? 0)) },
                { id: "eligible", header: "Eligible base", cell: (r) => formatMinorInr(Number(r.eligible_base_minor ?? 0)), hideOnMobile: true },
              ]}
              rows={rows}
              mobileTitle={(r) => String(r.revenue_component_key ?? "Component")}
            />
          </div>
        </>
      )}
      <p className="text-xs text-muted-foreground">Gross amounts are read-only. No edit ledger / edit commission controls.</p>
    </main>
  );
}
