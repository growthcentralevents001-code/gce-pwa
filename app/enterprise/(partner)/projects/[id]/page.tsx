import { notFound, redirect } from "next/navigation";
import { PartnerPageHeader, PartnerStatusStrip } from "@/components/partner";
import { ProjectComponentCard, MilestoneList, ChangeOrderCard } from "@/components/enterprise/ProjectOpsCards";
import { ChangeOrderForm } from "@/components/enterprise/EnterpriseActionForms";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import { GCE_EXECUTION_ROLE_COPY, projectStatusLabel } from "@/lib/frontend/enterprise/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = { robots: { index: false, follow: false }, title: "Project · Enterprise Client" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/enterprise/projects/${id}`);
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const project = bundle?.projects.find((p) => String(p.id) === id);
  if (!project) notFound();
  const components = (bundle?.components ?? []).filter((c) => String(c.project_id) === id);
  const milestones = (bundle?.milestones ?? []).filter((m) => String(m.project_id) === id);
  const changeOrders = (bundle?.changeOrders ?? []).filter((c) => String(c.project_id) === id);
  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 space-y-8 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={String(project.title ?? "Project")}
        description={typeof project.gce_execution_role === "string" ? `Contractual role: ${project.gce_execution_role}` : GCE_EXECUTION_ROLE_COPY}
      />
      <PartnerStatusStrip
        items={[
          { id: "status", label: "Status", value: projectStatusLabel(String(project.status ?? "")), tone: "neutral" },
          { id: "components", label: "Components", value: String(components.length) },
          { id: "milestones", label: "Milestones", value: String(milestones.length) },
        ]}
      />
      <section>
        <h2 className="mb-3 text-base font-semibold">Project components</h2>
        {components.length === 0 ? (
          <EmptyState title="No components yet" description="Componentised revenue preserves no-double-commission boundaries." />
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {components.map((c) => (
              <ProjectComponentCard
                key={String(c.id)}
                name={String(c.name ?? c.label ?? "Component")}
                componentType={typeof c.component_type === "string" ? c.component_type : null}
                sourcingVertical={typeof c.sourcing_vertical === "string" ? c.sourcing_vertical : null}
                amountMinor={typeof c.amount_minor === "number" ? c.amount_minor : null}
                status={typeof c.status === "string" ? c.status : null}
                revenueComponentKey={typeof c.revenue_component_key === "string" ? c.revenue_component_key : null}
              />
            ))}
          </div>
        )}
      </section>
      <section>
        <h2 className="mb-3 text-base font-semibold">Milestones</h2>
        <MilestoneList
          milestones={milestones.map((m) => ({
            id: String(m.id),
            name: String(m.name ?? "Milestone"),
            status: String(m.status ?? "planned"),
            dueOn: typeof m.due_on === "string" ? m.due_on : null,
            amountMinor: typeof m.amount_minor === "number" ? m.amount_minor : null,
          }))}
        />
      </section>
      <section className="grid gap-4 lg:grid-cols-2">
        <div>
          <h2 className="mb-3 text-base font-semibold">Change orders</h2>
          {changeOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground">No change orders yet.</p>
          ) : (
            <div className="space-y-3">
              {changeOrders.map((c) => (
                <ChangeOrderCard
                  key={String(c.id)}
                  title={String(c.title ?? "Change order")}
                  status={String(c.status ?? "requested")}
                  requestedChange={typeof c.requested_change === "string" ? c.requested_change : null}
                  commercialImpactMinor={typeof c.commercial_impact_minor === "number" ? c.commercial_impact_minor : null}
                />
              ))}
            </div>
          )}
        </div>
        <ChangeOrderForm projectId={id} />
      </section>
    </main>
  );
}
