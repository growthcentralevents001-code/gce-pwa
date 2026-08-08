import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";
import type { ConnectCircle } from "./types";
import { CIRCLE_CAPACITY_MAX } from "./types";
import { circleStatusesForCount } from "./rules";

function mapCircle(row: Record<string, unknown>): ConnectCircle {
  return {
    id: String(row.id),
    name: String(row.name),
    city: String(row.city),
    lifecycleStatus: row.lifecycle_status as ConnectCircle["lifecycleStatus"],
    constitutionStatus:
      row.constitution_status as ConnectCircle["constitutionStatus"],
    activeSeatCount: Number(row.active_seat_count ?? 0),
    capacityMax: Number(row.capacity_max ?? CIRCLE_CAPACITY_MAX),
    platformActivationGrantedAt:
      (row.platform_activation_granted_at as string | null) ?? null,
    bdpTargetCreditEventId:
      (row.bdp_target_credit_event_id as string | null) ?? null,
  };
}

export async function createCircle(
  client: SupabaseClient,
  input: {
    name: string;
    city: string;
    district?: string | null;
    state?: string | null;
    locality?: string | null;
    actorUserId: string;
    correlationId?: string;
  }
): Promise<ConnectCircle> {
  const { data, error } = await client
    .from("connect_circles")
    .insert({
      name: input.name,
      city: input.city,
      district: input.district ?? null,
      state: input.state ?? null,
      locality: input.locality ?? null,
      lifecycle_status: "formation",
      constitution_status: "formation_circle",
      capacity_max: CIRCLE_CAPACITY_MAX,
      created_by: input.actorUserId,
    })
    .select("*")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to create Circle", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    actorUserId: input.actorUserId,
    action: "circle.create",
    resourceType: "connect_circle",
    resourceId: String(data.id),
    after: data,
    correlationId: input.correlationId,
  });

  return mapCircle(data as Record<string, unknown>);
}

export async function refreshCircleCapacity(
  client: SupabaseClient,
  circleId: string,
  actorUserId?: string | null
): Promise<ConnectCircle> {
  const { data, error } = await client.rpc("gce_refresh_circle_capacity", {
    p_circle_id: circleId,
    p_actor: actorUserId ?? null,
  });
  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to refresh Circle capacity", {
      cause: error,
    });
  }
  // rpc may return object or array depending on client
  const row = Array.isArray(data) ? data[0] : data;
  return mapCircle(row as Record<string, unknown>);
}

export async function getCircle(
  client: SupabaseClient,
  circleId: string
): Promise<ConnectCircle | null> {
  const { data, error } = await client
    .from("connect_circles")
    .select("*")
    .eq("id", circleId)
    .maybeSingle();
  if (error) {
    throw new AppError("INTERNAL_ERROR", "Failed to load Circle", {
      cause: error,
    });
  }
  return data ? mapCircle(data as Record<string, unknown>) : null;
}

/**
 * Rank Circles by geographic hierarchy: locality → city → district → state.
 * No hard-coded km radius.
 */
export function rankCirclesByGeography(
  circles: Array<{
    id: string;
    city: string;
    district?: string | null;
    state?: string | null;
    locality?: string | null;
    activeSeatCount: number;
  }>,
  preference: {
    locality?: string | null;
    city?: string | null;
    district?: string | null;
    state?: string | null;
  }
): Array<{ id: string; score: number }> {
  return circles
    .map((c) => {
      let score = 0;
      if (
        preference.locality &&
        c.locality &&
        c.locality.toLowerCase() === preference.locality.toLowerCase()
      ) {
        score += 1000;
      }
      if (
        preference.city &&
        c.city.toLowerCase() === preference.city.toLowerCase()
      ) {
        score += 100;
      }
      if (
        preference.district &&
        c.district &&
        c.district.toLowerCase() === preference.district.toLowerCase()
      ) {
        score += 10;
      }
      if (
        preference.state &&
        c.state &&
        c.state.toLowerCase() === preference.state.toLowerCase()
      ) {
        score += 1;
      }
      // Prefer Circles with remaining capacity
      if (c.activeSeatCount < CIRCLE_CAPACITY_MAX) score += 0.5;
      return { id: c.id, score };
    })
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score);
}

export { circleStatusesForCount };
