import Link from "next/link";
import { redirect } from "next/navigation";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import {
  PartnerPageHeader,
  KpiCard,
  Timeline,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import type { PartnerActionItem } from "@/components/partner/PartnerActionCenter";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { TargetProgressCard } from "@/components/partner/TargetProgressCard";
import { PartnerPipelineList } from "@/components/partner/PartnerPipelineList";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { loadConnectBdpBundle } from "@/lib/frontend/connect-bdp/reads";
import {
  applicationStatusLabel,
  attributionStatusLabel,
  formatCommissionRateLabel,
  formatMinorInr,
  maintenanceStatusLabel,
  packageOptionLabel,
  CONNECT_BDP_ROLE_LABEL,
  CONNECT_BDP_CIRCLES_PER_UNIT,
} from "@/lib/frontend/partner/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Connect BDP · GCE",
};

/** CBDP-01 — Connect BDP overview (Checkpoint C partner dashboard pattern) */
export default async function ConnectBdpDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/connect-bdp");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "connect-bdp",
  });

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadConnectBdpBundle(supabase, admin, user.id).catch(
    () => null
  );

  if (!identity.workspaces.includes("connect-bdp") && !bundle?.unit) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader
          title={CONNECT_BDP_ROLE_LABEL}
          description="Independent commercial partner workspace for Connect Franchise Units."
        />
        <EmptyState
          title="No Connect BDP workspace yet"
          description="Apply for a Franchise Unit, or ask Platform Ops if you expect an existing assignment."
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
          secondaryAction={{
            label: "Personal workspace",
            href: "/dashboard/personal",
          }}
        />
      </main>
    );
  }

  if (!bundle?.unit || !bundle.report) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={CONNECT_BDP_ROLE_LABEL} />
        <EmptyState
          title="Start your application"
          description="Create a Connect BDP Franchise Unit application to unlock the partner dashboard."
          primaryAction={{ label: "Apply", href: "/connect-bdp/apply" }}
        />
      </main>
    );
  }

  const { unit, report, attributions, disputes } = bundle;
  const attrStages = [
    {
      id: "proposed",
      label: "Proposed",
      count: attributions.filter((a) => a.status === "proposed").length,
      description: "Awaiting platform confirmation — not self-approved.",
    },
    {
      id: "active",
      label: "Attributed",
      count: attributions.filter((a) => a.status === "active").length,
      description: "Valid Connect BDP attribution for commission eligibility.",
    },
    {
      id: "unattributed",
      label: "Organic noted",
      count: attributions.filter((a) => a.status === "unattributed").length,
      description: attributionStatusLabel("unattributed"),
    },
    {
      id: "other",
      label: "Other states",
      count: attributions.filter(
        (a) =>
          !["proposed", "active", "unattributed"].includes(String(a.status))
      ).length,
    },
  ];

  const actions: PartnerActionItem[] = [
    ...(report.applicationStatus !== "active"
      ? [
          {
            id: "activation",
            title: "Activation / package action",
            description: applicationStatusLabel(report.applicationStatus),
            href: "/connect-bdp/unit",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.openDisputes > 0
      ? [
          {
            id: "disputes",
            title: `${report.openDisputes} open dispute(s)`,
            description: "First-level Connect BDP handling required.",
            href: "/connect-bdp/disputes",
            severity: "critical" as const,
            icon: "scale" as const,
          },
        ]
      : []),
    ...(report.maintenanceStatus === "review_required"
      ? [
          {
            id: "maintenance",
            title: "Maintenance review",
            description: maintenanceStatusLabel(report.maintenanceStatus),
            href: "/connect-bdp/targets",
            severity: "warning" as const,
          },
        ]
      : []),
    {
      id: "members",
      title: "Member sourcing",
      description: "Review pipeline and propose attribution.",
      href: "/connect-bdp/members",
      severity: "info" as const,
      icon: "users" as const,
    },
  ];

  const timeline = [
    {
      id: "created",
      title: "Unit created",
      at: unit.created_at ? String(unit.created_at) : null,
      tone: "neutral" as const,
    },
    ...(unit.activated_at
      ? [
          {
            id: "activated",
            title: "Unit activated by Platform",
            at: String(unit.activated_at),
            tone: "success" as const,
          },
        ]
      : []),
    ...(report.targetAchievedAt
      ? [
          {
            id: "target",
            title: "Target achieved",
            at: report.targetAchievedAt,
            tone: "success" as const,
          },
        ]
      : []),
    ...disputes.slice(0, 3).map((d) => ({
      id: String(d.id),
      title: `Dispute: ${String(d.subject ?? "Open")}`,
      at: d.created_at ? String(d.created_at) : null,
      tone: "warning" as const,
    })),
  ];

  return (
    <main className={`mx-auto max-w-6xl px-4 py-8 pb-16 ${GCE_SPACING.section}`}>
      <PartnerPageHeader
        title="Connect BDP overview"
        description="Franchise Unit operations — Circles, attribution, targets, and commercial read-outs. Settlement and payout remain Finance Ops."
        actions={
          <Button asChild className="min-h-11">
            <Link href="/connect-bdp/members">Members</Link>
          </Button>
        }
      />

      <PartnerStatusStrip
        items={[
          {
            id: "app",
            label: "Application",
            value: applicationStatusLabel(report.applicationStatus),
            tone:
              report.applicationStatus === "active" ? "success" : "pending",
          },
          {
            id: "pkg",
            label: "Package",
            value: packageOptionLabel(report.packageOption),
            tone: "info",
          },
          {
            id: "maint",
            label: "Maintenance",
            value: maintenanceStatusLabel(report.maintenanceStatus),
            tone:
              report.maintenanceStatus === "review_required"
                ? "warning"
                : "neutral",
          },
          {
            id: "cap",
            label: "Unit Circle cap",
            value: `${report.activeCirclePortfolio} / ${CONNECT_BDP_CIRCLES_PER_UNIT}`,
            tone: "neutral",
          },
        ]}
      />

      <div className="mb-8">
        <PartnerActionCenter items={actions} />
      </div>

      <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Credited Circles"
          value={`${report.creditedCircles}`}
          hint={`Target ${report.targetCircles} in ${report.targetMonths} months`}
          href="/connect-bdp/targets"
          icon="target"
        />
        <KpiCard
          label="Attributed members"
          value={`${report.attributedMemberships}`}
          href="/connect-bdp/members"
          icon="users"
        />
        <KpiCard
          label="Gross commission"
          value={formatMinorInr(report.grossEligibleCommissionMinor)}
          hint={`${formatCommissionRateLabel()} of attributed eligible revenue`}
          href="/connect-bdp/entitlements"
          icon="circle-dollar"
        />
        <KpiCard
          label="Active Circles"
          value={`${report.activeCirclePortfolio}`}
          href="/connect-bdp/circles"
          icon="git-branch"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <TargetProgressCard
            credited={report.creditedCircles}
            target={report.targetCircles}
            monthsElapsed={report.monthsElapsed}
            targetMonths={report.targetMonths}
            achievedAt={report.targetAchievedAt}
          />
          <PartnerPipelineList
            title="Member attribution pipeline"
            stages={attrStages}
          />
        </div>
        <div className="space-y-6 lg:col-span-2">
          <PartnerCommercialSummary
            rows={[
              {
                id: "gross",
                label: "Gross commission",
                amountMinor: report.grossEligibleCommissionMinor,
                hint: "Server-calculated from entitlements",
              },
              {
                id: "recovery",
                label: "Recovery deductions",
                amountMinor: report.recoveryDeductionsMinor,
                hint: "Separate from gross — finance package recovery",
              },
              {
                id: "net",
                label: "Current payable position",
                amountMinor: report.netPayableCommissionMinor,
                emphasize: true,
                hint: "Display only — settlement/payout not executed here",
              },
              {
                id: "remaining",
                label: "Remaining recoverable",
                amountMinor: report.remainingRecoverableMinor,
              },
            ]}
            footerNote="Gross commission ≠ net payable. Recovery and adjustments are applied by Finance services."
          />
        </div>
      </div>

      <section className="mt-8 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <h2 className="text-base font-semibold">Recent activity</h2>
        <div className="mt-4">
          <Timeline items={timeline} />
        </div>
      </section>
    </main>
  );
}
