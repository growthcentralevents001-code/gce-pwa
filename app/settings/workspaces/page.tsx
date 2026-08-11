import { redirect } from "next/navigation";
import { SettingsShell } from "@/components/settings/SettingsShell";
import { SettingsSection } from "@/components/settings/SettingsSection";
import { StatusBadge } from "@/components/states/StatusBadge";
import { EmptyState } from "@/components/states/EmptyState";
import { WorkspaceSwitcher } from "@/components/workspace/WorkspaceSwitcher";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { getCurrentIdentity } from "@/lib/architecture/identity/current";
import { SETTINGS_COPY } from "@/lib/frontend/settings/format";
import { opsStatusTone } from "@/lib/frontend/ops/format";
import { GCE_RADIUS, GCE_SURFACE } from "@/lib/frontend/design-language";
import { cn } from "@/lib/utils";
import { isAssignmentActive } from "@/lib/architecture/rbac/permissions";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Workspaces · Settings · GCE",
};

/** SET-03 — read-only role/workspace overview. No self-role grant. */
export default async function SettingsWorkspacesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings/workspaces");

  const identity = await getCurrentIdentity(supabase, {
    userId: user.id,
    email: user.email,
  });

  const all = identity.entitlements.assignments;
  const accountSuspended = Boolean(identity.identitySuspension);

  return (
    <SettingsShell
      title="Workspaces & roles"
      description={`${SETTINGS_COPY.oneAccount} ${SETTINGS_COPY.noSelfRole}`}
    >
      <SettingsSection title="Account vs role status">
        <div className="flex flex-wrap gap-2">
          <StatusBadge
            label={
              accountSuspended ? "Account suspended" : "Account active"
            }
            tone={accountSuspended ? "error" : "success"}
          />
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {SETTINGS_COPY.roleVsAccount}
        </p>
        {identity.identitySuspension ? (
          <p className="mt-2 text-sm text-destructive">
            Platform-wide hold reason: {identity.identitySuspension.reason}
          </p>
        ) : null}
      </SettingsSection>

      <SettingsSection
        title="Workspace switcher"
        description="Reuse the canonical switcher — one account, many scoped workspaces."
      >
        <WorkspaceSwitcher
          current={identity.currentWorkspace}
          allowed={identity.workspaces}
        />
      </SettingsSection>

      <SettingsSection title="Role assignments">
        {all.length === 0 ? (
          <EmptyState
            title="No role assignments"
            description="Personal workspace remains available. Roles are granted through controlled application flows — not Settings."
          />
        ) : (
          <ul className="space-y-2">
            {all.map((a) => {
              const active = isAssignmentActive(a);
              return (
                <li
                  key={a.id}
                  className={cn(
                    GCE_RADIUS.control,
                    GCE_SURFACE.muted,
                    "flex flex-wrap items-start justify-between gap-2 p-3 text-sm"
                  )}
                >
                  <div>
                    <p className="font-medium">{a.roleKey}</p>
                    <p className="text-xs text-muted-foreground">
                      Scope: {a.scopeType}
                      {a.scopeId ? ` · ${a.scopeId.slice(0, 8)}…` : ""}
                      {a.organisationId
                        ? ` · org ${a.organisationId.slice(0, 8)}…`
                        : ""}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {active
                        ? "Active for workspace access"
                        : a.status === "suspended"
                          ? "Role suspended — account may still be active"
                          : `Status: ${a.status}`}
                    </p>
                  </div>
                  <StatusBadge
                    label={a.status}
                    tone={opsStatusTone(a.status)}
                  />
                </li>
              );
            })}
          </ul>
        )}
        <p className="mt-4 text-xs text-muted-foreground">
          There is no “Add Role”, “Make Admin”, or “Become Finance Admin”
          control here.
        </p>
      </SettingsSection>
    </SettingsShell>
  );
}
