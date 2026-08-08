import type { SupabaseClient } from "@supabase/supabase-js";
import { MBDP_VENUES_PER_UNIT, MBDP_STANDARD_MAX_VENUES } from "./constants";

export async function buildMbdpDashboard(
  client: SupabaseClient,
  unitId: string
) {
  const { data: unit } = await client
    .from("marketplace_bdp_units")
    .select("*")
    .eq("id", unitId)
    .maybeSingle();
  if (!unit) return null;

  const [
    { count: activeVenues },
    { count: proposedAttrs },
    { data: ents },
    { data: recovery },
  ] = await Promise.all([
    client
      .from("marketplace_venue_attributions")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", unitId)
      .eq("status", "active"),
    client
      .from("marketplace_venue_attributions")
      .select("*", { count: "exact", head: true })
      .eq("unit_id", unitId)
      .eq("status", "proposed"),
    client
      .from("marketplace_revenue_entitlements")
      .select("mbdp_share_minor")
      .eq("unit_id", unitId),
    client
      .from("marketplace_bdp_recovery_entries")
      .select("recovered_minor")
      .eq("unit_id", unitId),
  ]);

  const mbdp = (ents ?? []).reduce(
    (s, e) => s + Number(e.mbdp_share_minor ?? 0),
    0
  );
  const recovered = (recovery ?? []).reduce(
    (s, e) => s + Number(e.recovered_minor ?? 0),
    0
  );

  return {
    unitId: String(unit.id),
    applicationStatus: String(unit.application_status),
    packageOption: String(unit.package_option),
    remainingRecoverableMinor: Number(unit.remaining_recoverable_minor ?? 0),
    activeVenueCount: activeVenues ?? Number(unit.active_venue_count ?? 0),
    venueCapacity: Number(unit.venues_capacity_max ?? MBDP_VENUES_PER_UNIT),
    standardMaxVenues: MBDP_STANDARD_MAX_VENUES,
    proposedAttributions: proposedAttrs ?? 0,
    grossMbdpEntitlementMinor: mbdp,
    recoveryDeductionsMinor: recovered,
    netMbdpPayableMinor: Math.max(0, mbdp - recovered),
  };
}

export async function buildVenueDashboard(
  client: SupabaseClient,
  venueId: string
) {
  const { data: venue } = await client
    .from("marketplace_venues")
    .select("*")
    .eq("id", venueId)
    .maybeSingle();
  if (!venue) return null;

  const [{ data: attr }, { count: events }, { count: offers }] =
    await Promise.all([
      client
        .from("marketplace_venue_attributions")
        .select("*")
        .eq("venue_id", venueId)
        .eq("status", "active")
        .maybeSingle(),
      client
        .from("marketplace_events")
        .select("*", { count: "exact", head: true })
        .eq("venue_id", venueId),
      client
        .from("marketplace_offer_events")
        .select("*", { count: "exact", head: true })
        .eq("venue_id", venueId),
    ]);

  return {
    venueId: String(venue.id),
    displayName: String(venue.display_name),
    status: String(venue.status),
    city: String(venue.city),
    attributedMbdpUserId: attr?.bdp_user_id
      ? String(attr.bdp_user_id)
      : null,
    attributedUnitId: attr?.unit_id ? String(attr.unit_id) : null,
    eventCount: events ?? 0,
    offerCount: offers ?? 0,
    relationshipNote:
      "Marketplace BDP with active attribution is primary RM (FD-033)",
  };
}
