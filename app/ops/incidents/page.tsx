import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { IncidentCard } from "@/components/ops/IncidentCard";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadIncidents } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { IncidentActions } from "./incident-actions";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Incidents · Ops · GCE",
};

export default async function IncidentsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/incidents");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.incident.manage"
    )
  ) {
    redirect("/ops");
  }
  const data = await loadIncidents(createPrivilegedSupabaseClient());

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Incident operations"
        description="Severity and status from backend. No invented incident rules."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Incidents" },
        ]}
      />
      {data.length === 0 ? (
        <EmptyState
          title="No open incidents"
          description="Incident signals appear here when queued by the ops pipeline."
        />
      ) : (
        <ul className="space-y-3">
          {data.map((i) => (
            <li key={i.id}>
              <IncidentCard
                incident={{
                  id: i.id,
                  title: i.title,
                  summary: i.summary,
                  severity: i.severity,
                  status: i.status,
                  source: i.source,
                  category: i.category,
                }}
                actions={<IncidentActions incidentId={i.id} />}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
