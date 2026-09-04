import Link from "next/link";
import { redirect } from "next/navigation";
import {
  PartnerPageHeader,
  Timeline,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { EbdpPackCard } from "@/components/enterprise/EbdpPackCard";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadEnterpriseBdpBundle } from "@/lib/frontend/enterprise/reads";
import {
  EBDP_ENTITLEMENT_COPY,
  ENTERPRISE_BDP_ROLE_LABEL,
} from "@/lib/frontend/enterprise/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Enterprise BDP · GCE",
};

/** EBDP-01 — Enterprise BDP overview (Checkpoint C) */
export default async function EnterpriseBdpDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/enterprise-bdp");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "enterprise-bdp",
  });
  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadEnterpriseBdpBundle(supabase, admin, user.id).catch(
    () => null
  );


  if (!identity.workspaces.includes("enterprise-bdp") && !bundle?.pack) {
    return (
      <div className="mx-auto max-w-3xl">
        <PartnerPageHeader
          title={ENTERPRISE_BDP_ROLE_LABEL}
          description="Client-based attribution — no territory ownership. Entitlement is 25% of eligible GCE platform commission."
        />
        <EmptyState
          title="No Enterprise BDP pack yet"
          description="Apply for a Franchise Pack. Platform activates packs — roles are never self-granted."
          primaryAction={{ label: "Apply", href: "/enterprise-bdp/apply" }}
        />
      </div>
    );
  }

  if (!bundle?.pack || !bundle.report) {
    return (
      <div className="mx-auto max-w-3xl">
        <PartnerPageHeader title={ENTERPRISE_BDP_ROLE_LABEL} />
        <EmptyState
          title="Start your application"
          primaryAction={{ label: "Apply", href: "/enterprise-bdp/apply" }}
        />
      </div>
    );
  }

  const { report, opportunities, attributions } = bundle;
  const stages = [
    {
      id: "open",
      label: "Open / qualifying",
      count: opportunities.filter((o) =>
        ["open", "qualifying"].includes(String(o.status))
      ).length,
      description: "Attributed-client opportunities only.",
    },
    {
      id: "proposal",
      label: "Proposal / quoting",
      count: opportunities.filter((o) =>
        ["proposal_in_progress", "quoting"].includes(String(o.status))
      ).length,
    },
    {
      id: "proposed_attr",
      label: "Proposed attributions",
      count: attributions.filter((a) => a.status === "proposed").length,
      description: "Awaiting Platform activation — propose ≠ claim.",
    },
  ];

  const actions = [
    ...(report.applicationStatus !== "active"
      ? [
          {
            id: "pack",
            title: "Pack activation pending",
            description: String(report.applicationStatus).replace(/_/g, " "),
            href: "/enterprise-bdp/apply",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.proposedAttributions > 0
      ? [
          {
            id: "attr",
            title: "Attributions awaiting Platform",
            description: `${report.proposedAttributions} proposed`,
            href: "/enterprise-bdp/clients",
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
            href: "/enterprise-bdp/disputes",
            severity: "critical" as const,
          },
        ]
      : []),
  ];

  return (
    <div className="space-y-6">
      <PartnerPageHeader
        title={ENTERPRISE_BDP_ROLE_LABEL}
        description="Client-based attribution. No city or zone ownership."
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/enterprise-bdp/pipeline">Pipeline</Link>
          </Button>
        }
      />
      <PartnerStatusStrip
        items={[
          {
            id: "pack",
            label: "Pack",
            value: report.applicationStatus.replace(/_/g, " "),
            tone: report.applicationStatus === "active" ? "success" : "pending",
          },
          {
            id: "clients",
            label: "Active clients",
            value: `${report.activeClientCount} / ${report.clientsCapacity}`,
          },
          {
            id: "attr",
            label: "Attribution model",
            value: "Client-based",
            tone: "info",
          },
        ]}
      />
      <div className="mb-6">
        <PartnerActionCenter items={actions} />
      </div>
      <div className="mb-6">
        <PartnerPipelineList title="Pipeline snapshot" stages={stages} />
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <EbdpPackCard
          packageOption={report.packageOption}
          applicationStatus={report.applicationStatus}
          activeClientCount={report.activeClientCount}
          clientsCapacity={report.clientsCapacity}
          remainingRecoverableMinor={report.remainingRecoverableMinor}
        />
        <PartnerCommercialSummary
          title="Entitlement summary"
          rows={[
            {
              id: "gross",
              label: "Gross EBDP entitlement (backend)",
              amountMinor: report.grossEligibleCommissionMinor,
              emphasize: true,
              hint: "Sum of backend entitlement rows — not project value × 25%.",
            },
            {
              id: "projects",
              label: "Active projects",
              value: String(report.activeProjects),
            },
            {
              id: "opps",
              label: "Open opportunities",
              value: String(report.openOpportunities),
            },
          ]}
          footerNote={EBDP_ENTITLEMENT_COPY}
        />
      </div>
      <Timeline
        items={opportunities.slice(0, 5).map((o) => ({
          id: String(o.id),
          title: String(o.title ?? "Opportunity"),
          description: String(o.status ?? "").replace(/_/g, " "),
          at: typeof o.created_at === "string" ? o.created_at : null,
        }))}
      />
    </div>
  );
}
