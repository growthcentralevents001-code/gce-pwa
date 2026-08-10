import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { EmptyState } from "@/components/states/EmptyState";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadCases } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { CreateCaseForm } from "./create-case-form";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Cases · Ops · GCE",
};

export default async function OpsCasesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops/cases");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.cases.manage"
    )
  ) {
    redirect("/ops");
  }
  const items = await loadCases(createPrivilegedSupabaseClient());

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Cases & disputes"
        description="Shared ops_cases umbrella. Domain disputes remain linked source of truth. Support cannot invent state overrides."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Cases" },
        ]}
      />
      <CreateCaseForm />
      {items.length === 0 ? (
        <EmptyState
          title="No open cases"
          description="Create a case only when a canonical ops case is required."
        />
      ) : (
        <ul className="space-y-3">
          {items.map((c) => (
            <li key={c.id}>
              <OpsQueueCard
                title={c.case_number}
                summary={c.summary}
                status={c.status}
                meta={`${c.case_type} · ${c.vertical} · ${c.priority}`}
                href={`/ops/cases/${c.id}`}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
