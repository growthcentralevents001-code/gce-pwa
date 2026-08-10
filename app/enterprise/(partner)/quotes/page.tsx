import { PartnerPageHeader } from "@/components/partner";
import { QuoteSummaryCard, FinanceCosignStatus } from "@/components/enterprise/ProposalQuoteCards";
import { AcceptQuoteButton } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { FINANCE_COSIGN_COPY } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Quotes · Enterprise Client" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/quotes");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const rows = bundle?.quotes ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Quotes" description={`Client-facing amounts from backend. ${FINANCE_COSIGN_COPY}. Partner entitlement is never shown here.`} />
      {rows.length === 0 ? (
        <EmptyState title="No quotes yet" />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {rows.map((q) => {
            const status = String(q.status ?? "");
            const canAccept = ["issued", "viewed"].includes(status);
            return (
              <div key={String(q.id)} className="space-y-3">
                <QuoteSummaryCard
                  title={`Quote ${String(q.id).slice(0, 8)}`}
                  status={status}
                  totalProposedMinor={typeof q.total_proposed_minor === "number" ? q.total_proposed_minor : null}
                  financeCosignRequired={Boolean(q.finance_cosign_required)}
                  financeCosignedAt={typeof q.finance_cosigned_at === "string" ? q.finance_cosigned_at : null}
                  hideInternalCommission
                />
                {Boolean(q.finance_cosign_required) ? (
                  <FinanceCosignStatus
                    required
                    status={status}
                    cosignedAt={typeof q.finance_cosigned_at === "string" ? q.finance_cosigned_at : null}
                  />
                ) : null}
                {canAccept ? <AcceptQuoteButton quoteId={String(q.id)} /> : null}
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
