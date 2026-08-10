import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsQueueCard } from "@/components/ops/OpsQueueCard";
import { DeskReviewActions } from "@/components/ops/DeskReviewActions";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasLeadPermission,
  getOpportunityDeskQueue,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { DESK_COPY, maskContactHint } from "@/lib/frontend/ops/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Desk queue · GCE",
};

/** DESK-02 */
export default async function DeskQueuePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/desk/queue");

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
        <PageHeader title="Desk queue" />
        <EmptyState
          title="Desk review permission required"
          description="lead.desk.review is required. Circle-first routing remains canonical."
        />
      </main>
    );
  }

  let queue: Awaited<ReturnType<typeof getOpportunityDeskQueue>> = [];
  try {
    queue = await getOpportunityDeskQueue(createPrivilegedSupabaseClient());
  } catch {
    queue = [];
  }

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Opportunity Desk queue"
        description={`${DESK_COPY.fallbackOnly} ${DESK_COPY.candidateNotAssignment} ${DESK_COPY.contactReveal}`}
        breadcrumbs={[
          { label: "Desk", href: "/dashboard/opportunity-desk" },
          { label: "Queue" },
        ]}
        primaryAction={
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/opportunity-desk">Desk home</Link>
          </Button>
        }
      />
      {queue.length === 0 ? (
        <EmptyState
          title="No open desk items"
          description="Desk only receives unrouted / escalated opportunities."
        />
      ) : (
        <ul className="space-y-4">
          {queue.map((item) => {
            const leadRaw = item.assist_leads as
              | {
                  id: string;
                  lead_ref?: string;
                  title: string;
                  work_status: string;
                  privacy_level?: string;
                }
              | null
              | Array<{
                  id: string;
                  lead_ref?: string;
                  title: string;
                  work_status: string;
                  privacy_level?: string;
                }>;
            const lead = Array.isArray(leadRaw) ? leadRaw[0] : leadRaw;
            const safe = lead
              ? presentLeadPrivacySafe({
                  id: lead.id,
                  title: lead.title,
                  work_status: lead.work_status,
                })
              : null;
            return (
              <li key={item.id} className="space-y-2">
                <OpsQueueCard
                  title={safe?.title ?? "Lead"}
                  status={item.status}
                  summary={item.reason ?? item.notes ?? undefined}
                  meta={[
                    item.priority ?? "normal",
                    lead?.lead_ref,
                    safe ? maskContactHint(safe.contactAvailable) : null,
                  ]
                    .filter(Boolean)
                    .join(" · ")}
                  href={lead ? `/desk/leads/${lead.id}` : undefined}
                />
                <DeskReviewActions
                  queueId={item.id}
                  leadTitle={safe?.title ?? "Lead"}
                />
              </li>
            );
          })}
        </ul>
      )}
    </main>
  );
}
