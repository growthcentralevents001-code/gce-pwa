import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsPermission,
  searchAuditEvents,
} from "@/lib/architecture/ops-governance";

type PageProps = { searchParams: Promise<{ tab?: string }> };

export default async function OpsSecurityPage({ searchParams }: PageProps) {
  const { tab = "security" } = await searchParams;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const admin = createPrivilegedSupabaseClient();

  let rows: Array<Record<string, unknown>> = [];
  let title = "Security";

  if (tab === "audit") {
    if (!actorHasOpsPermission(assignments, "audit.search")) redirect("/ops");
    title = "Audit search";
    rows = (await searchAuditEvents(admin, { limit: 30 })) as Array<
      Record<string, unknown>
    >;
  } else if (tab === "risk") {
    if (!actorHasOpsPermission(assignments, "risk.review")) redirect("/ops");
    title = "Risk signals";
    const { data } = await admin
      .from("risk_signals")
      .select("id, signal_type, category, review_status, recommendation, auto_action_applied, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    rows = (data ?? []) as Array<Record<string, unknown>>;
  } else if (tab === "holds") {
    if (!actorHasOpsPermission(assignments, "compliance.hold")) redirect("/ops");
    title = "Compliance holds";
    const { data } = await admin
      .from("compliance_holds")
      .select("id, subject_type, subject_id, reason, status, started_at")
      .eq("status", "active")
      .order("created_at", { ascending: false })
      .limit(30);
    rows = (data ?? []) as Array<Record<string, unknown>>;
  } else if (tab === "alerts") {
    if (!actorHasOpsPermission(assignments, "alerts.manage")) redirect("/ops");
    title = "Operational alerts";
    const { data } = await admin
      .from("operational_alerts")
      .select("id, alert_key, severity, title, status, occurrence_count, last_seen_at")
      .eq("status", "open")
      .order("last_seen_at", { ascending: false })
      .limit(30);
    rows = (data ?? []) as Array<Record<string, unknown>>;
  } else {
    if (!actorHasOpsPermission(assignments, "security.read")) redirect("/ops");
    title = "Security events";
    const { data } = await admin
      .from("security_events")
      .select("id, event_type, severity, summary, created_at")
      .order("created_at", { ascending: false })
      .limit(30);
    rows = (data ?? []) as Array<Record<string, unknown>>;
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <p className="text-sm text-neutral-500">
        <Link href="/ops" className="underline">
          Ops
        </Link>{" "}
        / {title}
      </p>
      <h1 className="mt-2 text-2xl font-semibold">{title}</h1>
      <p className="mt-1 text-xs text-neutral-500">
        Auto risk action limited to flag_only · no Phase 13 case CRM
      </p>
      <nav className="mt-4 flex flex-wrap gap-3 text-sm">
        {["security", "audit", "risk", "holds", "alerts"].map((t) => (
          <Link key={t} className="underline" href={`/ops/security?tab=${t}`}>
            {t}
          </Link>
        ))}
      </nav>
      <ul className="mt-6 space-y-2 text-sm">
        {rows.length === 0 ? (
          <li className="text-neutral-600">No rows.</li>
        ) : (
          rows.map((row) => (
            <li
              key={String(row.id)}
              className="rounded border border-neutral-200 p-3 font-mono text-xs"
            >
              <pre className="whitespace-pre-wrap break-all">
                {JSON.stringify(row, null, 2)}
              </pre>
            </li>
          ))
        )}
      </ul>
    </main>
  );
}
