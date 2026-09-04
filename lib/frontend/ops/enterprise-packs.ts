import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadPendingEbdpPacks(client: SupabaseClient) {
  const { data, error } = await client
    .from("enterprise_bdp_packs")
    .select("*")
    .in("application_status", ["submitted", "pending_payment", "pending_approval"])
    .order("created_at", { ascending: true })
    .limit(100);
  if (error) throw error;
  return data ?? [];
}
