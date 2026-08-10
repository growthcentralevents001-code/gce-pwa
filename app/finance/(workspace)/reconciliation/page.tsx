import { PartnerPageHeader, PartnerDataTable } from "@/components/partner";
import { FinanceExceptionCard } from "@/components/finance/FinanceCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { formatMinorInr } from "@/lib/frontend/finance/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Reconciliation · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/reconciliation");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = (bundle?.reconciliation ?? []).map((r) => ({
    id: String(r.id),
    domain: r.domain,
    left_ref: r.left_ref,
    right_ref: r.right_ref,
    status: r.status,
    amount_minor: r.amount_minor,
    exception_queue: r.exception_queue,
  }));
  const exceptions = rows.filter((r) => Boolean(r.exception_queue) || ["unmatched", "mismatch", "duplicate", "under_review"].includes(String(r.status)));
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Reconciliation" description="Do not edit amounts to force a match. Exceptions stay exceptions until backend resolution." />
      {exceptions.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">{exceptions.slice(0, 6).map((e) => (
          <FinanceExceptionCard key={e.id} title={`${String(e.domain ?? "Recon")} · ${String(e.status ?? "").replace(/_/g, " ")}`} description={`Left ${String(e.left_ref ?? "—")} · Right ${String(e.right_ref ?? "—")}`} status={String(e.status ?? "")} />
        ))}</div>
      ) : null}
      {rows.length === 0 ? <EmptyState title="No reconciliation records" /> : (
        <PartnerDataTable
          columns={[
            { id: "domain", header: "Domain", cell: (r) => String(r.domain ?? "—") },
            { id: "left", header: "Left ref", cell: (r) => String(r.left_ref ?? "—") },
            { id: "right", header: "Right ref", cell: (r) => String(r.right_ref ?? "—") },
            { id: "status", header: "Status", cell: (r) => String(r.status ?? "—").replace(/_/g, " ") },
            { id: "amt", header: "Amount", cell: (r) => typeof r.amount_minor === "number" ? formatMinorInr(r.amount_minor) : "—", hideOnMobile: true },
          ]}
          rows={rows}
          mobileTitle={(r) => String(r.domain ?? "Reconciliation")}
        />
      )}
    </main>
  );
}
