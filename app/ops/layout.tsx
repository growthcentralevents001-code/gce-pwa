import type { Metadata } from "next";
import { OpsShell } from "@/components/app-shell/OpsShell";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { actorHasOpsAdminPermission } from "@/lib/architecture/ops-admin";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Ops shell — Batch 8.
 * Soft presence for chrome; pages still enforce permissions.
 * Search enabled only when ops.search is granted.
 */
export default async function OpsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let permissions: string[] | undefined;
  let canSearch = false;
  if (user) {
    try {
      const entitlements = await resolveActiveEntitlements(supabase, user.id);
      // Pass undefined so structural nav remains visible; pages gate access.
      permissions = undefined;
      canSearch = actorHasOpsAdminPermission(
        entitlements.activeAssignments,
        "ops.search"
      );
    } catch {
      permissions = undefined;
      canSearch = false;
    }
  }

  return (
    <OpsShell
      userEmail={user?.email ?? null}
      permissions={permissions}
      canSearch={canSearch}
    >
      {children}
    </OpsShell>
  );
}
