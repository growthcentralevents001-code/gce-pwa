import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listMembershipTags } from "@/lib/architecture/connect/tags";
import {
  listConnectBdpUnitsForUser,
  buildConnectBdpDashboard,
} from "@/lib/architecture/connect-bdp";
import {
  listMbdpUnitsForUser,
  buildMbdpDashboard,
} from "@/lib/architecture/marketplace";
import {
  listEbdpPacksForUser,
  buildEbdpDashboard,
  listClientsForRepresentative,
  buildEnterpriseClientDashboard,
  buildExpertDashboard,
} from "@/lib/architecture/enterprise";
import { buildFinanceDashboard } from "@/lib/architecture/finance";
import {
  getMyReceivedLeads,
  getMySentLeads,
  getOpportunityDeskQueue,
  presentLeadPrivacySafe,
} from "@/lib/architecture/lead-assist";
import { getCustomerDashboard } from "@/lib/architecture/customer-cx";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { WorkspaceKeyHomeView } from "@/components/workspace/WorkspaceKeyHomeView";

type PageProps = {
  params: Promise<{ workspaceKey: string }>;
};

/**
 * Canonical workspace shell (ADR-003 / Phase 4–7).
 * Route presence is not authorization — assignment check is enforced server-side.
 */
export default async function WorkspaceDashboardPage({ params }: PageProps) {
  const { workspaceKey } = await params;
  if (!(WORKSPACE_KEYS as readonly string[]).includes(workspaceKey)) {
    notFound();
  }

  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/dashboard/${workspaceKey}`);
  }

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
    requestedWorkspace: workspaceKey,
  });

  const key = workspaceKey as WorkspaceKey;

  if (identity.identitySuspension) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Account suspended</h1>
        <p className="mt-2 text-sm text-neutral-600">
          This identity is under a platform-wide hold. Role workspaces are unavailable
          until the hold is lifted. Contact Compliance / Platform Ops.
        </p>
        <p className="mt-4 text-sm text-red-700">
          Reason: {identity.identitySuspension.reason}
        </p>
      </main>
    );
  }

  const canAccess = identity.workspaces.includes(key);
  const activeCount = identity.entitlements.activeAssignments.length;
  const suspendedCount = identity.entitlements.assignments.filter(
    (a) => a.status === "suspended"
  ).length;

  const showConnectPanel =
    canAccess && (key === "connect-member" || key === "personal");
  let membershipSummary: Array<{
    id: string;
    status: string;
    allocationStatus: string;
    tagCount: number;
  }> = [];
  if (showConnectPanel) {
    try {
      const memberships = await listMembershipsForUser(supabase, user.id);
      membershipSummary = await Promise.all(
        memberships.slice(0, 5).map(async (m) => ({
          id: m.id,
          status: m.status,
          allocationStatus: m.allocationStatus,
          tagCount: (await listMembershipTags(supabase, m.id)).length,
        }))
      );
    } catch {
      membershipSummary = [];
    }
  }

  const showBdpPanel = canAccess && key === "connect-bdp";
  let bdpReports: Array<Awaited<ReturnType<typeof buildConnectBdpDashboard>>> =
    [];
  if (showBdpPanel) {
    try {
      const units = await listConnectBdpUnitsForUser(supabase, user.id);
      bdpReports = await Promise.all(
        units
          .slice(0, 3)
          .map((u) => buildConnectBdpDashboard(supabase, String(u.id)))
      );
    } catch {
      bdpReports = [];
    }
  }

  const showMbdpPanel = canAccess && key === "marketplace-bdp";
  let mbdpReports: Array<Awaited<ReturnType<typeof buildMbdpDashboard>>> = [];
  if (showMbdpPanel) {
    try {
      const units = await listMbdpUnitsForUser(supabase, user.id);
      mbdpReports = await Promise.all(
        units.slice(0, 3).map((u) => buildMbdpDashboard(supabase, String(u.id)))
      );
    } catch {
      mbdpReports = [];
    }
  }

  const showVenuePanel = canAccess && key === "venue";
  // Venue detail reports require venueId — show portfolio hint only to avoid dirty UI routes
  let venueHint =
    "Use check-in, events, and redemptions in the Venue Partner workspace.";
  if (showVenuePanel) {
    venueHint =
      "Venue Partner operations (FD-033/037). Canonical tools are under /venue/* — not legacy /dashboard/venue CRUD.";
  }

  const showEbdpPanel = canAccess && key === "enterprise-bdp";
  let ebdpReports: Array<Awaited<ReturnType<typeof buildEbdpDashboard>>> = [];
  if (showEbdpPanel) {
    try {
      const packs = await listEbdpPacksForUser(supabase, user.id);
      ebdpReports = await Promise.all(
        packs.slice(0, 3).map((p) => buildEbdpDashboard(supabase, String(p.id)))
      );
    } catch {
      ebdpReports = [];
    }
  }

  const showEnterpriseClientPanel = canAccess && key === "enterprise-client";
  let clientReports: Array<
    Awaited<ReturnType<typeof buildEnterpriseClientDashboard>>
  > = [];
  if (showEnterpriseClientPanel) {
    try {
      const clients = await listClientsForRepresentative(supabase, user.id);
      clientReports = await Promise.all(
        clients
          .slice(0, 5)
          .map((c) => buildEnterpriseClientDashboard(supabase, String(c.id)))
      );
    } catch {
      clientReports = [];
    }
  }

  const showExpertPanel =
    canAccess &&
    (key === "platform-ops" || key === "finance") &&
    identity.entitlements.activeAssignments.some(
      (a) =>
        a.roleKey === "enterprise_platform_expert" ||
        a.roleKey === "finance_admin" ||
        a.roleKey === "platform_admin"
    );
  let expertReport: Awaited<ReturnType<typeof buildExpertDashboard>> | null =
    null;
  if (showExpertPanel) {
    try {
      expertReport = await buildExpertDashboard(supabase, user.id);
    } catch {
      expertReport = null;
    }
  }

  const showFinancePanel = canAccess && key === "finance";
  let financeReport: Awaited<ReturnType<typeof buildFinanceDashboard>> | null =
    null;
  if (showFinancePanel) {
    try {
      financeReport = await buildFinanceDashboard(supabase);
    } catch {
      financeReport = null;
    }
  }

  const showLeadAssistPanel =
    canAccess && (key === "connect-member" || key === "personal");
  let sentLeads: Array<ReturnType<typeof presentLeadPrivacySafe>> = [];
  let receivedLeadCount = 0;
  if (showLeadAssistPanel) {
    try {
      const sent = await getMySentLeads(supabase, user.id);
      sentLeads = sent.slice(0, 5).map((l) => presentLeadPrivacySafe(l));
      const received = await getMyReceivedLeads(supabase, user.id);
      receivedLeadCount = received.length;
    } catch {
      sentLeads = [];
      receivedLeadCount = 0;
    }
  }

  const showCustomerCxPanel = canAccess && key === "personal";
  let cxHint: { upcoming: number; claims: number } | null = null;
  if (showCustomerCxPanel) {
    try {
      const dash = await getCustomerDashboard(supabase, user.id);
      cxHint = {
        upcoming: dash.upcomingBookings.length,
        claims: dash.activeClaims.length,
      };
    } catch {
      cxHint = null;
    }
  }

  const showOpportunityDeskPanel = canAccess && key === "opportunity-desk";
  let deskQueue: Awaited<ReturnType<typeof getOpportunityDeskQueue>> = [];
  if (showOpportunityDeskPanel) {
    try {
      deskQueue = await getOpportunityDeskQueue(supabase);
    } catch {
      deskQueue = [];
    }
  }

  return (
    <WorkspaceKeyHomeView
      workspaceKey={key}
      identity={identity}
      canAccess={canAccess}
      activeCount={activeCount}
      suspendedCount={suspendedCount}
      membershipSummary={membershipSummary}
      bdpReports={bdpReports}
      mbdpReports={mbdpReports}
      venueHint={venueHint}
      ebdpReports={ebdpReports}
      clientReports={clientReports}
      expertReport={expertReport}
      financeReport={financeReport}
      sentLeads={sentLeads}
      receivedLeadCount={receivedLeadCount}
      cxHint={cxHint}
      deskQueue={deskQueue}
      showConnectPanel={showConnectPanel}
      showBdpPanel={showBdpPanel}
      showMbdpPanel={showMbdpPanel}
      showVenuePanel={showVenuePanel}
      showEbdpPanel={showEbdpPanel}
      showEnterpriseClientPanel={showEnterpriseClientPanel}
      showExpertPanel={showExpertPanel}
      showFinancePanel={showFinancePanel}
      showLeadAssistPanel={showLeadAssistPanel}
      showCustomerCxPanel={showCustomerCxPanel}
      showOpportunityDeskPanel={showOpportunityDeskPanel}
    />
  );
}
