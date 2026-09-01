#!/usr/bin/env node
/**
 * npm run e2e:fixtures:reset
 */
import { resolve } from "node:path";
import {
  FIXTURE_FAMILY,
  FIXTURE_IDENTITIES,
  fixtureEmail,
} from "./constants.mjs";
import { createFixtureAdminClient } from "./client.mjs";
import { loadFixtureEnv, fixtureUuid } from "./env.mjs";
import { lifecycleIds } from "./lifecycle.mjs";
import { purgeFixtureIdentity, deleteAssistGraphForCircle, clearUserReferencingRows } from "./users.mjs";
import { findAuthUserByEmail } from "./seed.mjs";

async function main() {
  const repoRoot = resolve(process.cwd());
  loadFixtureEnv(repoRoot);
  const admin = createFixtureAdminClient();

  console.log(`Phase 14B-F fixture RESET → family=${FIXTURE_FAMILY}`);

  const { error: raErr, count } = await admin.delete("role_assignments", [
    `metadata=cs.${encodeURIComponent(
      JSON.stringify({ fixture_family: FIXTURE_FAMILY })
    )}`,
  ]);
  if (raErr) throw raErr;
  console.log(`  deleted role_assignments: ${count ?? "?"}`);

  const domainIds = {
    event: fixtureUuid("event:01"),
    offer: fixtureUuid("offer:01"),
    membership: fixtureUuid("membership:01"),
    membershipMulti: fixtureUuid("membership:multi"),
    circle: fixtureUuid("circle:01"),
    venue: fixtureUuid("venue:01"),
    project: fixtureUuid("project:01"),
    venueOrg: fixtureUuid("org:venue"),
    enterpriseOrg: fixtureUuid("org:enterprise"),
  };

  const life = lifecycleIds();
  const fam = `metadata=cs.${encodeURIComponent(
    JSON.stringify({ fixture_family: FIXTURE_FAMILY })
  )}`;

  await admin.delete("marketplace_tickets", [`event_id=eq.${life.mkt_event_checkin}`]);
  await admin.delete("marketplace_tickets", [`event_id=eq.${life.mkt_event_attr}`]);
  await admin.delete("marketplace_tickets", [`event_id=eq.${life.mkt_event_unattr}`]);
  await admin.delete("marketplace_bookings", [`event_id=eq.${life.mkt_event_checkin}`]);
  await admin.delete("marketplace_bookings", [`event_id=eq.${life.mkt_event_attr}`]);
  await admin.delete("marketplace_bookings", [`event_id=eq.${life.mkt_event_unattr}`]);
  await admin.delete("marketplace_redemptions", [
    `offer_event_id=eq.${life.mkt_offer}`,
  ]);
  await admin.delete("marketplace_redemptions", [
    `offer_event_id=eq.${life.mkt_offer_expired}`,
  ]);
  await admin.delete("marketplace_offer_claims", [
    `offer_event_id=eq.${life.mkt_offer}`,
  ]);
  await admin.delete("marketplace_offer_claims", [
    `offer_event_id=eq.${life.mkt_offer_expired}`,
  ]);
  await admin.delete("marketplace_offer_visits", [
    `offer_event_id=eq.${life.mkt_offer}`,
  ]);
  await admin.delete("marketplace_offer_visits", [
    `offer_event_id=eq.${life.mkt_offer_expired}`,
  ]);
  await admin.delete("marketplace_bdp_recovery_entries", [
    `unit_id=eq.${life.mbdp_unit}`,
  ]);
  await admin.delete("stakeholder_entitlements", [fam]);
  await admin.delete("revenue_components", [`id=eq.${life.rev_attr}`]);
  await admin.delete("revenue_components", [`id=eq.${life.rev_unattr}`]);
  await admin.delete("revenue_components", [`id=eq.${life.rev_payment}`]);
  await admin.delete("marketplace_revenue_entitlements", [
    `id=eq.${life.mkt_ent_attr}`,
  ]);
  await admin.delete("marketplace_revenue_entitlements", [
    `id=eq.${life.mkt_ent_unattr}`,
  ]);
  await admin.delete("enterprise_milestones", [fam]);
  await admin.delete("enterprise_project_components", [
    `project_id=eq.${life.ent_project_a}`,
  ]);
  await admin.delete("enterprise_project_components", [
    `project_id=eq.${life.ent_project_b}`,
  ]);
  await admin.delete("enterprise_revenue_entitlements", [
    `id=eq.${life.ent_entitlement}`,
  ]);
  await admin.delete("enterprise_quotes", [`opportunity_id=eq.${life.ent_opp}`]);
  await admin.delete("enterprise_projects", [`id=eq.${life.ent_project_a}`]);
  await admin.delete("enterprise_projects", [`id=eq.${life.ent_project_b}`]);
  await admin.delete("enterprise_opportunities", [`id=eq.${life.ent_opp}`]);
  await admin.delete("enterprise_client_attributions", [`id=eq.${life.ent_attr}`]);
  await admin.delete("enterprise_client_profiles", [`id=eq.${life.ent_client}`]);
  await admin.delete("enterprise_bdp_packs", [`id=eq.${life.ebdp_pack}`]);
  await admin.delete("marketplace_offer_events", [`id=eq.${life.mkt_offer}`]);
  await admin.delete("marketplace_offer_events", [
    `id=eq.${life.mkt_offer_expired}`,
  ]);
  await admin.delete("marketplace_events", [`id=eq.${life.mkt_event_checkin}`]);
  await admin.delete("marketplace_events", [`id=eq.${life.mkt_event_attr}`]);
  await admin.delete("marketplace_events", [`id=eq.${life.mkt_event_unattr}`]);
  await admin.delete("marketplace_venue_attributions", [`id=eq.${life.mkt_attr}`]);
  await admin.delete("marketplace_venues", [`id=eq.${life.mkt_venue}`]);
  await admin.delete("marketplace_venues", [`id=eq.${life.mkt_venue_b}`]);
  await admin.delete("marketplace_bdp_units", [`id=eq.${life.mbdp_unit}`]);
  await admin.delete("organisation_memberships", [`id=eq.${life.org_mem_venue}`]);
  await admin.delete("organisation_memberships", [`id=eq.${life.org_mem_ent}`]);
  await admin.delete("organisations", [`id=eq.${life.venue_org_b}`]);
  await admin.delete("organisations", [`id=eq.${life.venue_org_onboard}`]);
  await admin.delete("organisations", [fam]);

  await admin.delete("events", [`id=eq.${domainIds.event}`]);
  await admin.delete("offers", [`id=eq.${domainIds.offer}`]);
  await admin.delete("connect_circle_seats", [
    `id=eq.${fixtureUuid("seat:01")}`,
  ]);
  await admin.delete("connect_circle_seats", [
    `id=eq.${fixtureUuid("seat:multi")}`,
  ]);
  await deleteAssistGraphForCircle(admin, domainIds.circle);
  await admin.delete("connect_circle_meetings", [
    `circle_id=eq.${domainIds.circle}`,
  ]);
  await admin.delete("connect_memberships", [`id=eq.${domainIds.membership}`]);
  await admin.delete("connect_memberships", [
    `id=eq.${domainIds.membershipMulti}`,
  ]);
  await admin.delete("connect_circles", [`id=eq.${domainIds.circle}`]);
  await admin.delete("venues", [`id=eq.${domainIds.venue}`]);
  await admin.delete("enterprise_projects", [`id=eq.${domainIds.project}`]);
  await admin.delete("organisations", [`id=eq.${domainIds.venueOrg}`]);
  await admin.delete("organisations", [`id=eq.${domainIds.enterpriseOrg}`]);
  console.log("  deleted domain fixture rows (best-effort)");

  for (const identity of FIXTURE_IDENTITIES) {
    const email = fixtureEmail(identity);
    const user = await findAuthUserByEmail(admin, email);
    if (!user?.id) continue;
    await clearUserReferencingRows(admin, user.id);
  }

  for (const identity of FIXTURE_IDENTITIES) {
    const email = fixtureEmail(identity);
    await purgeFixtureIdentity(admin, email);
  }

  console.log("Reset complete (fixture-scoped only).");
}

main().catch((err) => {
  console.error("Fixture reset FAILED:", err.message || err);
  process.exit(1);
});
