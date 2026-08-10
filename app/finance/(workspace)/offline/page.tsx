import { PartnerPageHeader } from "@/components/partner";
import { OfflinePaymentCard } from "@/components/finance/FinanceCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { PAYMENT_VS_REVENUE_COPY, maskReference } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Offline payments · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/offline");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = bundle?.offlinePayments ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Offline payments" description={`${PAYMENT_VS_REVENUE_COPY} NEFT/RTGS/cheque/bank_transfer records.`} />
      {rows.length === 0 ? <EmptyState title="No offline payment records" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{rows.map((o) => (
          <OfflinePaymentCard key={String(o.id)} method={String(o.method ?? "offline")} amountMinor={Number(o.amount_minor ?? 0)} bankReferenceMasked={maskReference(typeof o.bank_reference === "string" ? o.bank_reference : null)} reconciliationStatus={String(o.reconciliation_status ?? "unmatched")} receivedOn={typeof o.received_on === "string" ? o.received_on : typeof o.created_at === "string" ? o.created_at : null} />
        ))}</div>
      )}
    </main>
  );
}
