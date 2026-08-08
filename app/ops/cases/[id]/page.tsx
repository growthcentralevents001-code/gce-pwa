import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
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
  const { data: c } = await admin.from("ops_cases").select("*").eq("id", id).maybeSingle();
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
    <main className="mx-auto max-w-3xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops/cases" className="underline">
          Cases
        </Link>{" "}
        / {c.case_number}
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{c.case_number}</h1>
      <p className="mt-2 text-sm">{c.summary}</p>
      <p className="mt-1 text-xs text-neutral-500">
        {c.case_type} · {c.vertical} · {c.status}
      </p>
      <CaseActions caseId={c.id} currentStatus={c.status} />
      <section className="mt-6">
        <h2 className="text-sm font-medium">Notes</h2>
        <ul className="mt-2 space-y-2 text-sm">
          {(notes ?? []).map((n) => (
            <li key={n.id} className="rounded border border-neutral-200 p-2">
              <span className="text-xs text-neutral-500">{n.visibility}</span>
              <div>{n.body}</div>
            </li>
          ))}
        </ul>
      </section>
      <section className="mt-6">
        <h2 className="text-sm font-medium">Timeline</h2>
        <ul className="mt-2 space-y-1 font-mono text-xs">
          {(events ?? []).map((e) => (
            <li key={e.id}>
              {e.created_at} · {e.event_type} · {e.from_status ?? "-"} →{" "}
              {e.to_status ?? "-"}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
