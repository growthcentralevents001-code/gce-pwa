import type { SupabaseClient } from "@supabase/supabase-js";
import { getCircle } from "@/lib/architecture/connect/circles";
import { getSeatAvailability } from "@/lib/architecture/connect/allocation";
import { CIRCLE_CAPACITY_MAX } from "@/lib/architecture/connect/types";
import { normalizeMembershipApplicationMetadata } from "@/lib/architecture/connect/application";
import {
  formatPowerSectorLabel,
  type CircleDirectoryCard,
} from "@/lib/frontend/connect/format";

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
    .in("status", ["reserved", "protected_grace", "allocated"])
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
      "id,membership_id,specialisation_id,status,connect_memberships(id,user_id,status,allocation_status,specialisation_id,metadata)"
    )
    .eq("circle_id", circleId)
    .in("status", ["reserved", "protected_grace", "allocated"])
    .limit(40);
  if (error) return [];
  return data ?? [];
}

function membershipFromSeat(row: {
  connect_memberships?: unknown;
}): {
  id?: string;
  user_id?: string;
  status?: string;
  specialisation_id?: string | null;
  metadata?: unknown;
} | null {
  const raw = row.connect_memberships;
  const m = Array.isArray(raw) ? raw[0] : raw;
  return m && typeof m === "object"
    ? (m as {
        id?: string;
        user_id?: string;
        status?: string;
        specialisation_id?: string | null;
        metadata?: unknown;
      })
    : null;
}

/** Privacy-safe directory cards: display names only — no phone/email. */
export async function presentCircleDirectory(
  client: SupabaseClient,
  seats: Awaited<ReturnType<typeof listCircleDirectory>>
): Promise<CircleDirectoryCard[]> {
  const memberships = seats.map(membershipFromSeat);
  const userIds = [
    ...new Set(
      memberships.map((m) => m?.user_id).filter((id): id is string => Boolean(id))
    ),
  ];
  const specIds = [
    ...new Set(
      seats
        .map((s) => s.specialisation_id as string | null)
        .concat(memberships.map((m) => m?.specialisation_id ?? null))
        .filter((id): id is string => Boolean(id))
    ),
  ];
  const membershipIds = [
    ...new Set(
      seats
        .map((s) => s.membership_id as string | undefined)
        .filter((id): id is string => Boolean(id))
    ),
  ];

  const [{ data: profiles }, { data: specs }, { data: tags }] =
    await Promise.all([
      userIds.length
        ? client
            .from("profiles")
            .select("user_id,display_name")
            .in("user_id", userIds)
        : Promise.resolve({ data: [] as Array<{ user_id: string; display_name: string | null }> }),
      specIds.length
        ? client
            .from("business_specialisations")
            .select("id,label,power_sector")
            .in("id", specIds)
        : Promise.resolve({
            data: [] as Array<{
              id: string;
              label: string;
              power_sector: string | null;
            }>,
          }),
      membershipIds.length
        ? client
            .from("membership_tags")
            .select("membership_id,tag_label,tag_slot,status")
            .in("membership_id", membershipIds)
            .eq("status", "active")
        : Promise.resolve({
            data: [] as Array<{
              membership_id: string;
              tag_label: string | null;
              tag_slot: number;
            }>,
          }),
    ]);

  const nameByUser = new Map(
    (profiles ?? []).map((p) => [p.user_id, p.display_name])
  );
  const specById = new Map(
    (specs ?? []).map((s) => [
      s.id,
      { label: s.label, sector: s.power_sector },
    ])
  );
  const tagsByMembership = new Map<string, string[]>();
  for (const t of tags ?? []) {
    const list = tagsByMembership.get(t.membership_id) ?? [];
    if (t.tag_label) list.push(String(t.tag_label));
    tagsByMembership.set(t.membership_id, list);
  }

  return seats.map((row) => {
    const m = membershipFromSeat(row);
    const specId =
      (row.specialisation_id as string | null) ?? m?.specialisation_id ?? null;
    const spec = specId ? specById.get(specId) : undefined;
    const display = m?.user_id ? nameByUser.get(m.user_id) : null;
    const businessName =
      normalizeMembershipApplicationMetadata(m?.metadata)?.businessName ?? null;
    const sectorRaw = spec?.sector ?? null;
    return {
      id: String(row.id),
      name: businessName || display?.trim() || "Circle member",
      specialisation: spec?.label ?? null,
      sectorLabel: formatPowerSectorLabel(sectorRaw),
      tagLabels: m?.id ? tagsByMembership.get(m.id) ?? [] : [],
      status: m?.status ?? (row.status as string | null),
    };
  });
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

export type CircleConnectBdpAssignment = {
  unitId: string;
  partnerName: string | null;
};

/** Active Connect BDP assignment for a Circle — read-only, privacy-safe label. */
export async function getActiveConnectBdpForCircle(
  client: SupabaseClient,
  circleId: string
): Promise<CircleConnectBdpAssignment | null> {
  const { data: assignment } = await client
    .from("connect_bdp_circle_assignments")
    .select("unit_id, connect_bdp_units(role_assignment_id)")
    .eq("circle_id", circleId)
    .eq("status", "active")
    .order("effective_from", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!assignment?.unit_id) return null;

  const unitRaw = assignment.connect_bdp_units;
  const unit = Array.isArray(unitRaw) ? unitRaw[0] : unitRaw;
  const roleAssignmentId =
    unit && typeof unit === "object" && "role_assignment_id" in unit
      ? (unit as { role_assignment_id?: string | null }).role_assignment_id
      : null;

  let partnerName: string | null = null;
  if (roleAssignmentId) {
    const { data: roleRow } = await client
      .from("gce_role_assignments")
      .select("user_id")
      .eq("id", roleAssignmentId)
      .maybeSingle();
    if (roleRow?.user_id) {
      const { data: profile } = await client
        .from("profiles")
        .select("display_name")
        .eq("user_id", roleRow.user_id)
        .maybeSingle();
      partnerName = profile?.display_name?.trim() || null;
    }
  }

  return {
    unitId: String(assignment.unit_id),
    partnerName,
  };
}

export async function loadCircleBundle(
  client: SupabaseClient,
  circleId: string
) {
  const [circle, availability, directorySeats, governance] = await Promise.all([
    getCircle(client, circleId),
    getSeatAvailability(client, circleId),
    listCircleDirectory(client, circleId),
    listCircleGovernance(client, circleId),
  ]);
  if (!circle) {
    throw new Error("Circle not found");
  }
  const directory = await presentCircleDirectory(client, directorySeats);
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
    directorySeats,
    governance,
  };
}
