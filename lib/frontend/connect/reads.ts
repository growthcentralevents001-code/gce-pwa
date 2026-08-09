import type { SupabaseClient } from "@supabase/supabase-js";
import { getCircle } from "@/lib/architecture/connect/circles";
import { getSeatAvailability } from "@/lib/architecture/connect/allocation";
import { CIRCLE_CAPACITY_MAX } from "@/lib/architecture/connect/types";

/** Read helpers for member CX — never invent seats or capacity. */

export async function findSeatForMembership(
  client: SupabaseClient,
  membershipId: string
) {
  const { data } = await client
    .from("connect_circle_seats")
    .select(
      "id,circle_id,membership_id,specialisation_id,status,counts_toward_capacity,connect_circles(id,name,city,lifecycle_status,constitution_status,active_seat_count,capacity_max)"
    )
    .eq("membership_id", membershipId)
    .in("status", ["active", "reserved", "protected_grace", "allocated"])
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  return data;
}

export async function listCircleDirectory(
  client: SupabaseClient,
  circleId: string
) {
  const { data, error } = await client
    .from("connect_circle_seats")
    .select(
      "id,membership_id,specialisation_id,status,connect_memberships(id,user_id,status,allocation_status,specialisation_id)"
    )
    .eq("circle_id", circleId)
    .in("status", ["active", "protected_grace", "allocated"])
    .limit(40);
  if (error) return [];
  return data ?? [];
}

export async function listCircleGovernance(
  client: SupabaseClient,
  circleId: string
) {
  const { data } = await client
    .from("circle_governance_appointments")
    .select("id,role_key,user_id,status,appointed_at,effective_from,effective_to")
    .eq("circle_id", circleId)
    .eq("status", "active")
    .limit(20);
  return data ?? [];
}

export async function loadCircleBundle(
  client: SupabaseClient,
  circleId: string
) {
  const [circle, availability, directory, governance] = await Promise.all([
    getCircle(client, circleId),
    getSeatAvailability(client, circleId),
    listCircleDirectory(client, circleId),
    listCircleGovernance(client, circleId),
  ]);
  if (!circle) {
    throw new Error("Circle not found");
  }
  return {
    circle: {
      ...circle,
      capacityMax: Math.min(circle.capacityMax, CIRCLE_CAPACITY_MAX),
    },
    availability: {
      ...availability,
      capacityMax: Math.min(availability.capacityMax, CIRCLE_CAPACITY_MAX),
    },
    directory,
    governance,
  };
}
