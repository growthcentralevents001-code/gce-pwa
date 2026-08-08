import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { IncidentActions } from "./incident-actions";

export default async function IncidentsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  if (
    !actorHasOpsAdminPermission(
      entitlements.activeAssignments,
      "ops.incident.manage"
    )
  ) {
    redirect("/ops");
  }
  const { data } = await createPrivilegedSupabaseClient()
    .from("incident_signals")
    .select("*")
    .in("status", ["candidate", "acknowledged", "investigating"])
    .order("last_seen_at", { ascending: false })
    .limit(50);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / Incidents
      </p>
      <h1 className="mt-2 text-2xl font-semibold">Incident operations</h1>
      <p className="mt-1 text-xs text-neutral-500">
        Phase 12 signal foundation + Phase 13 acknowledge/resolve workflow
      </p>
      <ul className="mt-6 space-y-3 text-sm">
        {(data ?? []).map((i) => (
          <li key={i.id} className="rounded border border-neutral-200 p-3">
            <div className="font-medium">{i.title}</div>
            <p className="mt-1 text-neutral-700">{i.summary}</p>
            <div className="mt-1 text-xs text-neutral-500">
              {i.severity} · {i.status} · {i.source}
            </div>
            <IncidentActions incidentId={i.id} />
          </li>
        ))}
      </ul>
    </main>
  );
}
