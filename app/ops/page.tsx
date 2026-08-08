import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import {
  actorHasOpsAdminPermission,
  getOpsDashboard,
} from "@/lib/architecture/ops-admin";
import { actorHasOpsPermission } from "@/lib/architecture/ops-governance";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";

export default async function OpsHomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const canDash = actorHasOpsAdminPermission(assignments, "ops.dashboard");
  const canSecurity = actorHasOpsPermission(assignments, "security.read");
  const canAudit = actorHasOpsPermission(assignments, "audit.search");
  const canRisk = actorHasOpsPermission(assignments, "risk.review");
  const canHolds = actorHasOpsPermission(assignments, "compliance.hold");

  let cards: Awaited<ReturnType<typeof getOpsDashboard>>["cards"] | null =
    null;
  if (canDash) {
    try {
      const admin = createPrivilegedSupabaseClient();
      cards = (await getOpsDashboard(admin)).cards;
    } catch {
      cards = null;
    }
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Operations control plane</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Phase 13 Admin / Ops / Support · no Super Admin shortcut · money/live
        providers remain OFF
      </p>

      {cards ? (
        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            ["Pending approvals", cards.pendingApprovals],
            ["Open exceptions", cards.openExceptions],
            ["Open cases", cards.openCases],
            ["Incidents", cards.openIncidents],
            ["Risk signals", cards.openRiskSignals],
            ["Compliance holds", cards.activeComplianceHolds],
            ["Privacy requests", cards.privacyRequests],
            ["Dead letters", cards.notificationDeadLetters],
            ["Support signals", cards.supportSignalsQueued],
          ].map(([label, value]) => (
            <div
              key={String(label)}
              className="rounded border border-neutral-200 p-3 text-sm"
            >
              <div className="text-neutral-500">{label}</div>
              <div className="mt-1 text-xl font-semibold">{value}</div>
            </div>
          ))}
        </section>
      ) : null}

      <ul className="mt-8 space-y-2 text-sm">
        {canDash ? (
          <>
            <li>
              <Link className="underline" href="/ops/approvals">
                Approval queues
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/exceptions">
                Exception queues
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/cases">
                Cases / disputes
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/connect">
                Connect Ops
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/marketplace">
                Marketplace Ops
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/enterprise">
                Enterprise Ops
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/finance">
                Finance Admin
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/compliance">
                Compliance Admin
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/support">
                Support Admin
              </Link>
            </li>
            <li>
              <Link className="underline" href="/ops/incidents">
                Incidents
              </Link>
            </li>
          </>
        ) : null}
        <li>
          <Link className="underline" href="/ops/notifications">
            Notification center & preferences
          </Link>
        </li>
        {canAudit ? (
          <li>
            <Link className="underline" href="/ops/security?tab=audit">
              Audit search
            </Link>
          </li>
        ) : null}
        {canSecurity ? (
          <li>
            <Link className="underline" href="/ops/security?tab=security">
              Security events
            </Link>
          </li>
        ) : null}
        {canRisk ? (
          <li>
            <Link className="underline" href="/ops/security?tab=risk">
              Risk / fraud queue
            </Link>
          </li>
        ) : null}
        {canHolds ? (
          <li>
            <Link className="underline" href="/ops/security?tab=holds">
              Compliance holds
            </Link>
          </li>
        ) : null}
        <li>
          <Link className="underline" href="/ops/privacy">
            Privacy requests
          </Link>
        </li>
      </ul>
      <p className="mt-6 text-xs text-neutral-500">
        Legacy `/app/admin/*` prototype WIP is not used. Canonical workspace
        remains `/dashboard/[workspaceKey]` + `/ops/*`.
      </p>
    </main>
  );
}
