import {
  ASSOCIATE_PLAN_ID,
  FIXTURE_FAMILY,
  FIXTURE_IDENTITIES,
  FIXTURE_PREFIX,
  fixtureEmail,
} from "./constants.mjs";
import { fixtureUuid } from "./env.mjs";

const META = (key, extra = {}) => ({
  fixture_family: FIXTURE_FAMILY,
  fixture_key: key,
  phase: "14B-F",
  synthetic: true,
  ...extra,
});

async function findAuthUserByEmail(admin, email) {
  const { data: pubs } = await admin.select("users", {
    filters: [`email=eq.${encodeURIComponent(email)}`],
    select: "id",
    limit: 1,
  });
  const pub = Array.isArray(pubs) ? pubs[0] : null;
  if (pub?.id) {
    const byId = await admin.auth.admin.getUserById(pub.id);
    if (!byId.error && byId.data?.user) return byId.data.user;
  }

  for (let page = 1; page <= 10; page++) {
    const list = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (list.error) throw list.error;
    const users = list.data?.users || [];
    const hit = users.find(
      (u) => (u.email || "").toLowerCase() === email.toLowerCase()
    );
    if (hit) return hit;
    if (users.length < 200) break;
  }
  return null;
}

/**
 * Ensure auth user + public.users + profiles for one identity.
 */
export async function upsertFixtureUser(admin, identity, password) {
  const email = fixtureEmail(identity);
  let user = await findAuthUserByEmail(admin, email);

  if (!user) {
    const created = await admin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name: identity.displayName,
        fixture_family: FIXTURE_FAMILY,
        fixture_key: identity.key,
      },
      app_metadata: {
        fixture_family: FIXTURE_FAMILY,
        fixture_key: identity.key,
      },
    });
    if (created.error) {
      user = await findAuthUserByEmail(admin, email);
      if (!user) throw created.error;
    } else {
      user = created.data.user;
    }
  }

  {
    const updated = await admin.auth.admin.updateUserById(user.id, {
      password,
      email_confirm: true,
      user_metadata: {
        ...(user.user_metadata || {}),
        full_name: identity.displayName,
        fixture_family: FIXTURE_FAMILY,
        fixture_key: identity.key,
      },
      app_metadata: {
        ...(user.app_metadata || {}),
        fixture_family: FIXTURE_FAMILY,
        fixture_key: identity.key,
      },
    });
    if (updated.error) throw updated.error;
    user = updated.data.user;
  }

  const { error: userErr } = await admin.upsert(
    "users",
    {
      id: user.id,
      email,
      name: identity.displayName,
      city: "Bengaluru",
      role: "member",
    },
    "id"
  );
  if (userErr) throw userErr;

  const { error: profileErr } = await admin.upsert(
    "profiles",
    {
      user_id: user.id,
      display_name: identity.displayName,
      legal_name: identity.displayName,
      locale: "en-IN",
      timezone: "Asia/Kolkata",
      metadata: META(identity.key, { kind: "identity" }),
    },
    "user_id"
  );
  if (profileErr) throw profileErr;

  return user.id;
}

export async function upsertDomainFixtures(admin, userIds) {
  const ids = {
    venue_org: fixtureUuid("org:venue"),
    enterprise_org: fixtureUuid("org:enterprise"),
    venue: fixtureUuid("venue:01"),
    circle: fixtureUuid("circle:01"),
    connect_bdp_unit: fixtureUuid("unit:connect_bdp"),
    marketplace_bdp_unit: fixtureUuid("unit:marketplace_bdp"),
    enterprise_bdp_unit: fixtureUuid("unit:enterprise_bdp"),
    enterprise_project: fixtureUuid("project:01"),
    prm_city_scope: fixtureUuid("scope:city:bengaluru"),
    event: fixtureUuid("event:01"),
    offer: fixtureUuid("offer:01"),
    membership: fixtureUuid("membership:01"),
  };

  const venueUserId = userIds.e2e_venue_rep_01;
  const memberUserId = userIds.e2e_connect_member_01;
  const multiUserId = userIds.e2e_multi_role_01;
  const clientUserId = userIds.e2e_enterprise_client_01;

  for (const row of [
    {
      id: ids.venue_org,
      kind: "venue_partner",
      status: "active",
      legal_name: `${FIXTURE_PREFIX} Venue Partner Org`,
      trading_name: `${FIXTURE_PREFIX} Test Venue Co`,
      country_code: "IN",
      primary_city: "Bengaluru",
      metadata: META("org:venue", { kind: "venue_partner" }),
      created_by: venueUserId,
    },
    {
      id: ids.enterprise_org,
      kind: "enterprise_client",
      status: "active",
      legal_name: `${FIXTURE_PREFIX} Enterprise Client Org`,
      trading_name: `${FIXTURE_PREFIX} Test Enterprise`,
      country_code: "IN",
      primary_city: "Bengaluru",
      metadata: META("org:enterprise", { kind: "enterprise_client" }),
      created_by: clientUserId,
    },
  ]) {
    const { error } = await admin.upsert("organisations", row, "id");
    if (error) throw error;
  }

  {
    const { error } = await admin.upsert(
      "venues",
      {
        id: ids.venue,
        name: `${FIXTURE_PREFIX} Test Venue Bengaluru`,
        address: "E2E Synthetic Address, Bengaluru",
        city: "Bengaluru",
        type: "event_space",
        status: "active",
        user_id: venueUserId,
        capacity: 40,
        referral_code: "E2E-VENUE-01",
      },
      "id"
    );
    if (error) throw error;
  }

  {
    const { error } = await admin.upsert(
      "connect_circles",
      {
        id: ids.circle,
        code: "E2E-BLR-01",
        name: `${FIXTURE_PREFIX} Bengaluru Test Circle`,
        city: "Bengaluru",
        district: "Bengaluru Urban",
        state: "Karnataka",
        locality: "E2E Test Locality",
        lifecycle_status: "active_growth",
        constitution_status: "provisionally_active_circle",
        capacity_max: 40,
        active_seat_count: 1,
        metadata: META("circle:01"),
        created_by: memberUserId,
      },
      "id"
    );
    if (error) throw error;
  }

  for (const [key, uid] of [
    ["membership:01", memberUserId],
    ["membership:multi", multiUserId],
  ]) {
    const mid = fixtureUuid(key);
    if (key === "membership:01") ids.membership = mid;
    if (key === "membership:multi") ids.membershipMulti = mid;
    const { error } = await admin.upsert(
      "connect_memberships",
      {
        id: mid,
        user_id: uid,
        plan_id: ASSOCIATE_PLAN_ID,
        status: "active",
        allocation_status: "allocated",
        preferred_city: "Bengaluru",
        preferred_state: "Karnataka",
        activated_at: new Date().toISOString(),
        starts_at: new Date().toISOString(),
        pricing_rule_version: "phase14b-e2e",
        specialisation_id: "9c442a98-3674-4d84-a6b3-8d56e42eaf0e",
        metadata: META(key),
      },
      "id"
    );
    if (error) {
      console.warn(
        `[fixture] connect_memberships upsert skipped for ${key}:`,
        error.message
      );
    }
  }

  for (const [key, membershipKey] of [
    ["seat:01", "membership:01"],
    ["seat:multi", "membership:multi"],
  ]) {
    const seatId = fixtureUuid(key);
    const membershipId = fixtureUuid(membershipKey);
    const { error } = await admin.upsert(
      "connect_circle_seats",
      {
        id: seatId,
        circle_id: ids.circle,
        membership_id: membershipId,
        status: "allocated",
        counts_toward_capacity: true,
        allocated_at: new Date().toISOString(),
        confirmed_at: new Date().toISOString(),
        metadata: META(key),
      },
      "id"
    );
    if (error) {
      console.warn(
        `[fixture] connect_circle_seats upsert skipped for ${key}:`,
        error.message
      );
    }
  }

  {
    const future = new Date();
    future.setDate(future.getDate() + 21);
    const ymd = future.toISOString().slice(0, 10);
    const { error } = await admin.upsert(
      "events",
      {
        id: ids.event,
        title: `${FIXTURE_PREFIX} Networking Evening`,
        venue: `${FIXTURE_PREFIX} Test Venue Bengaluru`,
        city: "Bengaluru",
        date: ymd,
        time: "18:30",
        price: 0,
        capacity: 25,
        registered: 0,
        category: "Networking",
        status: "published",
        vertical: "marketplace",
        description:
          "Synthetic Phase 14B-F fixture event for booking/check-in.",
        user_id: venueUserId,
        venue_id: ids.venue,
      },
      "id"
    );
    if (error) throw error;
  }

  {
    const expiry = new Date();
    expiry.setDate(expiry.getDate() + 60);
    const { error } = await admin.upsert(
      "offers",
      {
        id: ids.offer,
        code: "E2E-OFFER-01",
        discount: "E2E synthetic claim — no revenue",
        description: "Phase 14B-F fixture offer for claim/redemption UX",
        supplier: `${FIXTURE_PREFIX} Test Venue Bengaluru`,
        claimed: 0,
        max_claims: 100,
        expiry: expiry.toISOString().slice(0, 10),
        category: "dining",
        status: "active",
      },
      "id"
    );
    if (error) throw error;
  }

  {
    const { error } = await admin.insert("enterprise_projects", {
      id: ids.enterprise_project,
      organisation_id: ids.enterprise_org,
      title: `${FIXTURE_PREFIX} Enterprise Project`,
      status: "draft",
      metadata: META("project:01"),
      created_by: clientUserId,
    });
    if (error && !/duplicate|already exists|23505/i.test(error.message)) {
      console.warn(
        "[fixture] enterprise_projects insert skipped:",
        error.message
      );
    }
  }

  return ids;
}

export async function upsertRoleAssignments(admin, userIds, scopeIds) {
  const created = [];

  for (const identity of FIXTURE_IDENTITIES) {
    const userId = userIds[identity.key];
    if (!userId) continue;

    await admin.delete("role_assignments", [
      `user_id=eq.${userId}`,
      `metadata=cs.${encodeURIComponent(
        JSON.stringify({ fixture_family: FIXTURE_FAMILY })
      )}`,
    ]);

    for (const role of identity.roles) {
      const scopeId = role.scopeIdFrom ? scopeIds[role.scopeIdFrom] ?? null : null;
      const organisationId = role.organisationFrom
        ? scopeIds[role.organisationFrom] ?? null
        : null;

      const row = {
        id: fixtureUuid(`ra:${identity.key}:${role.roleKey}`),
        user_id: userId,
        role_key: role.roleKey,
        status: "active",
        scope_type: role.scopeType,
        scope_id: scopeId,
        organisation_id: organisationId,
        title: role.title ?? null,
        effective_from: new Date().toISOString(),
        effective_to: null,
        metadata: META(identity.key, {
          role_key: role.roleKey,
          env_email_key: identity.envEmailKey,
        }),
        approved_at: new Date().toISOString(),
      };

      const { error } = await admin.upsert("role_assignments", row, "id");
      if (error) throw error;
      created.push({
        fixture: identity.key,
        email: fixtureEmail(identity),
        role: role.roleKey,
        scopeType: role.scopeType,
        scopeId,
        organisationId,
        assignmentId: row.id,
      });
    }
  }

  return created;
}

export { findAuthUserByEmail };
