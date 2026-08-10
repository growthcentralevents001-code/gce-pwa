import { PartnerPageHeader } from "@/components/partner";
import { HoldCard } from "@/components/finance/FinanceCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Holds · Finance" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/finance/holds");
  const bundle = await loadFinanceBundle(createPrivilegedSupabaseClient()).catch(() => null);
  const rows = bundle?.holds ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Financial holds" description="Hold create/release requires finance.hold.manage. No generic toggle." />
      {rows.length === 0 ? <EmptyState title="No holds" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{rows.map((h) => (
          <HoldCard key={String(h.id)} reason={String(h.reason ?? "Hold")} status={String(h.status ?? "")} amountMinor={typeof h.amount_minor === "number" ? h.amount_minor : null} scopeType={typeof h.scope_type === "string" ? h.scope_type : null} createdAt={typeof h.created_at === "string" ? h.created_at : null} />
        ))}</div>
      )}
    </main>
  );
}
