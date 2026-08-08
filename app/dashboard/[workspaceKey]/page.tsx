import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { WorkspaceSwitcher } from "./workspace-switcher";

type PageProps = {
  params: Promise<{ workspaceKey: string }>;
};

/**
 * Canonical workspace shell (ADR-003 / Phase 4).
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
        Entitlement authority is <code>role_assignments</code> (FD-035). Legacy{" "}
        <code>user_roles</code> is diagnostic only.
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
        {identity.entitlements.legacyCompatibilityConsulted ? (
          <p className="mt-1 text-xs text-neutral-500">
            Legacy roles (non-entitling):{" "}
            {identity.entitlements.legacyRoleKeys.join(", ") || "none"}
          </p>
        ) : null}
        <p className="mt-1 text-xs text-neutral-500">
          Profile: {identity.profile?.displayName ?? "linked"}
        </p>
      </section>
    </main>
  );
}
