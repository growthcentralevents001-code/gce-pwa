import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import { PartnerActionCenter } from "@/components/partner/PartnerActionCenter";
import { EmptyState } from "@/components/states/EmptyState";
import { Button } from "@/components/ui/button";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasLeadPermission } from "@/lib/architecture/lead-assist";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { DESK_COPY } from "@/lib/frontend/ops/format";

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


  if (!can) {
    return (
      <div className="mx-auto max-w-3xl">
        <PageHeader title="Opportunity Desk" />
        <EmptyState
          title="Desk access required"
          description="Requires opportunity_desk (lead.desk.review). Not a general sales CRM."
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
    </div>
  );
}
