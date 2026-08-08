import { redirect, notFound } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { resolveCurrentWorkspace } from "@/lib/architecture/workspace/preferences";
import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";
import { WorkspaceSwitcher } from "./workspace-switcher";

type PageProps = {
  params: Promise<{ workspaceKey: string }>;
};

/**
 * Canonical workspace shell (ADR-003).
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

  const entitlements = await resolveActiveEntitlements(supabase, user.id, {
    consultLegacyForDiagnostics: true,
  });

  const resolved = await resolveCurrentWorkspace({
    client: supabase,
    userId: user.id,
    assignments: entitlements.activeAssignments,
    requested: workspaceKey,
  });

  const key = workspaceKey as WorkspaceKey;
  const canAccess =
    key === "personal" ||
    (resolved.authorized && resolved.workspaceKey === key) ||
    resolved.allowed.includes(key);
  const showUnauthorized = !canAccess;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-semibold tracking-tight">
        Workspace: {workspaceKey}
      </h1>
      <p className="mt-2 text-sm text-neutral-600">
        Canonical Phase 2 workspace shell. Entitlement authority is{" "}
        <code>role_assignments</code> (FD-035). Legacy{" "}
        <code>user_roles</code> is diagnostic only.
      </p>
      <WorkspaceSwitcher current={key} allowed={resolved.allowed} />
      <section className="mt-6 rounded-lg border border-neutral-200 p-4">
        <h2 className="text-sm font-medium">Access</h2>
        <p className="mt-1 text-sm">
          {canAccess
            ? "Active assignment admits this workspace (or personal baseline)."
            : "No active assignment for this workspace. Access denied for operational mutations."}
        </p>
        <p className="mt-3 text-xs text-neutral-500">
          Allowed workspaces: {resolved.allowed.join(", ") || "personal"}
        </p>
        <p className="mt-1 text-xs text-neutral-500">
          Active assignments: {entitlements.activeAssignments.length} (source:{" "}
          {entitlements.source})
        </p>
        {entitlements.legacyCompatibilityConsulted ? (
          <p className="mt-1 text-xs text-neutral-500">
            Legacy roles (non-entitling):{" "}
            {entitlements.legacyRoleKeys.join(", ") || "none"}
          </p>
        ) : null}
      </section>
      {showUnauthorized ? (
        <p className="mt-4 text-sm text-red-700">
          Unauthorized workspace context — request an assignment from Platform
          Ops.
        </p>
      ) : null}
    </main>
  );
}
