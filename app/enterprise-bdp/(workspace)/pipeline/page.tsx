import { PartnerPageHeader, PartnerPipelineList } from "@/components/partner";
import { OpportunityCard } from "@/components/enterprise/OpportunityProjectCards";
import { CreateOpportunityForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseBdpBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Pipeline · Enterprise BDP" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-bdp/pipeline");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseBdpBundle(supabase, admin, user.id).catch(() => null);
  const opps = bundle?.opportunities ?? [];
  const proposals = bundle?.proposals ?? [];
  const clientOptions = (bundle?.clients ?? []).map((c) => ({
    id: String(c.id),
    label: String(c.display_name ?? c.id),
  }));
  const stages = [
    { id: "open", label: "Open / qualifying", count: opps.filter((o) => ["open", "qualifying"].includes(String(o.status))).length },
    { id: "proposal", label: "Proposal in progress", count: opps.filter((o) => String(o.status) === "proposal_in_progress").length },
    { id: "quoting", label: "Quoting", count: opps.filter((o) => String(o.status) === "quoting").length },
    { id: "drafts", label: "Proposal drafts", count: proposals.filter((p) => String(p.internal_status ?? "") === "draft").length },
  ];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Opportunity & proposal pipeline" description="Visualization only — stages come from backend. No drag-to-mutate." />
      {bundle?.pack ? (
        <CreateOpportunityForm
          clients={clientOptions}
          packId={bundle.pack.id}
          attributedBdpUserId={user.id}
        />
      ) : null}
      <PartnerPipelineList stages={stages} />
      {opps.length === 0 ? (
        <EmptyState title="No opportunities on attributed clients" />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {opps.map((o) => (
            <OpportunityCard key={String(o.id)} id={String(o.id)} title={String(o.title ?? "Opportunity")} status={String(o.status ?? "")} summary={typeof o.summary === "string" ? o.summary : null} />
          ))}
        </div>
      )}
    </main>
  );
}
