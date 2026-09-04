import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { OpsKpiStrip } from "@/components/ops/OpsKpiStrip";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { loadOpsDashboardCards } from "@/lib/frontend/ops/reads";
import { OPS_ROLE_LABELS } from "@/lib/frontend/ops/format";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Platform Ops · GCE",
};

/** OPS-12 — Platform Ops dashboard (RM/PRM/Expert scoped via workspace). */
export default async function PlatformOpsDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/platform-ops");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: "platform-ops",
  });
  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const canDash = actorHasOpsAdminPermission(assignments, "ops.dashboard");
  const isRm = assignments.some((a) => a.roleKey === "relationship_manager");
  const isPrm = assignments.some(
    (a) => a.roleKey === "platform_relationship_manager"
  );
  const isExpert = assignments.some(
    (a) => a.roleKey === "enterprise_platform_expert"
  );

  const roleLabel = isPrm
    ? OPS_ROLE_LABELS.prm
    : isRm
      ? OPS_ROLE_LABELS.rm
      : isExpert
        ? "Platform Expert"
        : OPS_ROLE_LABELS.platform;


  if (!canDash && !identity.workspaces.includes("platform-ops")) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title={roleLabel} />
        <EmptyState
          title="Platform Ops access required"
          description="Requires an ops-capable assignment. No Super Admin shortcut."
        />
      </div>
    );
  }

  const cards = canDash
    ? await loadOpsDashboardCards(createPrivilegedSupabaseClient())
    : null;

  const items = [
    { id: "ops", title: "Ops control plane", href: "/ops" },
    actorHasOpsAdminPermission(assignments, "ops.approvals.review")
      ? { id: "ap", title: "Approvals", href: "/ops/approvals" }
      : null,
    actorHasOpsAdminPermission(assignments, "ops.connect")
      ? { id: "co", title: "Connect Ops", href: "/ops/connect" }
      : null,
    actorHasOpsAdminPermission(assignments, "ops.marketplace")
      ? { id: "m", title: "Marketplace Ops", href: "/ops/marketplace" }
      : null,
    actorHasOpsAdminPermission(assignments, "ops.enterprise")
      ? { id: "e", title: "Enterprise Ops", href: "/ops/enterprise" }
      : null,
    isExpert
      ? { id: "ex", title: "Expert overview", href: "/enterprise-expert" }
      : null,
    actorHasOpsAdminPermission(assignments, "ops.rm")
      ? {
          id: "rm",
          title: "RM scoped cases",
          href: "/ops/cases",
          description: "No automatic commission",
        }
      : null,
  ].filter(Boolean) as Array<{
    id: string;
    title: string;
    href: string;
    description?: string;
  }>;

  return (
    <div className="space-y-6">
      <PageHeader
        title={roleLabel}
        description="Scoped operational home. RM/PRM do not inherit Finance, Compliance, or Platform Admin powers. No mega-admin."
      />
      {cards ? (
        <OpsKpiStrip
          items={[
            {
              label: "Approvals",
              value: cards.pendingApprovals,
              href: "/ops/approvals",
            },
            {
              label: "Exceptions",
              value: cards.openExceptions,
              href: "/ops/exceptions",
            },
            { label: "Cases", value: cards.openCases, href: "/ops/cases" },
            {
              label: "Incidents",
              value: cards.openIncidents,
              href: "/ops/incidents",
            },
          ]}
        />
      ) : null}
      <PartnerActionCenter title="Scoped actions" items={items} />
      <Button asChild variant="outline" size="sm">
        <Link href="/ops">Open Ops shell</Link>
      </Button>
    </div>
  );
}
