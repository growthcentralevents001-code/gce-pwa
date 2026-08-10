import Link from "next/link";
import { redirect } from "next/navigation";
import {
  CircleDollarSign,
  FileCheck,
  Scale,
  Shield,
  Target,
  Users,
} from "lucide-react";
import {
  PartnerPageHeader,
  KpiCard,
  Timeline,
} from "@/components/partner";
import { PartnerStatusStrip } from "@/components/partner/PartnerStatusStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerCommercialSummary } from "@/components/partner/PartnerCommercialSummary";
import { FeatureGated } from "@/components/states/FeatureGated";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { actorHasFinancePermission } from "@/lib/architecture/finance/permissions";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { loadFinanceBundle } from "@/lib/frontend/finance/reads";
import {
  FINANCE_ROLE_LABEL,
  PAYMENT_VS_REVENUE_COPY,
  PAYOUT_GATED_COPY,
  SETTLEMENT_GATED_COPY,
  formatMinorInr,
  moneyFlagIsOff,
} from "@/lib/frontend/finance/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Finance · GCE",
};

/** FIN-01 — Finance overview (Checkpoint C, dense) */
export default async function FinanceDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/finance");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "finance",
  });
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);
  const canRead = actorHasFinancePermission(
    entitlements.activeAssignments,
    "finance.report.read"
  );

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="finance"
      allowedWorkspaces={
        allowed.includes("finance") ? allowed : [...allowed, "finance"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel={FINANCE_ROLE_LABEL}
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!canRead && !identity.workspaces.includes("finance")) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={FINANCE_ROLE_LABEL} />
        <EmptyState
          title="Finance access required"
          description="This workspace requires finance.report.read. Contact Platform Ops if you expect an assignment."
        />
      </main>
    );
  }

  const admin = createPrivilegedSupabaseClient();
  const bundle = await loadFinanceBundle(admin).catch(() => null);
  if (!bundle?.report) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PartnerPageHeader title={FINANCE_ROLE_LABEL} />
        <EmptyState title="Finance report unavailable" />
      </main>
    );
  }

  const { report } = bundle;
  const settlementOff = moneyFlagIsOff(report.moneyFlags, "settlement_execution");
  const payoutOff = moneyFlagIsOff(report.moneyFlags, "payout_execution");

  const actions = [
    ...(report.reconciliationExceptions > 0
      ? [
          {
            id: "recon",
            title: "Reconciliation exceptions",
            description: `${report.reconciliationExceptions} in exception queue`,
            href: "/finance/reconciliation",
            severity: "critical" as const,
          },
        ]
      : []),
    ...(report.activeHolds > 0
      ? [
          {
            id: "holds",
            title: "Active holds",
            description: `${report.activeHolds} active`,
            href: "/finance/holds",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.offlineUnmatched > 0
      ? [
          {
            id: "offline",
            title: "Unmatched offline payments",
            description: `${report.offlineUnmatched} unmatched`,
            href: "/finance/offline",
            severity: "warning" as const,
          },
        ]
      : []),
    ...(report.settlementEligibleEntitlements > 0
      ? [
          {
            id: "settle",
            title: "Settlement-eligible entitlements",
            description: `${report.settlementEligibleEntitlements} ready for batch review`,
            href: "/finance/settlements",
            severity: "info" as const,
          },
        ]
      : []),
  ];

  return shell(
    <main
      className={`mx-auto max-w-6xl px-4 py-8 pb-16 ${GCE_SPACING.section}`}
    >
      <PartnerPageHeader
        title={FINANCE_ROLE_LABEL}
        description={`${PAYMENT_VS_REVENUE_COPY} ${report.note}`}
        actions={
          <Button asChild variant="outline" className="min-h-11">
            <Link href="/finance/reconciliation">Reconciliation</Link>
          </Button>
        }
      />
      <PartnerStatusStrip
        items={[
          {
            id: "settlement",
            label: "Settlement execution",
            value: settlementOff ? "OFF" : "ON",
            tone: settlementOff ? "neutral" : "warning",
          },
          {
            id: "payout",
            label: "Payout execution",
            value: payoutOff ? "OFF" : "ON",
            tone: payoutOff ? "neutral" : "warning",
          },
          {
            id: "principle",
            label: "Principle",
            value: "Payment ≠ revenue",
            tone: "info",
          },
        ]}
      />
      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          label="Recognised components"
          value={String(report.recognisedRevenueComponents)}
          icon={CircleDollarSign}
          href="/finance/revenue"
        />
        <KpiCard
          label="Pending entitlements"
          value={String(report.pendingEntitlements)}
          icon={Users}
          href="/finance/entitlements"
        />
        <KpiCard
          label="Active holds"
          value={String(report.activeHolds)}
          icon={Shield}
          href="/finance/holds"
        />
        <KpiCard
          label="Payout-ready"
          value={String(report.payoutReadyItems)}
          icon={Target}
          href="/finance/payout-readiness"
          hint="Execution gated"
        />
      </div>
      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <PartnerCommercialSummary
          title="Entitlement totals (backend)"
          rows={[
            {
              id: "connect",
              label: "Connect gross",
              amountMinor: report.totals.connectGross,
            },
            {
              id: "marketplace",
              label: "Marketplace gross",
              amountMinor: report.totals.marketplaceGross,
            },
            {
              id: "enterprise",
              label: "Enterprise gross",
              amountMinor: report.totals.enterpriseGross,
            },
            {
              id: "recovery",
              label: "Recoveries (gross − net)",
              amountMinor: report.totals.recoveries,
              hint: "Separate from gross",
            },
            {
              id: "net",
              label: "Net settlement-eligible",
              amountMinor: report.totals.netSettlementEligible,
              emphasize: true,
            },
          ]}
          footerNote="Totals from stakeholder_entitlements. Not client-side commission calculation."
        />
        <PartnerActionCenter items={actions} />
      </div>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          label="Settlement batches"
          value={String(report.settlementBatches)}
          icon={FileCheck}
          href="/finance/settlements"
        />
        <KpiCard
          label="Recon exceptions"
          value={String(report.reconciliationExceptions)}
          icon={Scale}
          href="/finance/reconciliation"
        />
        <KpiCard
          label="Offline unmatched"
          value={String(report.offlineUnmatched)}
          href="/finance/offline"
        />
        <KpiCard
          label="Reversals"
          value={String(report.reversals)}
          href="/finance/entitlements"
        />
      </div>
      {settlementOff ? (
        <FeatureGated
          className="mb-4"
          title="Settlement execution"
          description={SETTLEMENT_GATED_COPY}
          mode="disabled_in_environment"
        />
      ) : null}
      {payoutOff ? (
        <FeatureGated
          className="mb-4"
          title="Payout execution"
          description={PAYOUT_GATED_COPY}
          mode="disabled_in_environment"
        />
      ) : null}
      <Timeline
        items={[
          {
            id: "net",
            title: `Net settlement-eligible ${formatMinorInr(report.totals.netSettlementEligible)}`,
            description: "Backend aggregate",
            tone: "success",
          },
          {
            id: "holds",
            title: `${report.activeHolds} active holds`,
            description: "Review before settlement",
            tone: "warning",
          },
          {
            id: "exceptions",
            title: `${report.reconciliationExceptions} reconciliation exceptions`,
            description: "Do not auto-adjust client-side",
            tone: "pending",
          },
        ]}
      />
    </main>
  );
}
