import { OpsShell } from "@/components/app-shell/OpsShell";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";

/**
 * Ops shell alignment for Phase 13 /ops/*.
 * Does not rewrite ops business pages — chrome + token alignment only.
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

  // Soft presence — pages still enforce permissions.
  let permissions: string[] | undefined;
  if (user) {
    try {
      await resolveActiveEntitlements(supabase, user.id);
      // Pass undefined so nav shows structural links; pages gate access.
      permissions = undefined;
    } catch {
      permissions = undefined;
    }
  }

  return (
    <OpsShell userEmail={user?.email ?? null} permissions={permissions}>
      {children}
    </OpsShell>
  );
}
