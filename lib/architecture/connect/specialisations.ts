import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";

export type BusinessSpecialisation = {
  id: string;
  code: string;
  label: string;
  powerSector: string | null;
};

/**
 * Active business specialisations (Associate taxonomy).
 */
export async function listActiveSpecialisations(
  client: SupabaseClient
): Promise<BusinessSpecialisation[]> {
  const { data, error } = await client
    .from("business_specialisations")
    .select("id, code, label, power_sector, is_active")
    .eq("is_active", true)
    .order("label", { ascending: true });

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to list specialisations", {
      cause: error,
    });
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    code: String(row.code),
    label: String(row.label),
    powerSector: (row.power_sector as string | null) ?? null,
  }));
}
