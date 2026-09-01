import type { SupabaseClient } from "@supabase/supabase-js";

export async function loadPendingMbdpUnits(client: SupabaseClient) {
  const { data, error } = await client
    .from("marketplace_bdp_units")
    .select(
      "id, user_id, application_status, package_option, terms_accepted_at, payment_intent_id, offline_payment_ref, created_at"
    )
    .eq("application_status", "pending_approval")
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) return [];
  return data ?? [];
}
