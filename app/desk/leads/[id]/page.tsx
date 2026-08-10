import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { EmptyState } from "@/components/states/EmptyState";
import { StatusBadge } from "@/components/states/StatusBadge";
import { Button } from "@/components/ui/button";
import { GCE_RADIUS, GCE_SURFACE, GCE_SPACING } from "@/lib/frontend/design-language";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasLeadPermission,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import {
  DESK_COPY,
  maskContactHint,
  opsStatusTone,
} from "@/lib/frontend/ops/format";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { cn } from "@/lib/utils";

type PageProps = { params: Promise<{ id: string }> };

export const metadata = {
  robots: { index: false, follow: false },
  title: "Desk lead · GCE",
};

/** DESK-03 — privacy-safe lead detail for desk. */
export default async function DeskLeadDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=/desk/leads/${id}`);

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const allowed = workspacesForAssignments(assignments);
  const can = actorHasLeadPermission(assignments, "lead.desk.review");

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="opportunity-desk"
      allowedWorkspaces={
        allowed.includes("opportunity-desk")
          ? allowed
          : [...allowed, "opportunity-desk"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Opportunity Desk"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!can) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <EmptyState
          title="Desk access required"
          description="Contact reveal and assignment remain server-authorized."
        />
      </main>
    );
  }

  const admin = createPrivilegedSupabaseClient();
  const { data: lead } = await admin
    .from("assist_leads")
    .select(
      "id, lead_ref, title, work_status, city, state, urgency, privacy_level, contact_reveal_state, requirement_summary"
    )
    .eq("id", id)
    .maybeSingle();
  if (!lead) notFound();

  const safe = presentLeadPrivacySafe(lead);
  const { data: routing } = await admin
    .from("assist_opportunity_desk_queue")
    .select("id, status, reason, priority, created_at, notes")
    .eq("lead_id", id)
    .order("created_at", { ascending: false })
    .limit(5);

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title={safe.title}
        description={`${DESK_COPY.contactReveal} ${DESK_COPY.paidOff}`}
        breadcrumbs={[
          { label: "Queue", href: "/desk/queue" },
          { label: lead.lead_ref ?? id.slice(0, 8) },
        ]}
        status={{
          label: safe.workStatus,
          tone: opsStatusTone(safe.workStatus),
        }}
        primaryAction={
          <Button asChild variant="outline" size="sm">
            <Link href="/desk/queue">Back to queue</Link>
          </Button>
        }
      />
      <section
        className={cn(GCE_RADIUS.card, GCE_SURFACE.card, GCE_SPACING.cardPad)}
      >
        <p className="text-sm text-foreground">
          {lead.requirement_summary ?? "No summary provided."}
        </p>
        <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-xs text-muted-foreground">Geography</dt>
            <dd>
              {[safe.city, safe.state].filter(Boolean).join(", ") || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Urgency</dt>
            <dd>{safe.urgency}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Contact</dt>
            <dd>{maskContactHint(safe.contactAvailable)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Privacy</dt>
            <dd>{lead.privacy_level ?? "standard"}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-muted-foreground">
          {DESK_COPY.candidateNotAssignment} Raw email/phone are never rendered
          on this page.
        </p>
      </section>
      <section className="space-y-2">
        <h2 className="text-sm font-semibold">Routing history</h2>
        {(routing ?? []).length === 0 ? (
          <p className="text-sm text-muted-foreground">No desk queue rows.</p>
        ) : (
          <ul className="space-y-2">
            {(routing ?? []).map((r) => (
              <li
                key={r.id}
                className={cn(
                  GCE_RADIUS.card,
                  GCE_SURFACE.muted,
                  "flex items-start justify-between gap-2 p-3 text-sm"
                )}
              >
                <span>
                  {r.reason ?? r.notes ?? "—"}
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {r.priority ?? "normal"} · {r.created_at}
                  </span>
                </span>
                <StatusBadge label={r.status} tone={opsStatusTone(r.status)} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
