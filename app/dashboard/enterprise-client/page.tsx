import Link from "next/link";
import { redirect } from "next/navigation";
import { CircleDollarSign, Scale, Target } from "lucide-react";
import {
  PartnerPageHeader,
  KpiCard,
  Timeline,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { EnterpriseRelationshipCard } from "@/components/enterprise/EbdpPackCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { FeatureGated } from "@/components/states/FeatureGated";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadEnterpriseClientBundle } from "@/lib/frontend/enterprise/reads";
import {
  ENTERPRISE_CLIENT_ROLE_LABEL,
  GCE_EXECUTION_ROLE_COPY,
  ORG_VS_REP_COPY,
} from "@/lib/frontend/enterprise/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Enterprise Client · GCE",
};

/** ECL-01 — Enterprise Client overview (Checkpoint C) */
export default async function EnterpriseClientDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/enterprise-client");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "enterprise-client",
  });
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseClientBundle(supabase, admin, user.id).catch(
    () => null
  );

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="enterprise-client"
      allowedWorkspaces={
        allowed.includes("enterprise-client")
          ? allowed
          : [...allowed, "enterprise-client"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Enterprise Client Representative"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!identity.workspaces.includes("enterprise-client") && !bundle?.client) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader
          title={ENTERPRISE_CLIENT_ROLE_LABEL}
          description={ORG_VS_REP_COPY}
        />
        <EmptyState
          title="No Enterprise Client organisation linked"
          description="Ask Platform Ops to link your representative assignment, or start an Enterprise enquiry."
          primaryAction={{ label: "Enterprise signup", href: "/enterprise/signup" }}
        />
      </main>
    );
  }

  if (!bundle?.client || !bundle.report) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={ENTERPRISE_CLIENT_ROLE_LABEL} />
        <EmptyState
          title="Organisation profile pending"
          description="Your representative account is active, but no client organisation is linked yet."
          primaryAction={{ label: "Signup", href: "/enterprise/signup" }}
        />
      </main>
    );
  }

  const { report, opportunities, quotes, projects, disputes } = bundle;
  const stages = [
    {
      id: "open",
      label: "Open / qualifying",
      count: opportunities.filter((o) =>
        ["open", "qualifying"].includes(String(o.status))
      ).length,
    },
    {
      id: "proposal",
      label: "Proposal / quoting",
      count: opportunities.filter((o) =>
        ["proposal_in_progress", "quoting"].includes(String(o.status))
      ).length,
    },
    {
      id: "closed",
      label: "Won / closed",
      count: opportunities.filter((o) =>
        ["won", "lost", "cancelled", "archived"].includes(String(o.status))
      ).length,
    },
  ];

  const actions = [
    ...(report.quotesAwaitingAcceptance > 0
      ? [
          {
            id: "quotes",
            title: "Quotes awaiting review",
            description: `${report.quotesAwaitingAcceptance} quote(s) issued`,
            href: "/enterprise/quotes",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.milestonesDue > 0
      ? [
          {
            id: "milestones",
            title: "Milestones need attention",
            description: `${report.milestonesDue} due or submitted`,
            href: "/enterprise/projects",
            severity: "info" as const,
          },
        ]
      : []),
    ...(report.openDisputes > 0
      ? [
          {
            id: "disputes",
            title: "Open disputes",
            description: `${report.openDisputes} active`,
            href: "/enterprise/disputes",
            severity: "critical" as const,
          },
        ]
      : []),
  ];

  return shell(
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title={report.displayName}
        description={`${ENTERPRISE_CLIENT_ROLE_LABEL} · ${ORG_VS_REP_COPY}`}
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/enterprise/projects">View projects</Link>
          </Button>
        }
      />
      <PartnerStatusStrip
        items={[
          {
            id: "status",
            label: "Organisation",
            value: report.status.replace(/_/g, " "),
            tone: report.status === "active" ? "success" : "neutral",
          },
          {
            id: "engagement",
            label: "Engagement",
            value: report.engagementStatus.replace(/_/g, " "),
          },
          {
            id: "rep",
            label: "Acting as",
            value: "Client representative",
            tone: "info",
          },
        ]}
      />
      <EnterpriseRelationshipCard
        organisationName={report.displayName}
        representativeNote={ORG_VS_REP_COPY}
        className="mb-6"
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Opportunities"
          value={String(report.opportunities)}
          icon="target"
        />
        <KpiCard
          label="Quotes awaiting"
          value={String(report.quotesAwaitingAcceptance)}
          icon="circle-dollar"
        />
        <KpiCard
          label="Projects"
          value={String(report.projects)}
          icon="briefcase"
        />
        <KpiCard
          label="Milestones due"
          value={String(report.milestonesDue)}
          icon="file-check"
        />
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <PartnerActionCenter items={actions} />
        <PartnerPipelineList title="Opportunity stages" stages={stages} />
      </div>
      <p className="mb-6 text-xs text-muted-foreground">{GCE_EXECUTION_ROLE_COPY}</p>
      <FeatureGated
        title="Representative management"
        description="Invite/remove representatives uses organisation membership services — console incomplete (BG-23)."
        className="mb-6"
      />
      <div className="grid gap-4 lg:grid-cols-2">
        <Timeline
          items={[
            ...quotes.slice(0, 3).map((q) => ({
              id: String(q.id),
              title: `Quote ${String(q.status).replace(/_/g, " ")}`,
              description:
                typeof q.total_proposed_minor === "number"
                  ? "Client-facing amount from backend"
                  : undefined,
              at: typeof q.created_at === "string" ? q.created_at : null,
            })),
            ...projects.slice(0, 2).map((p) => ({
              id: String(p.id),
              title: String(p.title ?? "Project"),
              description: String(p.status ?? "").replace(/_/g, " "),
              at: typeof p.created_at === "string" ? p.created_at : null,
              tone: "success" as const,
            })),
            ...disputes.slice(0, 2).map((d) => ({
              id: String(d.id),
              title: String(d.title ?? "Dispute"),
              description: String(d.status ?? "").replace(/_/g, " "),
              at: typeof d.created_at === "string" ? d.created_at : null,
              tone: "warning" as const,
            })),
          ]}
        />
        <div className="flex flex-col gap-3">
          <Button asChild variant="secondary" className="min-h-11 justify-start">
            <Link href="/enterprise/opportunities">
              <Target className="mr-2 size-4" /> Opportunities
            </Link>
          </Button>
          <Button asChild variant="secondary" className="min-h-11 justify-start">
            <Link href="/enterprise/quotes">
              <CircleDollarSign className="mr-2 size-4" /> Quotes
            </Link>
          </Button>
          <Button asChild variant="secondary" className="min-h-11 justify-start">
            <Link href="/enterprise/disputes">
              <Scale className="mr-2 size-4" /> Disputes
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
