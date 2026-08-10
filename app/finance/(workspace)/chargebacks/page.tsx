import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { formatMinorInr, maskReference } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Chargebacks · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/chargebacks");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.chargebacks ?? []).map((c) => ({
    id: String(c.id),
    status: c.status,
    provider_dispute_ref: c.provider_dispute_ref,
    amount_minor: c.amount_minor,
  }));
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Chargeback review" description="Policy and deadlines are not inventable in UI. Backend state only." />
      {rows.length === 0 ? <EmptyState title="No chargeback cases" /> : (
        <PartnerDataTable
          columns={[
            { id: "status", header: "Status", cell: (r) => String(r.status ?? "—").replace(/_/g, " ") },
            { id: "ref", header: "Provider ref", cell: (r) => maskReference(typeof r.provider_dispute_ref === "string" ? r.provider_dispute_ref : null) },
            { id: "amt", header: "Amount", cell: (r) => formatMinorInr(Number(r.amount_minor ?? 0)) },
          ]}
          rows={rows}
          mobileTitle={(r) => String(r.status ?? "Chargeback").replace(/_/g, " ")}
        />
      )}
    </main>
  );
}
