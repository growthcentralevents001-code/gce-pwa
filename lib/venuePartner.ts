import { supabase } from "@/lib/supabaseClient";

export type VenuePartnerProfile = {
  id: string;
  name: string;
  city: string | null;
};

export async function fetchVenuePartnerProfile(
  userId: string
): Promise<VenuePartnerProfile | null> {
  const { data, error } = await supabase
    .from("venues")
    .select("id, name, city")
    .eq("user_id", userId)
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data;
}
