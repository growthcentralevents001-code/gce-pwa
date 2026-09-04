import { notFound, redirect } from "next/navigation";
import { PartnerPageHeader } from "@/components/partner";
import {
  CreateQuoteForm,
  EnterpriseExpertWorkflowPanel,
  IssueQuoteButton,
} from "@/components/enterprise/EnterpriseClientWorkflowForms";
import {
  CreateProposalForm,
  RequirementVersionForm,
} from "@/components/enterprise/EnterpriseActionForms";
import { StatusBadge } from "@/components/states/StatusBadge";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { opportunityStatusLabel } from "@/lib/frontend/enterprise/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Opportunity · Enterprise Expert",
};

type Params = Promise<{ id: string }>;

export default async function ExpertOpportunityDetailPage({
  params,
}: {
  params: Params;
}) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/enterprise-expert/opportunities/${id}`);

  const admin = createPrivilegedSupabaseClient();
  const { data: opportunity } = await admin
    .from("enterprise_opportunities")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!opportunity) notFound();

  const { data: requirement } = await admin
    .from("enterprise_requirements")
    .select("*")
    .eq("opportunity_id", id)
    .maybeSingle();

  const { data: quotes } = await admin
    .from("enterprise_quotes")
    .select("*")
    .eq("opportunity_id", id)
    .order("created_at", { ascending: false })
    .limit(10);

  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={String(opportunity.title ?? "Opportunity")}
        description="Review, qualify, assign expert, structure requirement, proposal, and quotation."
        backHref="/enterprise-expert/queue"
        actions={
          <StatusBadge
            label={opportunityStatusLabel(String(opportunity.status ?? ""))}
          />
        }
      />

      <EnterpriseExpertWorkflowPanel
        opportunityId={id}
        readinessStatus={String(requirement?.readiness_status ?? "submitted")}
        expertUserId={
          typeof opportunity.expert_user_id === "string"
            ? opportunity.expert_user_id
            : null
        }
      />

      <RequirementVersionForm opportunityId={id} />
      <CreateProposalForm opportunityId={id} />
      <CreateQuoteForm
        opportunityId={id}
        clientId={String(opportunity.client_id)}
      />

      {(quotes ?? []).length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-sm font-semibold">Quotes</h2>
          {(quotes ?? []).map((q) => (
            <div
              key={String(q.id)}
              className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-border p-3"
            >
              <div>
                <p className="text-sm font-medium">{String(q.quote_ref ?? q.id)}</p>
                <p className="text-xs text-muted-foreground">
                  {String(q.status ?? "").replace(/_/g, " ")}
                </p>
              </div>
              {["internal_review", "finance_cosigned", "pending_finance_cosign"].includes(
                String(q.status)
              ) ? (
                <IssueQuoteButton quoteId={String(q.id)} />
              ) : null}
            </div>
          ))}
        </section>
      ) : null}
    </main>
  );
}
