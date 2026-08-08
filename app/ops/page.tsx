import Link from "next/link";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsPermission } from "@/lib/architecture/ops-governance";

export default async function OpsHomePage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const assignments = entitlements.activeAssignments;
  const canSecurity = actorHasOpsPermission(assignments, "security.read");
  const canAudit = actorHasOpsPermission(assignments, "audit.search");
  const canRisk = actorHasOpsPermission(assignments, "risk.review");
  const canHolds = actorHasOpsPermission(assignments, "compliance.hold");

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-semibold">Phase 12 Ops</h1>
      <p className="mt-1 text-sm text-neutral-600">
        Minimal verification surfaces. Full Admin/Support UX is Phase 13.
      </p>
      <ul className="mt-6 space-y-2 text-sm">
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
    </main>
  );
}
