import { PartnerPageHeader } from "@/components/partner";
import { RequirementVersionForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false }, title: "Requirements · Enterprise Expert" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert/requirements");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const opps = bundle?.opportunities ?? [];
  const reqs = bundle?.requirements ?? [];
  const firstOpp = opps[0] ? String(opps[0].id) : null;
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader title="Requirement structuring" description="Structure assigned opportunity requirements for proposal readiness. Not Finance authority." />
      {reqs.length === 0 ? <EmptyState title="No requirement versions yet" /> : (
        <ul className="space-y-3">{reqs.map((r) => (
          <li key={String(r.id)} className={`${GCE_RADIUS.card} ${GCE_SURFACE.card} p-4`}>
            <div className="flex justify-between gap-3">
              <p className="text-sm font-semibold">Version {String(r.version_number ?? "—")}</p>
              <StatusBadge label={String(r.status ?? "draft").replace(/_/g, " ")} />
            </div>
            <p className="mt-2 line-clamp-3 text-xs text-muted-foreground">{String(r.structured_scope ?? r.raw_requirement ?? "")}</p>
          </li>
        ))}</ul>
      )}
      {firstOpp ? <RequirementVersionForm opportunityId={firstOpp} /> : (
        <EmptyState title="Assign an opportunity first" description="Requirement forms appear when you have an assigned opportunity." />
      )}
    </main>
  );
}
