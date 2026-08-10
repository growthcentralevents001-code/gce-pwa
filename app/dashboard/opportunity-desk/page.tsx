import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasLeadPermission } from "@/lib/architecture/lead-assist";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { DESK_COPY } from "@/lib/frontend/ops/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Opportunity Desk · GCE",
};

/** DESK-01 */
export default async function OpportunityDeskDashboardPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard/opportunity-desk");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const allowed = workspacesForAssignments(assignments);
  const can =
    actorHasLeadPermission(assignments, "lead.desk.review") ||
    allowed.includes("opportunity-desk");

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
        <PageHeader title="Opportunity Desk" />
        <EmptyState
          title="Desk access required"
          description="Requires opportunity_desk (lead.desk.review). Not a general sales CRM."
        />
      </main>
    );
  }

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Opportunity Desk"
        description={`${DESK_COPY.fallbackOnly} ${DESK_COPY.paidOff}`}
      />
      <PartnerActionCenter
        items={[
          {
            id: "queue",
            title: "Desk queue",
            href: "/desk/queue",
            description: DESK_COPY.candidateNotAssignment,
          },
        ]}
      />
      <Button asChild variant="outline" size="sm">
        <Link href="/desk/queue">Open queue</Link>
      </Button>
    </main>
  );
}
