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
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { WorkspaceSwitcher } from "./workspace-switcher";

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
    "Canonical Venue Partner workspace. Manage Events/Offers via /api/marketplace/bdp. Legacy /dashboard/venue/* remains prototype WIP.";
  if (showVenuePanel) {
    venueHint =
      "Canonical Venue Partner workspace (FD-033/037). Use Marketplace API for Event/Offer/claim. Avoid legacy prototype routes for new data.";
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

  if (!canAccess) {
    return (
      <main className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="text-2xl font-semibold tracking-tight">Access denied</h1>
        <p className="mt-2 text-sm text-neutral-600">
          Workspace <code>{workspaceKey}</code> is not available for your active
          role assignments. Legacy dashboard routes do not grant entitlement.
        </p>
        <WorkspaceSwitcher
          current={identity.currentWorkspace}
          allowed={identity.workspaces}
        />
        {activeCount === 0 ? (
          <p className="mt-4 text-sm text-amber-800">
            No active role assignments. You may use the personal workspace only.
          </p>
        ) : null}
        {suspendedCount > 0 ? (
          <p className="mt-2 text-sm text-amber-800">
            {suspendedCount} assignment(s) suspended — those workspaces are excluded.
          </p>
        ) : null}
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">
          Workspace: {workspaceKey}
        </h1>
        <p className="text-xs text-neutral-500">
          Role/source: {identity.entitlements.source}
        </p>
      </div>
      <p className="mt-2 text-sm text-neutral-600">
        Entitlement authority is <code>role_assignments</code> (FD-035). Membership
        activation is separate from Circle allocation (FD-036).
      </p>
      <WorkspaceSwitcher current={key} allowed={identity.workspaces} />
      <section className="mt-6 rounded-lg border border-neutral-200 p-4">
        <h2 className="text-sm font-medium">Access</h2>
        <p className="mt-1 text-sm">
          Active assignment admits this workspace (or personal baseline).
        </p>
        <p className="mt-3 text-xs text-neutral-500">
          Allowed workspaces: {identity.workspaces.join(", ")}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Active assignments: {activeCount}
          {suspendedCount > 0 ? ` · suspended: ${suspendedCount}` : ""}
        </p>
      </section>
      {showConnectPanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">GCE Connect membership</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Associate Plan ₹6,000/quarter · max 4 Tags · active may be unallocated
          </p>
          {membershipSummary.length === 0 ? (
            <p className="mt-3 text-sm text-neutral-600">No memberships yet.</p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {membershipSummary.map((m) => (
                <li key={m.id} className="border-t border-neutral-100 pt-2">
                  <span className="font-medium">{m.status}</span>
                  {" · "}
                  allocation: {m.allocationStatus}
                  {" · "}
                  tags: {m.tagCount}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : null}
      {showBdpPanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Connect BDP Franchise Unit</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Target 5 Circles / 10 months · commission 20% attributed only · recovery
            max ₹5,000/cycle
          </p>
          {bdpReports.length === 0 || !bdpReports[0] ? (
            <p className="mt-3 text-sm text-neutral-600">
              No Connect BDP Franchise Unit yet. Apply via{" "}
              <code>/api/connect/bdp</code>.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {bdpReports.filter(Boolean).map((r) =>
                r ? (
                  <li key={r.unitId} className="border-t border-neutral-100 pt-2">
                    <div className="font-medium">{r.applicationStatus}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      Package: {r.packageOption} · remaining recoverable: ₹
                      {(r.remainingRecoverableMinor / 100).toLocaleString("en-IN")}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Target: {r.creditedCircles}/{r.targetCircles} credited ·
                      portfolio {r.activeCirclePortfolio} · months{" "}
                      {r.monthsElapsed ?? "—"}/{r.targetMonths}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Maintenance: {r.maintenanceStatus} · disputes open:{" "}
                      {r.openDisputes} · attributed members:{" "}
                      {r.attributedMemberships}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Gross commission: ₹
                      {(r.grossEligibleCommissionMinor / 100).toLocaleString(
                        "en-IN"
                      )}{" "}
                      · recovery: ₹
                      {(r.recoveryDeductionsMinor / 100).toLocaleString("en-IN")}{" "}
                      · net: ₹
                      {(r.netPayableCommissionMinor / 100).toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>
      ) : null}
      {showMbdpPanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Marketplace BDP Franchise Unit</h2>
          <p className="mt-1 text-xs text-neutral-500">
            20 Venues/unit · max 2 units · attributed 80/10/10 · unattributed 80/0/20
          </p>
          {mbdpReports.length === 0 || !mbdpReports[0] ? (
            <p className="mt-3 text-sm text-neutral-600">
              No Marketplace BDP unit yet. Apply via{" "}
              <code>/api/marketplace/bdp</code>.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {mbdpReports.filter(Boolean).map((r) =>
                r ? (
                  <li key={r.unitId} className="border-t border-neutral-100 pt-2">
                    <div className="font-medium">{r.applicationStatus}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      Package: {r.packageOption} · venues {r.activeVenueCount}/
                      {r.venueCapacity} · proposed {r.proposedAttributions}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Recoverable remaining: ₹
                      {(r.remainingRecoverableMinor / 100).toLocaleString(
                        "en-IN"
                      )}{" "}
                      · MBDP entitlement: ₹
                      {(r.grossMbdpEntitlementMinor / 100).toLocaleString(
                        "en-IN"
                      )}{" "}
                      · net: ₹
                      {(r.netMbdpPayableMinor / 100).toLocaleString("en-IN")}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>
      ) : null}
      {showVenuePanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Venue Partner</h2>
          <p className="mt-1 text-xs text-neutral-500">{venueHint}</p>
        </section>
      ) : null}
      {showEbdpPanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Enterprise BDP Franchise Pack</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Client-based attribution · 30 clients/pack · EBDP = 25% of GCE platform
            commission · Finance co-sign &gt; ₹5L
          </p>
          {ebdpReports.length === 0 || !ebdpReports[0] ? (
            <p className="mt-3 text-sm text-neutral-600">
              No Enterprise BDP pack yet. Apply via <code>/api/enterprise</code>.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {ebdpReports.filter(Boolean).map((r) =>
                r ? (
                  <li key={r.packId} className="border-t border-neutral-100 pt-2">
                    <div className="font-medium">{r.applicationStatus}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      Package: {r.packageOption} · clients {r.activeClientCount}/
                      {r.clientsCapacity} · proposed {r.proposedAttributions}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Opportunities: {r.openOpportunities} · projects:{" "}
                      {r.activeProjects} · handovers: {r.reassignmentEvents}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Eligible entitlement: ₹
                      {(r.grossEligibleCommissionMinor / 100).toLocaleString(
                        "en-IN"
                      )}{" "}
                      · recoverable left: ₹
                      {(r.remainingRecoverableMinor / 100).toLocaleString(
                        "en-IN"
                      )}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>
      ) : null}
      {showEnterpriseClientPanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Enterprise Client</h2>
          <p className="mt-1 text-xs text-neutral-500">
            Organisation workspace — internal margins/commission hidden
          </p>
          {clientReports.length === 0 || !clientReports[0] ? (
            <p className="mt-3 text-sm text-neutral-600">
              No Enterprise Client organisations linked to your representative
              profile.
            </p>
          ) : (
            <ul className="mt-3 space-y-3 text-sm">
              {clientReports.filter(Boolean).map((r) =>
                r ? (
                  <li key={r.clientId} className="border-t border-neutral-100 pt-2">
                    <div className="font-medium">{r.displayName}</div>
                    <div className="mt-1 text-xs text-neutral-600">
                      {r.status} · {r.engagementStatus}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Opportunities: {r.opportunities} · quotes pending:{" "}
                      {r.quotesAwaitingAcceptance} · projects: {r.projects}
                    </div>
                    <div className="text-xs text-neutral-600">
                      Milestones due: {r.milestonesDue} · disputes:{" "}
                      {r.openDisputes}
                    </div>
                  </li>
                ) : null
              )}
            </ul>
          )}
        </section>
      ) : null}
      {showExpertPanel && expertReport ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">
            Enterprise operations / Finance boundary
          </h2>
          <p className="mt-1 text-xs text-neutral-500">
            Requirement structuring · proposals · Finance co-sign queue (Phase 9
            settlement not included)
          </p>
          <div className="mt-3 text-sm text-neutral-700">
            Assigned opportunities: {expertReport.assignedOpportunities} · draft
            proposals: {expertReport.draftProposals} · quotes pending Finance
            co-sign: {expertReport.quotesPendingFinanceCosign}
          </div>
        </section>
      ) : null}
      {showFinancePanel ? (
        <section className="mt-6 rounded-lg border border-neutral-200 p-4">
          <h2 className="text-sm font-medium">Finance / Settlement spine</h2>
          <p className="mt-1 text-xs text-neutral-500">
            FD-020/021/028/029 — payment ≠ revenue ≠ settlement. Payout execution
            gated OFF. Use <code>/api/finance</code>.
          </p>
          {!financeReport ? (
            <p className="mt-3 text-sm text-neutral-600">
              Finance dashboard unavailable for this session.
            </p>
          ) : (
            <div className="mt-3 space-y-1 text-xs text-neutral-700">
              <div>
                Recognised components: {financeReport.recognisedRevenueComponents}{" "}
                · pending entitlements: {financeReport.pendingEntitlements} ·
                settlement-eligible:{" "}
                {financeReport.settlementEligibleEntitlements}
              </div>
              <div>
                Holds: {financeReport.activeHolds} · batches:{" "}
                {financeReport.settlementBatches} · payout-ready:{" "}
                {financeReport.payoutReadyItems}
              </div>
              <div>
                Offline unmatched: {financeReport.offlineUnmatched} · recon
                exceptions: {financeReport.reconciliationExceptions} ·
                reversals: {financeReport.reversals}
              </div>
              <div>
                Vertical gross — Connect ₹
                {(financeReport.totals.connectGross / 100).toLocaleString(
                  "en-IN"
                )}{" "}
                · Marketplace ₹
                {(financeReport.totals.marketplaceGross / 100).toLocaleString(
                  "en-IN"
                )}{" "}
                · Enterprise ₹
                {(financeReport.totals.enterpriseGross / 100).toLocaleString(
                  "en-IN"
                )}
              </div>
              <div>
                Money flags: settlement_execution=
                {String(financeReport.moneyFlags.settlement_execution ?? false)}{" "}
                · payout_execution=
                {String(financeReport.moneyFlags.payout_execution ?? false)} ·
                ticket_payments=
                {String(
                  financeReport.moneyFlags.marketplace_ticket_payments ?? false
                )}
              </div>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
