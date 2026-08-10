import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { CaseDetail } from "@/components/ops/CaseDetail";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { CaseActions } from "./case-actions";

type PageProps = { params: Promise<{ id: string }> };

export default async function OpsCaseDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.cases.manage"
    )
  ) {
    redirect("/ops");
  }

  const admin = createPrivilegedSupabaseClient();
  const { data: c } = await admin
    .from("ops_cases")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (!c) notFound();
  const { data: notes } = await admin
    .from("ops_case_notes")
    .select("id, visibility, body, author_user_id, created_at")
    .eq("case_id", id)
    .order("created_at", { ascending: true });
  const { data: events } = await admin
    .from("ops_case_events")
    .select("id, event_type, from_status, to_status, created_at")
    .eq("case_id", id)
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title={c.case_number}
        description="Case detail — minimum necessary data. No KYC / bank dump."
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Cases", href: "/ops/cases" },
          { label: c.case_number },
        ]}
      />
      <CaseDetail
        caseRow={{
          id: c.id,
          case_number: c.case_number,
          summary: c.summary,
          case_type: c.case_type,
          vertical: c.vertical,
          status: c.status,
          priority: c.priority,
          subject_type: c.subject_type,
          subject_id: c.subject_id,
        }}
        notes={notes ?? []}
        events={(events ?? []).map((e) => ({
          id: e.id,
          event_type: e.event_type,
          from_status: e.from_status,
          to_status: e.to_status,
          created_at: e.created_at,
        }))}
        actions={
          <CaseActions caseId={c.id} currentStatus={c.status} />
        }
      />
    </main>
  );
}
