import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/clients";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

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
