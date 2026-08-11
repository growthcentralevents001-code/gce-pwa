import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { workspacesForAssignments } from "@/lib/architecture/workspace/registry";
import { PartnerShell } from "@/components/app-shell/PartnerShell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

/**
 * Partner / workspace shell layout — Batch 0.
 * Authorization remains per-page; shell only presents entitled workspaces.
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=/dashboard/personal");
  }

  const entitlements = await resolveActiveEntitlements(supabase, user.id);
  const allowed = workspacesForAssignments(entitlements.activeAssignments);

  const primaryRole = entitlements.activeAssignments[0]?.roleKey;

  return (
    <PartnerShell
      allowedWorkspaces={allowed}
      userEmail={user.email}
      displayName={
        (user.user_metadata?.full_name as string | undefined) ||
        user.email ||
        null
      }
      roleLabel={
        primaryRole ? String(primaryRole).replace(/_/g, " ") : undefined
      }
    >
      {children}
    </PartnerShell>
  );
}
