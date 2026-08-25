import { PartnerPageHeader } from "@/components/partner";
import { OpportunityCard } from "@/components/enterprise/OpportunityProjectCards";
import { CreateOpportunityForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Queue · Enterprise Expert" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert/queue");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const rows = bundle?.opportunities ?? [];
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Assigned opportunity queue" description="Opportunities assigned to you as Enterprise Platform Expert. Unassigned clients and projects are not listed." />
      <CreateOpportunityForm clients={[]} />
      {rows.length === 0 ? <EmptyState title="No assigned opportunities" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{rows.map((o) => (
          <OpportunityCard key={String(o.id)} id={String(o.id)} title={String(o.title ?? "Opportunity")} status={String(o.status ?? "")} summary={typeof o.summary === "string" ? o.summary : null} />
        ))}</div>
      )}
    </main>
  );
}
