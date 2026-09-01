/**
 * Phase 14B-R — canonical marketplace/enterprise lifecycle fixtures (gce-dev only).
 * Idempotent upserts. Warn-and-continue on schema mismatches (no migrations).
 */
import { createHash } from "node:crypto";
import { FIXTURE_FAMILY, FIXTURE_PREFIX } from "./constants.mjs";
import { fixtureUuid } from "./env.mjs";

const META = (key, extra = {}) => ({
  fixture_family: FIXTURE_FAMILY,
  fixture_key: key,
  phase: "14B-R",
  synthetic: true,
  ...extra,
});

function sha256Hex(value) {
  return createHash("sha256").update(value).digest("hex");
}

export function lifecycleIds(scopeIds = {}) {
  return {
    mbdp_unit: scopeIds.marketplace_bdp_unit ?? fixtureUuid("unit:marketplace_bdp"),
    ebdp_pack: scopeIds.enterprise_bdp_unit ?? fixtureUuid("unit:enterprise_bdp"),
    venue_org_b: fixtureUuid("org:venue_b"),
    venue_org_onboard: fixtureUuid("org:venue_onboard"),
    mkt_venue: fixtureUuid("mkt:venue:01"),
    mkt_venue_b: fixtureUuid("mkt:venue:02"),
    mkt_attr: fixtureUuid("mkt:attr:01"),
    mkt_event_attr: fixtureUuid("mkt:event:attributed"),
    mkt_event_unattr: fixtureUuid("mkt:event:unattributed"),
    mkt_event_checkin: fixtureUuid("mkt:event:checkin"),
    mkt_offer: fixtureUuid("mkt:offer:01"),
    mkt_offer_expired: fixtureUuid("mkt:offer:expired"),
    mkt_expired_claim: fixtureUuid("mkt:claim:expired"),
    ent_client: fixtureUuid("ent:client:01"),
    ent_attr: fixtureUuid("ent:attr:01"),
    ent_opp: fixtureUuid("ent:opp:01"),
    ent_project_a: scopeIds.enterprise_project ?? fixtureUuid("ent:project:a"),
    ent_project_b: fixtureUuid("ent:project:b"),
    rev_attr: fixtureUuid("fin:rev:attr"),
    rev_unattr: fixtureUuid("fin:rev:unattr"),
    rev_payment: fixtureUuid("fin:rev:payment"),
    mkt_ent_attr: fixtureUuid("mkt:ent:attr"),
    mkt_ent_unattr: fixtureUuid("mkt:ent:unattr"),
    ent_entitlement: fixtureUuid("ent:entitlement:01"),
    org_mem_venue: fixtureUuid("orgmem:venue"),
    org_mem_ent: fixtureUuid("orgmem:enterprise"),
  };
}

async function upsert(admin, table, row, onConflict = "id") {
  const { error } = await admin.upsert(table, row, onConflict);
  if (error) {
    console.warn(`[lifecycle] ${table} upsert skipped:`, error.message);
    return false;
  }
  return true;
}

export async function upsertLifecycleFixtures(admin, userIds, scopeIds) {
  const ids = lifecycleIds(scopeIds);
  const venueUserId = userIds.e2e_venue_rep_01;
  const mbdpUserId = userIds.e2e_marketplace_bdp_01;
  const clientUserId = userIds.e2e_enterprise_client_01;
  const ebdpUserId = userIds.e2e_enterprise_bdp_01;
  const expertUserId = userIds.e2e_enterprise_expert_01;
  const customerB = userIds.e2e_customer_02;
  const venueOrg = scopeIds.venue_org;
  const enterpriseOrg = scopeIds.enterprise_org;

  const starts = new Date();
  starts.setDate(starts.getDate() + 14);
  const ends = new Date(starts);
  ends.setHours(ends.getHours() + 3);

  const campaignStart = new Date();
  campaignStart.setHours(campaignStart.getHours() - 1);
  const campaignEnd = new Date();
  campaignEnd.setDate(campaignEnd.getDate() + 13);
  const expiredCampaignStart = new Date();
  expiredCampaignStart.setDate(expiredCampaignStart.getDate() - 16);
  const expiredCampaignEnd = new Date();
  expiredCampaignEnd.setDate(expiredCampaignEnd.getDate() - 2);

  await admin.delete("marketplace_venues", [
    `organisation_id=eq.${ids.venue_org_onboard}`,
  ]);

  await upsert(admin, "organisations", {
    id: ids.venue_org_b,
    kind: "venue_partner",
    status: "active",
    legal_name: `${FIXTURE_PREFIX} Venue Partner Org B`,
    trading_name: `${FIXTURE_PREFIX} Test Venue B Co`,
    country_code: "IN",
    primary_city: "Bengaluru",
    metadata: META("org:venue_b", { kind: "venue_partner" }),
    created_by: venueUserId,
  });

  await upsert(admin, "organisations", {
    id: ids.venue_org_onboard,
    kind: "venue_partner",
    status: "active",
    legal_name: `${FIXTURE_PREFIX} Venue Onboard Org`,
    trading_name: `${FIXTURE_PREFIX} Onboard Test Co`,
    country_code: "IN",
    primary_city: "Bengaluru",
    metadata: META("org:venue_onboard", { kind: "venue_partner", e2e_onboarding: true }),
    created_by: venueUserId,
  });

  if (venueOrg && venueUserId) {
    await upsert(admin, "organisation_memberships", {
      id: ids.org_mem_venue,
      organisation_id: venueOrg,
      user_id: venueUserId,
      membership_role: "representative",
      status: "active",
      is_primary: true,
      metadata: META("orgmem:venue"),
    });
  }
  if (venueUserId) {
    await upsert(admin, "organisation_memberships", {
      id: fixtureUuid("orgmem:venue_onboard"),
      organisation_id: ids.venue_org_onboard,
      user_id: venueUserId,
      membership_role: "representative",
      status: "active",
      is_primary: false,
      metadata: META("orgmem:venue_onboard"),
    });
  }
  if (enterpriseOrg && clientUserId) {
    await upsert(admin, "organisation_memberships", {
      id: ids.org_mem_ent,
      organisation_id: enterpriseOrg,
      user_id: clientUserId,
      membership_role: "representative",
      status: "active",
      is_primary: true,
      metadata: META("orgmem:enterprise"),
    });
  }

  await upsert(admin, "marketplace_bdp_units", {
    id: ids.mbdp_unit,
    user_id: mbdpUserId,
    application_status: "active",
    package_option: "finance_recovery_60000",
    package_total_minor: 6_000_000,
    initial_payment_minor: 500_000,
    recoverable_balance_minor: 5_500_000,
    recovered_to_date_minor: 0,
    remaining_recoverable_minor: 5_500_000,
    venues_capacity_max: 20,
    active_venue_count: 0,
    activated_at: new Date().toISOString(),
    pricing_rule_version: "fd029-fd033-v1",
    metadata: META("unit:marketplace_bdp"),
  });

  await upsert(admin, "enterprise_bdp_packs", {
    id: ids.ebdp_pack,
    user_id: ebdpUserId,
    application_status: "active",
    package_option: "finance_recovery_36000",
    package_total_minor: 3_600_000,
    initial_payment_minor: 500_000,
    recoverable_balance_minor: 3_100_000,
    recovered_to_date_minor: 0,
    remaining_recoverable_minor: 3_100_000,
    clients_capacity_max: 30,
    active_client_count: 0,
    activated_at: new Date().toISOString(),
    pricing_rule_version: "fd026-v1",
    metadata: META("unit:enterprise_bdp"),
  });

  await upsert(admin, "marketplace_venues", {
    id: ids.mkt_venue,
    organisation_id: venueOrg,
    legacy_venue_id: scopeIds.venue ?? null,
    display_name: `${FIXTURE_PREFIX} Marketplace Venue A`,
    legal_name: `${FIXTURE_PREFIX} Test Venue Co`,
    city: "Bengaluru",
    state: "Karnataka",
    address: "E2E Synthetic Address A, Bengaluru",
    category: "event_space",
    status: "active",
    verification_status: "verified",
    submitted_by: venueUserId,
    recommended_by_unit_id: ids.mbdp_unit,
    recommended_by_user_id: mbdpUserId,
    recommended_at: new Date().toISOString(),
    approved_at: new Date().toISOString(),
    metadata: META("mkt:venue:01"),
  });

  await upsert(admin, "marketplace_venues", {
    id: ids.mkt_venue_b,
    organisation_id: ids.venue_org_b,
    display_name: `${FIXTURE_PREFIX} Marketplace Venue B`,
    legal_name: `${FIXTURE_PREFIX} Test Venue B Co`,
    city: "Bengaluru",
    state: "Karnataka",
    address: "E2E Synthetic Address B, Bengaluru",
    category: "event_space",
    status: "active",
    verification_status: "verified",
    submitted_by: null,
    metadata: META("mkt:venue:02", { unattributed: true }),
  });

  await upsert(admin, "marketplace_venue_attributions", {
    id: ids.mkt_attr,
    venue_id: ids.mkt_venue,
    unit_id: ids.mbdp_unit,
    bdp_user_id: mbdpUserId,
    status: "active",
    provenance: "sourced",
    basis: "Phase 14B-R attributed fixture",
    effective_from: new Date().toISOString(),
    created_by: mbdpUserId,
    approved_by: userIds.e2e_platform_ops_01 ?? null,
    metadata: META("mkt:attr:01"),
  });

  await upsert(admin, "marketplace_events", {
    id: ids.mkt_event_attr,
    venue_id: ids.mkt_venue,
    title: `${FIXTURE_PREFIX} Networking Evening`,
    description: "Synthetic attributed Marketplace Event for Phase 14B-R booking.",
    category: "Networking",
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    capacity: 40,
    price_minor: 0,
    currency: "INR",
    status: "published",
    cancel_cutoff_hours: 48,
    cancel_policy_version: "fd039-48h-default-v1",
    attribution_id: ids.mkt_attr,
    submitted_by: venueUserId,
    published_at: new Date().toISOString(),
    metadata: META("mkt:event:attributed", { attributed: true }),
  });

  await upsert(admin, "marketplace_events", {
    id: ids.mkt_event_checkin,
    venue_id: ids.mkt_venue,
    title: `${FIXTURE_PREFIX} Check-in Only Evening`,
    description:
      "Dedicated attributed Marketplace Event for venue check-in E2E (isolated capacity).",
    category: "Networking",
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    capacity: 40,
    price_minor: 0,
    currency: "INR",
    status: "published",
    cancel_cutoff_hours: 48,
    cancel_policy_version: "fd039-48h-default-v1",
    attribution_id: ids.mkt_attr,
    submitted_by: venueUserId,
    published_at: new Date().toISOString(),
    metadata: META("mkt:event:checkin", { checkin_only: true }),
  });

  await upsert(admin, "marketplace_events", {
    id: ids.mkt_event_unattr,
    venue_id: ids.mkt_venue_b,
    title: `${FIXTURE_PREFIX} Unattributed Mixer`,
    description: "Synthetic unattributed Marketplace Event (80/0/20).",
    category: "Networking",
    starts_at: starts.toISOString(),
    ends_at: ends.toISOString(),
    capacity: 40,
    price_minor: 0,
    currency: "INR",
    status: "published",
    cancel_cutoff_hours: 48,
    cancel_policy_version: "fd039-48h-default-v1",
    attribution_id: null,
    submitted_by: venueUserId,
    published_at: new Date().toISOString(),
    metadata: META("mkt:event:unattributed", { attributed: false }),
  });

  await upsert(admin, "marketplace_offer_events", {
    id: ids.mkt_offer,
    venue_id: ids.mkt_venue,
    title: `${FIXTURE_PREFIX} Dining Claim`,
    description: "Synthetic offer claim — not a purchase, not revenue.",
    planned_commercial_value_minor: 5_000_000,
    campaign_starts_at: campaignStart.toISOString(),
    campaign_ends_at: campaignEnd.toISOString(),
    customer_cap: 100,
    claim_validity_hours: 72,
    status: "published",
    claims_count: 0,
    attribution_id: ids.mkt_attr,
    submitted_by: venueUserId,
    published_at: new Date().toISOString(),
    metadata: META("mkt:offer:01"),
  });

  await upsert(admin, "marketplace_offer_events", {
    id: ids.mkt_offer_expired,
    venue_id: ids.mkt_venue,
    title: `${FIXTURE_PREFIX} Expired Claim Offer`,
    description: "Synthetic offer used only for expired-claim redemption rejection.",
    planned_commercial_value_minor: 5_000_000,
    campaign_starts_at: expiredCampaignStart.toISOString(),
    campaign_ends_at: expiredCampaignEnd.toISOString(),
    customer_cap: 100,
    claim_validity_hours: 72,
    status: "published",
    claims_count: 1,
    submitted_by: venueUserId,
    published_at: new Date().toISOString(),
    metadata: META("mkt:offer:expired"),
  });

  if (customerB) {
    const claimedAt = new Date();
    claimedAt.setDate(claimedAt.getDate() - 4);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() - 1);
    await upsert(admin, "marketplace_offer_claims", {
      id: ids.mkt_expired_claim,
      offer_event_id: ids.mkt_offer_expired,
      claimant_user_id: customerB,
      claim_token_hash: sha256Hex("e2e-expired-claim-token"),
      status: "claimed",
      claimed_at: claimedAt.toISOString(),
      expires_at: expiresAt.toISOString(),
      metadata: META("mkt:claim:expired"),
    });
  }

  const eligible = 1_000_000;
  await upsert(admin, "marketplace_revenue_entitlements", {
    id: ids.mkt_ent_attr,
    earning_event_key: "e2e-mkt-attr-booking",
    source_type: "booking",
    source_id: ids.mkt_event_attr,
    venue_id: ids.mkt_venue,
    attribution_id: ids.mkt_attr,
    unit_id: ids.mbdp_unit,
    eligible_revenue_minor: eligible,
    venue_share_minor: 800_000,
    mbdp_share_minor: 100_000,
    gce_share_minor: 100_000,
    mbdp_commission_bps: 1000,
    has_valid_attribution: true,
    state: "earned",
    rule_version: "fd029-fd037-v1",
    metadata: META("mkt:ent:attr"),
  });
  await upsert(admin, "marketplace_revenue_entitlements", {
    id: ids.mkt_ent_unattr,
    earning_event_key: "e2e-mkt-unattr-booking",
    source_type: "booking",
    source_id: ids.mkt_event_unattr,
    venue_id: ids.mkt_venue_b,
    attribution_id: null,
    unit_id: null,
    eligible_revenue_minor: eligible,
    venue_share_minor: 800_000,
    mbdp_share_minor: 0,
    gce_share_minor: 200_000,
    mbdp_commission_bps: 0,
    has_valid_attribution: false,
    state: "earned",
    rule_version: "fd029-fd037-v1",
    metadata: META("mkt:ent:unattr", { missing_mbdp_is_not_pending: true }),
  });

  await upsert(admin, "revenue_components", {
    id: ids.rev_attr,
    revenue_component_key: "e2e-mkt-attr-01",
    vertical: "marketplace",
    domain_object_type: "marketplace_event",
    domain_object_id: ids.mkt_event_attr,
    currency: "INR",
    gross_amount_minor: eligible,
    excluded_amount_minor: 0,
    tax_amount_minor: 0,
    eligible_base_minor: eligible,
    recognition_status: "recognised",
    recognised_at: new Date().toISOString(),
    rule_version: "phase9-v1",
    attribution_snapshot: { attributed: true, split: "80/10/10" },
    metadata: META("fin:rev:attr"),
  });
  await upsert(admin, "revenue_components", {
    id: ids.rev_unattr,
    revenue_component_key: "e2e-mkt-unattr-01",
    vertical: "marketplace",
    domain_object_type: "marketplace_event",
    domain_object_id: ids.mkt_event_unattr,
    currency: "INR",
    gross_amount_minor: eligible,
    excluded_amount_minor: 0,
    tax_amount_minor: 0,
    eligible_base_minor: eligible,
    recognition_status: "recognised",
    recognised_at: new Date().toISOString(),
    rule_version: "phase9-v1",
    attribution_snapshot: { attributed: false, split: "80/0/20" },
    metadata: META("fin:rev:unattr"),
  });
  await upsert(admin, "revenue_components", {
    id: ids.rev_payment,
    revenue_component_key: "e2e-mkt-payment-only-01",
    vertical: "marketplace",
    domain_object_type: "marketplace_event",
    domain_object_id: ids.mkt_event_attr,
    currency: "INR",
    gross_amount_minor: eligible,
    excluded_amount_minor: 0,
    tax_amount_minor: 0,
    eligible_base_minor: eligible,
    recognition_status: "payment_received",
    rule_version: "phase9-v1",
    metadata: META("fin:rev:payment", { payment_is_not_revenue: true }),
  });

  const stakeRows = [
    {
      id: fixtureUuid("fin:stake:attr-venue"),
      earning_event_key: "e2e-mkt-attr-venue",
      revenue_component_id: ids.rev_attr,
      revenue_component_key: "e2e-mkt-attr-01",
      stakeholder_type: "venue",
      source_vertical: "marketplace",
      rule_key: "marketplace_attributed_venue",
      rule_version: "fd029-fd037-v1",
      gross_eligible_basis_minor: eligible,
      rate_bps: 8000,
      gross_entitlement_minor: 800_000,
      net_settlement_eligible_minor: 800_000,
      status: "earned",
    },
    {
      id: fixtureUuid("fin:stake:attr-mbdp"),
      earning_event_key: "e2e-mkt-attr-mbdp",
      revenue_component_id: ids.rev_attr,
      revenue_component_key: "e2e-mkt-attr-01",
      stakeholder_user_id: mbdpUserId,
      stakeholder_type: "marketplace_bdp",
      source_vertical: "marketplace",
      rule_key: "marketplace_attributed_mbdp",
      rule_version: "fd029-fd037-v1",
      gross_eligible_basis_minor: eligible,
      rate_bps: 1000,
      gross_entitlement_minor: 100_000,
      net_settlement_eligible_minor: 100_000,
      status: "earned",
    },
    {
      id: fixtureUuid("fin:stake:unattr-venue"),
      earning_event_key: "e2e-mkt-unattr-venue",
      revenue_component_id: ids.rev_unattr,
      revenue_component_key: "e2e-mkt-unattr-01",
      stakeholder_type: "venue",
      source_vertical: "marketplace",
      rule_key: "marketplace_unattributed_venue",
      rule_version: "fd029-fd037-v1",
      gross_eligible_basis_minor: eligible,
      rate_bps: 8000,
      gross_entitlement_minor: 800_000,
      net_settlement_eligible_minor: 800_000,
      status: "earned",
    },
    {
      id: fixtureUuid("fin:stake:unattr-gce"),
      earning_event_key: "e2e-mkt-unattr-gce",
      revenue_component_id: ids.rev_unattr,
      revenue_component_key: "e2e-mkt-unattr-01",
      stakeholder_type: "gce_platform",
      source_vertical: "marketplace",
      rule_key: "marketplace_unattributed_gce",
      rule_version: "fd029-fd037-v1",
      gross_eligible_basis_minor: eligible,
      rate_bps: 2000,
      gross_entitlement_minor: 200_000,
      net_settlement_eligible_minor: 200_000,
      status: "earned",
    },
  ];
  for (const row of stakeRows) {
    await upsert(admin, "stakeholder_entitlements", {
      ...row,
      recovery_deduction_minor: 0,
      reversal_amount_minor: 0,
      metadata: META(row.earning_event_key),
    });
  }

  await upsert(admin, "enterprise_client_profiles", {
    id: ids.ent_client,
    organisation_id: enterpriseOrg,
    display_name: `${FIXTURE_PREFIX} Enterprise Client`,
    industry: "professional_services",
    status: "active",
    verification_status: "verified",
    primary_representative_user_id: clientUserId,
    engagement_status: "active",
    metadata: META("ent:client:01"),
  });

  await upsert(admin, "enterprise_client_attributions", {
    id: ids.ent_attr,
    client_id: ids.ent_client,
    pack_id: ids.ebdp_pack,
    bdp_user_id: ebdpUserId,
    status: "active",
    provenance: "sourced",
    basis: "Phase 14B-R attributed Enterprise Client",
    effective_from: new Date().toISOString(),
    created_by: ebdpUserId,
    approved_by: userIds.e2e_platform_ops_01 ?? null,
    metadata: META("ent:attr:01"),
  });

  await upsert(admin, "enterprise_opportunities", {
    id: ids.ent_opp,
    client_id: ids.ent_client,
    title: `${FIXTURE_PREFIX} Enterprise Opportunity`,
    summary: "Synthetic opportunity for co-sign and milestone probes.",
    category: "events",
    status: "quoting",
    source: "fixture",
    priority: "normal",
    expected_budget_min_minor: 40_000_000,
    expected_budget_max_minor: 80_000_000,
    client_rep_user_id: clientUserId,
    attributed_bdp_user_id: ebdpUserId,
    pack_id: ids.ebdp_pack,
    owner_user_id: expertUserId,
    expert_user_id: expertUserId,
    metadata: META("ent:opp:01"),
  });

  await upsert(admin, "enterprise_projects", {
    id: ids.ent_project_a,
    client_id: ids.ent_client,
    opportunity_id: ids.ent_opp,
    project_ref: "E2E-PRJ-A",
    title: `${FIXTURE_PREFIX} Project A (2 milestones)`,
    status: "active",
    owner_user_id: expertUserId,
    attribution_id: ids.ent_attr,
    pack_id: ids.ebdp_pack,
    commercial_total_minor: 20_000_000,
    gce_execution_role: "platform_intermediary",
    metadata: META("ent:project:a", { milestone_count: 2 }),
  });
  await upsert(admin, "enterprise_projects", {
    id: ids.ent_project_b,
    client_id: ids.ent_client,
    opportunity_id: ids.ent_opp,
    project_ref: "E2E-PRJ-B",
    title: `${FIXTURE_PREFIX} Project B (4 milestones)`,
    status: "active",
    owner_user_id: expertUserId,
    attribution_id: ids.ent_attr,
    pack_id: ids.ebdp_pack,
    commercial_total_minor: 40_000_000,
    gce_execution_role: "platform_intermediary",
    metadata: META("ent:project:b", { milestone_count: 4 }),
  });

  const milestonesA = [
    { key: "a1", name: "Kickoff", order: 1, pct: 4000 },
    { key: "a2", name: "Close", order: 2, pct: 6000 },
  ];
  const milestonesB = [
    { key: "b1", name: "Discovery", order: 1, pct: 2000 },
    { key: "b2", name: "Design", order: 2, pct: 2500 },
    { key: "b3", name: "Build", order: 3, pct: 3500 },
    { key: "b4", name: "Handover", order: 4, pct: 2000 },
  ];
  for (const m of milestonesA) {
    await upsert(admin, "enterprise_milestones", {
      id: fixtureUuid(`ent:ms:${m.key}`),
      project_id: ids.ent_project_a,
      name: m.name,
      percentage_bps: m.pct,
      status: "planned",
      sort_order: m.order,
      metadata: META(`ent:ms:${m.key}`),
    });
  }
  for (const m of milestonesB) {
    await upsert(admin, "enterprise_milestones", {
      id: fixtureUuid(`ent:ms:${m.key}`),
      project_id: ids.ent_project_b,
      name: m.name,
      percentage_bps: m.pct,
      status: "planned",
      sort_order: m.order,
      metadata: META(`ent:ms:${m.key}`),
    });
  }

  const platformCommission = 2_000_000;
  const ebdpShare = 500_000;
  await upsert(admin, "enterprise_revenue_entitlements", {
    id: ids.ent_entitlement,
    earning_event_key: "e2e-ent-attr-01",
    client_id: ids.ent_client,
    project_id: ids.ent_project_a,
    revenue_component_key: "e2e-ent-comp-01",
    attribution_id: ids.ent_attr,
    pack_id: ids.ebdp_pack,
    eligible_event_revenue_minor: 10_000_000,
    platform_commission_minor: platformCommission,
    ebdp_entitlement_bps: 2500,
    ebdp_entitlement_minor: ebdpShare,
    has_valid_attribution: true,
    state: "earned",
    rule_version: "fd026-fd038-v1",
    metadata: META("ent:entitlement:01", {
      note: "25% of platform commission, not of project value",
    }),
  });

  return ids;
}
