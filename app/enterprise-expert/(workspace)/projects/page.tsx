import { PartnerPageHeader } from "@/components/partner";
import { ProjectCard } from "@/components/enterprise/OpportunityProjectCards";
import { ProjectComponentCard } from "@/components/enterprise/ProjectOpsCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseExpertBundle } from "@/lib/frontend/enterprise/reads";
import { GCE_EXECUTION_ROLE_COPY, formatContractualRole } from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false }, title: "Projects · Enterprise Expert" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise-expert/projects");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseExpertBundle(admin, user.id).catch(() => null);
  const projects = bundle?.projects ?? [];
  const components = bundle?.components ?? [];
  return (
    <div className="space-y-8">
      <PartnerPageHeader title="Project operational views" description={GCE_EXECUTION_ROLE_COPY} />
      {projects.length === 0 ? <EmptyState title="No projects in view" /> : (
        <div className="grid gap-3 sm:grid-cols-2">{projects.map((p) => (
          <ProjectCard key={String(p.id)} id={String(p.id)} title={String(p.title ?? "Project")} status={String(p.status ?? "")} executionNote={typeof p.gce_execution_role === "string" ? formatContractualRole(p.gce_execution_role) : GCE_EXECUTION_ROLE_COPY} />
        ))}</div>
      )}
      <section>
        <h2 className="mb-3 text-base font-semibold">Project components</h2>
        {components.length === 0 ? <p className="text-sm text-muted-foreground">No components loaded.</p> : (
          <div className="grid gap-3 sm:grid-cols-2">{components.slice(0, 12).map((c) => (
            <ProjectComponentCard key={String(c.id)} name={String(c.name ?? c.label ?? "Component")} componentType={typeof c.component_type === "string" ? c.component_type : null} sourcingVertical={typeof c.sourcing_vertical === "string" ? c.sourcing_vertical : null} amountMinor={typeof c.amount_minor === "number" ? c.amount_minor : null} status={typeof c.status === "string" ? c.status : null} revenueComponentKey={typeof c.revenue_component_key === "string" ? c.revenue_component_key : null} />
          ))}</div>
        )}
      </section>
    </div>
  );
}
