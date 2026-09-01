import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { rankCirclesByGeography } from "./circles";
import { getSeatAvailability } from "./allocation";
import { CIRCLE_CAPACITY_MAX } from "./types";

export type SeatCheckMatch = {
  circleId: string;
  name: string;
  city: string;
  state: string | null;
  district: string | null;
  locality: string | null;
  score: number;
  capacityMax: number;
  activeSeats: number;
  remaining: number;
  canAccept: boolean;
};

export type AdvisorySeatCheckResult = {
  matches: SeatCheckMatch[];
  /** True when no geo-ranked Circles matched preference. */
  noMatch: boolean;
  advisoryNote: string;
  specialisationId: string | null;
};

/**
 * Advisory seat check for pre-purchase applications (FD-036).
 * Does not reserve seats. Ranks Circles by geography + capacity.
 * Category exclusivity is not enforced in v1.
 */
export async function advisorySeatCheck(
  client: SupabaseClient,
  input: {
    preferredCity?: string | null;
    preferredState?: string | null;
    preferredDistrict?: string | null;
    preferredLocality?: string | null;
    specialisationId?: string | null;
    limit?: number;
  }
): Promise<AdvisorySeatCheckResult> {
  const { data, error } = await client
    .from("connect_circles")
    .select(
      "id, name, city, district, state, locality, active_seat_count, capacity_max, lifecycle_status"
    )
    .neq("lifecycle_status", "draft")
    .limit(200);

  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load Circles for seat check", {
      cause: error,
    });
  }

  const circles = (data ?? []).map((row) => ({
    id: String(row.id),
    name: String(row.name),
    city: String(row.city),
    district: (row.district as string | null) ?? null,
    state: (row.state as string | null) ?? null,
    locality: (row.locality as string | null) ?? null,
    activeSeatCount: Number(row.active_seat_count ?? 0),
    capacityMax: Number(row.capacity_max ?? CIRCLE_CAPACITY_MAX),
  }));

  const ranked = rankCirclesByGeography(circles, {
    city: input.preferredCity,
    state: input.preferredState,
    district: input.preferredDistrict,
    locality: input.preferredLocality,
  });

  const limit = Math.min(Math.max(input.limit ?? 5, 1), 10);
  const top = ranked.slice(0, limit);
  const byId = new Map(circles.map((c) => [c.id, c]));

  const matches: SeatCheckMatch[] = [];
  for (const r of top) {
    const c = byId.get(r.id);
    if (!c) continue;
    let availability;
    try {
      availability = await getSeatAvailability(client, c.id);
    } catch {
      availability = {
        capacityMax: c.capacityMax,
        activeSeats: c.activeSeatCount,
        remaining: Math.max(0, c.capacityMax - c.activeSeatCount),
        canAccept: c.activeSeatCount < c.capacityMax,
      };
    }
    matches.push({
      circleId: c.id,
      name: c.name,
      city: c.city,
      state: c.state,
      district: c.district,
      locality: c.locality,
      score: r.score,
      capacityMax: availability.capacityMax,
      activeSeats: availability.activeSeats,
      remaining: availability.remaining,
      canAccept: availability.canAccept,
    });
  }

  const noMatch = matches.length === 0;
  const advisoryNote = noMatch
    ? "No Circle matched your preferred geography yet. You can still save a draft — Platform Ops will route later or place you on a waitlist. Saving a draft does not reserve a seat."
    : "These matches are advisory only. Saving a draft does not reserve a Circle seat. Activation and allocation remain separate (FD-036).";

  return {
    matches,
    noMatch,
    advisoryNote,
    specialisationId: input.specialisationId ?? null,
  };
}
