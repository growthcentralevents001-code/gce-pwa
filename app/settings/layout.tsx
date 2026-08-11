import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

/**
 * Settings requires authentication. Soft gate — pages also redirect.
 * No dark-mode productization toggle here.
 */
export default async function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/settings");
  return <>{children}</>;
}
