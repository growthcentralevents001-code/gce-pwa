import { PartnerPageHeader } from "@/components/partner";
import { ProposalSummaryCard, FinanceCosignStatus } from "@/components/enterprise/ProposalQuoteCards";
import { CreateProposalForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { EXPERT_NO_COMMISSION_COPY, FINANCE_COSIGN_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Proposals · Enterprise Expert" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert/proposals");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const proposals = bundle?.proposals ?? [];
  const quotes = bundle?.quotes ?? [];
  const firstOpp = bundle?.opportunities?.[0] ? String(bundle.opportunities[0].id) : null;
  const pending = quotes.filter((q) => String(q.status) === "pending_finance_cosign");
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Proposals & quote readiness" description={`${EXPERT_NO_COMMISSION_COPY} ${FINANCE_COSIGN_COPY}.`} />
      {pending.length > 0 ? (
        <div className="grid gap-3 sm:grid-cols-2">{pending.slice(0, 4).map((q) => (
          <FinanceCosignStatus key={String(q.id)} required status={String(q.status)} cosignedAt={typeof q.finance_cosigned_at === "string" ? q.finance_cosigned_at : null} />
        ))}</div>
      ) : null}
      {proposals.length === 0 ? <EmptyState title="No proposal drafts" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{proposals.map((p) => (
          <ProposalSummaryCard key={String(p.id)} title={String(p.title ?? "Proposal")} status={String(p.internal_status ?? "draft")} summary={typeof p.solution_summary === "string" ? p.solution_summary : null} pricingMinor={typeof p.pricing_summary_minor === "number" ? p.pricing_summary_minor : null} />
        ))}</div>
      )}
      {firstOpp ? <CreateProposalForm opportunityId={firstOpp} /> : null}
    </main>
  );
}
