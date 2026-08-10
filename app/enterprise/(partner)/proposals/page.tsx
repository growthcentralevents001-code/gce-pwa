import { PartnerPageHeader } from "@/components/partner";
import { ProposalSummaryCard } from "@/components/enterprise/ProposalQuoteCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Proposals · Enterprise Client" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/proposals");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const rows = bundle?.proposals ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Proposals" description="Solution proposals prepared for your organisation. Delivery role is project-specific." />
      {rows.length === 0 ? (
        <EmptyState title="No proposals yet" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((p) => (
            <ProposalSummaryCard
              key={String(p.id)}
              title={String(p.title ?? "Proposal")}
              status={String(p.internal_status ?? p.status ?? "draft")}
              summary={typeof p.solution_summary === "string" ? p.solution_summary : null}
              pricingMinor={typeof p.pricing_summary_minor === "number" ? p.pricing_summary_minor : null}
            />
          ))}
        </div>
      )}
    </main>
  );
}
