import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { listMembershipsForUser } from "@/lib/architecture/connect/memberships";
import { listMembershipTags } from "@/lib/architecture/connect/tags";
import {
  listConnectBdpUnitsForUser,
  buildConnectBdpDashboard,
} from "@/lib/architecture/connect-bdp";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { WorkspaceSwitcher } from "./workspace-switcher";

type PageProps = {
  params: Promise<{ workspaceKey: string }>;
};

/**
 * Canonical workspace shell (ADR-003 / Phase 4–6).
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
    </main>
  );
}
