import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { AuditTimeline } from "@/components/ops/AuditTimeline";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsPermission,
  searchAuditEvents,
} from "@/lib/architecture/ops-governance";
import { loadRiskSignals } from "@/lib/frontend/ops/reads";
import { GCE_SPACING } from "@/lib/frontend/design-language";

type PageProps = { searchParams: Promise<{ tab?: string }> };

export const metadata = {
  robots: { index: false, follow: false },
  title: "Security · Ops · GCE",
};

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

  const tabs = [
    { id: "security", label: "Security", perm: "security.read" as const },
    { id: "audit", label: "Audit", perm: "audit.search" as const },
    { id: "risk", label: "Risk", perm: "risk.review" as const },
    { id: "holds", label: "Holds", perm: "compliance.hold" as const },
    { id: "alerts", label: "Alerts", perm: "alerts.manage" as const },
  ];

  let title = "Security";
  const description =
    "Review-only surfaces unless a backend action exists for your role. No AI-only enforcement.";

  if (tab === "audit") {
    if (!actorHasOpsPermission(assignments, "audit.search")) redirect("/ops");
    title = "Audit search";
    const rows = await searchAuditEvents(admin, { limit: 40 });
    return (
      <main className={GCE_SPACING.section}>
        <Header title={title} description={description} tabs={tabs} tab={tab} />
        <AuditTimeline
          title="Recent audit events"
          events={rows.map((r) => ({
            id: String(r.id ?? ""),
            action: String(r.action ?? "event"),
            actor_user_id: (r.actor_user_id as string) ?? null,
            resource_type: (r.resource_type as string) ?? null,
            resource_id: (r.resource_id as string) ?? null,
            created_at: (r.occurred_at as string) ?? undefined,
            summary: (r.reason as string) ?? null,
          }))}
        />
      </main>
    );
  }

  if (tab === "risk") {
    if (!actorHasOpsPermission(assignments, "risk.review")) redirect("/ops");
    title = "Risk signals";
    const data = await loadRiskSignals(admin);
    return (
      <main className={GCE_SPACING.section}>
        <Header title={title} description={description} tabs={tabs} tab={tab} />
        {data.length === 0 ? (
          <EmptyState
            title="No open risk signals"
            description="Risk review is assistive — not automatic ban enforcement."
          />
        ) : (
          <ul className="space-y-3">
            {data.map((r) => (
              <li key={r.id}>
                <OpsQueueCard
                  title={r.signal_type}
                  summary={r.recommendation}
                  status={r.review_status}
                  meta={`${r.category}${r.auto_action_applied ? " · auto_action_recorded" : " · no auto-ban"}`}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }

  if (tab === "holds") {
    if (!actorHasOpsPermission(assignments, "compliance.hold")) redirect("/ops");
    redirect("/compliance/holds");
  }

  if (tab === "alerts") {
    if (!actorHasOpsPermission(assignments, "alerts.manage")) redirect("/ops");
    title = "Operational alerts";
    const { data } = await admin
      .from("operational_alerts")
      .select(
        "id, alert_key, severity, title, status, occurrence_count, last_seen_at"
      )
      .eq("status", "open")
      .order("last_seen_at", { ascending: false })
      .limit(30);
    return (
      <main className={GCE_SPACING.section}>
        <Header title={title} description={description} tabs={tabs} tab={tab} />
        {(data ?? []).length === 0 ? (
          <EmptyState title="No open alerts" description="Queue is clear." />
        ) : (
          <ul className="space-y-3">
            {(data ?? []).map((a) => (
              <li key={a.id}>
                <OpsQueueCard
                  title={a.title}
                  status={a.status}
                  meta={`${a.alert_key} · ${a.severity} · x${a.occurrence_count}`}
                />
              </li>
            ))}
          </ul>
        )}
      </main>
    );
  }

  if (!actorHasOpsPermission(assignments, "security.read")) redirect("/ops");
  const { data } = await admin
    .from("security_events")
    .select("id, event_type, severity, summary, created_at")
    .order("created_at", { ascending: false })
    .limit(30);

  return (
    <main className={GCE_SPACING.section}>
      <Header title={title} description={description} tabs={tabs} tab={tab} />
      {(data ?? []).length === 0 ? (
        <EmptyState
          title="No security events"
          description="Events appear when recorded by the ops-governance pipeline."
        />
      ) : (
        <ul className="space-y-3">
          {(data ?? []).map((e) => (
            <li key={e.id}>
              <OpsQueueCard
                title={e.event_type}
                summary={e.summary}
                status={e.severity}
                meta={e.created_at}
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}

function Header({
  title,
  description,
  tabs,
  tab,
}: {
  title: string;
  description: string;
  tabs: Array<{ id: string; label: string; perm: string }>;
  tab: string;
}) {
  return (
    <>
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={[
          { label: "Ops", href: "/ops" },
          { label: "Security" },
        ]}
      />
      <div className="flex flex-wrap gap-2">
        {tabs.map((t) => (
          <Button
            key={t.id}
            asChild
            size="sm"
            variant={tab === t.id ? "default" : "outline"}
          >
            <Link href={`/ops/security?tab=${t.id}`}>{t.label}</Link>
          </Button>
        ))}
      </div>
    </>
  );
}
