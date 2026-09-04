import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmptyState } from "@/components/states/EmptyState";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { OpsKpiStrip, type OpsKpiItem } from "@/components/ops/OpsKpiStrip";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
} from "@/lib/architecture/ops-admin";
import { actorHasOpsPermission } from "@/lib/architecture/ops-governance";
import { loadOpsDashboardCards } from "@/lib/frontend/ops/reads";
import { GCE_SPACING, GCE_SURFACE, GCE_RADIUS } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Operations · GCE",
};

/** OPS-01 — Platform Ops control plane (no mega-admin, no Super Admin). */
export default async function OpsHomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/ops");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const canDash = actorHasOpsAdminPermission(assignments, "ops.dashboard");
  const canSecurity = actorHasOpsPermission(assignments, "security.read");
  const canAudit = actorHasOpsPermission(assignments, "audit.search");
  const canRisk = actorHasOpsPermission(assignments, "risk.review");
  const canHolds = actorHasOpsPermission(assignments, "compliance.hold");
  const canApprovals = actorHasOpsAdminPermission(assignments, "ops.approvals.review");
  const canExceptions = actorHasOpsAdminPermission(assignments, "ops.exceptions.resolve");
  const canCases = actorHasOpsAdminPermission(assignments, "ops.cases.manage");
  const canIncidents = actorHasOpsAdminPermission(assignments, "ops.incident.manage");
  const canSupport = actorHasOpsAdminPermission(assignments, "ops.support");
  const canConnect = actorHasOpsAdminPermission(assignments, "ops.connect");
  const canMarketplace = actorHasOpsAdminPermission(assignments, "ops.marketplace");
  const canEnterprise = actorHasOpsAdminPermission(assignments, "ops.enterprise");
  const canFinance = actorHasOpsAdminPermission(assignments, "ops.finance");
  const canCompliance = actorHasOpsAdminPermission(assignments, "ops.compliance");

  if (!canDash) {
    return (
      <main>
        <PageHeader
          title="Operations"
          description="Scoped operational workspaces. No Super Admin productization."
        />
        <EmptyState
          title="Ops access required"
          description="This control plane requires an active ops-capable role assignment. Sidebar visibility is not authorization."
        />
      </main>
    );
  }

  const admin = createPrivilegedSupabaseClient();
  const cards = await loadOpsDashboardCards(admin);

  const kpiItems: OpsKpiItem[] = cards
    ? [
        {
          label: "Pending approvals",
          value: cards.pendingApprovals,
          href: canApprovals ? "/ops/approvals" : undefined,
          icon: "check-square" as const,
        },
        {
          label: "Open exceptions",
          value: cards.openExceptions,
          href: canExceptions ? "/ops/exceptions" : undefined,
          icon: "alert-triangle" as const,
        },
        {
          label: "Open cases",
          value: cards.openCases,
          href: canCases ? "/ops/cases" : undefined,
          icon: "folder-open" as const,
        },
        {
          label: "Incidents",
          value: cards.openIncidents,
          href: canIncidents ? "/ops/incidents" : undefined,
          icon: "shield" as const,
        },
        {
          label: "Risk signals",
          value: cards.openRiskSignals,
          href: canRisk ? "/ops/security?tab=risk" : undefined,
          icon: "alert-triangle" as const,
          hint: "Review-only unless backend action exists",
        },
        {
          label: "Compliance holds",
          value: cards.activeComplianceHolds,
          href: canHolds || canCompliance ? "/compliance/holds" : undefined,
          icon: "lock" as const,
        },
        {
          label: "Support signals",
          value: cards.supportSignalsQueued,
          href: canSupport ? "/ops/support" : undefined,
          icon: "life-buoy" as const,
        },
        {
          label: "Privacy requests",
          value: cards.privacyRequests,
          href: canCompliance ? "/ops/privacy" : undefined,
          icon: "lock" as const,
        },
      ]
    : [];

  const actions = [
    canApprovals
      ? {
          id: "a",
          title: "Approval queues",
          href: "/ops/approvals",
          description: "SoD enforced",
        }
      : null,
    canExceptions
      ? { id: "e", title: "Exceptions", href: "/ops/exceptions" }
      : null,
    canCases ? { id: "c", title: "Cases", href: "/ops/cases" } : null,
    canIncidents
      ? { id: "i", title: "Incidents", href: "/ops/incidents" }
      : null,
    canConnect
      ? { id: "co", title: "Connect Ops", href: "/ops/connect" }
      : null,
    canMarketplace
      ? { id: "m", title: "Marketplace Ops", href: "/ops/marketplace" }
      : null,
    canEnterprise
      ? { id: "en", title: "Enterprise Ops", href: "/ops/enterprise" }
      : null,
    canFinance
      ? {
          id: "f",
          title: "Finance workspace",
          href: "/dashboard/finance",
          description: "Batch 7 truth — not a second engine",
        }
      : null,
    canCompliance
      ? { id: "cm", title: "Compliance", href: "/ops/compliance" }
      : null,
    canSupport ? { id: "s", title: "Support", href: "/ops/support" } : null,
    canSecurity
      ? { id: "sec", title: "Security events", href: "/ops/security" }
      : null,
    canAudit
      ? { id: "au", title: "Audit search", href: "/ops/security?tab=audit" }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    href: string;
    description?: string;
  }>;

  return (
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Operations control plane"
        description="Scoped Platform / Vertical Ops. No mega-admin. Money and live providers remain OFF. Frontend is not policy authority."
        breadcrumbs={[{ label: "Ops" }]}
      />

      <div
        className={cn(
          GCE_RADIUS.card,
          GCE_SURFACE.glassLight,
          "px-4 py-3 text-sm text-muted-foreground"
        )}
      >
        Role-scoped queues only. Finance write/execution stays in Batch 7 /
        Phase 9 boundaries. Root / emergency admin is not productized here.
      </div>

      <PartnerActionCenter
        title="Needs your attention"
        items={actions}
        emptyLabel="No authorized actions for your current assignments."
      />

      {kpiItems.length > 0 ? <OpsKpiStrip items={kpiItems} /> : null}

      <section className={cn(GCE_RADIUS.card, GCE_SURFACE.card, "p-4")}>
        <h2 className="text-sm font-semibold">Vertical scopes</h2>
        <ul className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
          {[
            canConnect && ["/ops/connect", "Connect Ops"],
            canMarketplace && ["/ops/marketplace", "Marketplace Ops"],
            canEnterprise && ["/ops/enterprise", "Enterprise Ops"],
            canFinance && ["/ops/finance", "Finance Ops entry → Finance workspace"],
          ]
            .filter(Boolean)
            .map((row) => {
              const [href, label] = row as [string, string];
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-primary underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
        </ul>
        <div className="mt-4">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard/platform-ops">Platform Ops dashboard</Link>
          </Button>
        </div>
      </section>
    </main>
  );
}
