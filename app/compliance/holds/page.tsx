import { redirect } from "next/navigation";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  ComplianceHoldCard,
  ComplianceHoldActions,
  CreateComplianceHoldForm,
} from "@/components/ops";
import { EmptyState } from "@/components/states/EmptyState";
import { PartnerShell } from "@/components/app-shell/PartnerShell";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";
import { actorHasOpsPermission } from "@/lib/architecture/ops-governance";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { loadComplianceHolds } from "@/lib/frontend/ops/reads";
import { COMPLIANCE_SAFE_COPY } from "@/lib/frontend/ops/format";
import { GCE_SPACING } from "@/lib/frontend/design-language";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";

export const metadata = {
  robots: { index: false, follow: false },
  title: "Compliance holds · GCE",
};

/** CMP-04 — Compliance holds (explicit, audited — not a toggle). */
export default async function ComplianceHoldsPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/compliance/holds");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const allowed = workspacesForAssignments(assignments);
  const canHold =
    actorHasOpsAdminPermission(assignments, "ops.compliance") ||
    actorHasOpsPermission(assignments, "compliance.hold");

  const shell = (children: React.ReactNode) => (
    <PartnerShell
      forcedWorkspaceKey="compliance"
      allowedWorkspaces={
        allowed.includes("compliance") ? allowed : [...allowed, "compliance"]
      }
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel="Compliance"
      inactiveFeatureFlags={[...INACTIVE_FEATURE_FLAGS]}
    >
      {children}
    </PartnerShell>
  );

  if (!canHold) {
    return shell(
      <main className="mx-auto max-w-3xl px-4 py-10">
        <PageHeader title="Compliance holds" />
        <EmptyState
          title="Compliance access required"
          description="Holds require ops.compliance or compliance.hold. Direct URL is not entitlement."
        />
      </main>
    );
  }

  const holds = await loadComplianceHolds(createPrivilegedSupabaseClient(), {
    limit: 50,
  });
  const canMutate = actorHasOpsAdminPermission(assignments, "ops.compliance");

  return shell(
    <main className={GCE_SPACING.section}>
      <PageHeader
        title="Compliance holds"
        description={`${COMPLIANCE_SAFE_COPY.notLegalDetermination} Backend statuses today: active / released (full proposed→release_requested machine registered as gap if needed).`}
        breadcrumbs={[
          { label: "Compliance", href: "/dashboard/compliance" },
          { label: "Holds" },
        ]}
      />
      <CreateComplianceHoldForm enabled={canMutate} />
      {holds.length === 0 ? (
        <EmptyState
          title="No holds in view"
          description="Create a hold only with an explicit reason. Not a generic toggle."
        />
      ) : (
        <ul className="space-y-3">
          {holds.map((h) => (
            <li key={h.id}>
              <ComplianceHoldCard
                hold={h}
                actions={
                  h.status === "active" ? (
                    <ComplianceHoldActions
                      holdId={h.id}
                      subjectLabel={`${h.subject_type}:${h.subject_id.slice(0, 8)}`}
                      canRelease={canMutate}
                    />
                  ) : undefined
                }
              />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
