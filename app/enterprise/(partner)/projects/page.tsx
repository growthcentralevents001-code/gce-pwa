import { PartnerPageHeader } from "@/components/partner";
import { ProjectCard } from "@/components/enterprise/OpportunityProjectCards";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import {
  GCE_EXECUTION_ROLE_COPY,
  formatContractualRole,
} from "@/lib/frontend/enterprise/format";
import { redirect } from "next/navigation";

export const metadata = { robots: { index: false, follow: false }, title: "Projects · Enterprise Client" };

export default async function Page() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/enterprise/projects");
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(() => null);
  const rows = bundle?.projects ?? [];
  return (
    <div className="space-y-8">
      <PartnerPageHeader title="Projects" description={GCE_EXECUTION_ROLE_COPY} />
      {rows.length === 0 ? (
        <EmptyState title="No projects yet" description="Projects appear after accepted quotes." />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {rows.map((p) => (
            <ProjectCard
              key={String(p.id)}
              id={String(p.id)}
              title={String(p.title ?? "Project")}
              status={String(p.status ?? "")}
              href={`/enterprise/projects/${p.id}`}
              executionNote={
                typeof p.gce_execution_role === "string"
                  ? `Role: ${formatContractualRole(p.gce_execution_role)}`
                  : GCE_EXECUTION_ROLE_COPY
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
