import { CustomerShell } from "@/components/app-shell/CustomerShell";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

/**
 * Customer mobile-first shell — Batch 0.
 * Does not implement booking/business screens (Batch 2).
 */
export default async function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <CustomerShell
      userLabel={user ? "Account" : "Sign in"}
    >
      {children}
    </CustomerShell>
  );
}
