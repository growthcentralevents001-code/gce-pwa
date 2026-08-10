import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { REFUND_GATED_COPY, NO_TAX_INVENTION_COPY, formatMinorInr } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Refunds · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/refunds");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.refunds ?? []).map((r) => ({
    id: String(r.id),
    status: r.status,
    reason: r.reason,
    amount_minor: r.amount_minor ?? r.requested_amount_minor,
  }));
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Refund review" description={`${REFUND_GATED_COPY} ${NO_TAX_INVENTION_COPY}`} />
      <FeatureGated title="Refund processing OFF" description="No refund calculator. No invented refund %. Requests are review-only." mode="disabled_in_environment" />
      {rows.length === 0 ? <EmptyState title="No refund requests" /> : (
        <PartnerDataTable
          columns={[
            { id: "status", header: "Status", cell: (r) => String(r.status ?? "—").replace(/_/g, " ") },
            { id: "reason", header: "Reason", cell: (r) => String(r.reason ?? "—").slice(0, 80) },
            { id: "amt", header: "Amount", cell: (r) => typeof r.amount_minor === "number" ? formatMinorInr(Number(r.amount_minor)) : "—" },
          ]}
          rows={rows}
          mobileTitle={(r) => String(r.status ?? "Refund").replace(/_/g, " ")}
        />
      )}
    </main>
  );
}
