/**
 * Fixture identity cleanup — auth.users + public.users stay in sync.
 * gce-dev only (callers must use createFixtureAdminClient).
 */
import { FIXTURE_FAMILY } from "./constants.mjs";
import { findAuthUserByEmail } from "./seed.mjs";

/** Tables that may block auth.users / public.users delete for fixture teardown. */
const USER_REF_DELETE_SPECS = [
  (id) => ["ops_approval_queue", `requester_user_id=eq.${id}`],
  (id) => ["ops_approval_queue", `assignee_user_id=eq.${id}`],
  (id) => ["ops_approval_queue", `decided_by=eq.${id}`],
  (id) => ["ops_cases", `requester_user_id=eq.${id}`],
  (id) => ["ops_cases", `subject_user_id=eq.${id}`],
  (id) => ["ops_cases", `owner_user_id=eq.${id}`],
  (id) => ["ops_exception_queue", `owner_user_id=eq.${id}`],
  (id) => ["ops_overrides", `requester_user_id=eq.${id}`],
  (id) => ["audit_events", `actor_user_id=eq.${id}`],
  (id) => ["organisations", `created_by=eq.${id}`],
  (id) => ["marketplace_venues", `submitted_by=eq.${id}`],
  (id) => ["connect_circles", `created_by=eq.${id}`],
  (id) => ["customer_trust_rank_events", `user_id=eq.${id}`],
  (id) => ["customer_domain_events", `actor_user_id=eq.${id}`],
  (id) => ["assist_lead_assignments", `receiver_user_id=eq.${id}`],
  (id) => ["assist_lead_assignments", `assigned_by=eq.${id}`],
  (id) => ["assist_lead_routing_candidates", `candidate_user_id=eq.${id}`],
  (id) => ["assist_contact_reveal_events", `viewer_user_id=eq.${id}`],
  (id) => ["assist_domain_events", `actor_user_id=eq.${id}`],
  (id) => ["assist_closed_business_confirmations", `party_user_id=eq.${id}`],
  (id) => ["payment_intents", `payer_user_id=eq.${id}`],
  (id) => ["connect_circle_meetings", `created_by=eq.${id}`],
  (id) => [
    "organisations",
    `created_by=eq.${id}`,
    `metadata=cs.${encodeURIComponent(
      JSON.stringify({ fixture_family: FIXTURE_FAMILY })
    )}`,
  ],
  (id) => ["role_assignments", `user_id=eq.${id}`],
  (id) => ["organisation_memberships", `user_id=eq.${id}`],
];

async function bestEffortDelete(admin, table, filters) {
  const { error } = await admin.delete(table, filters);
  if (error) {
    console.warn(`  warn delete ${table}:`, error.message);
  }
}

export async function clearUserReferencingRows(admin, userId) {
  if (!userId) return;
  await deleteAssistGraphForGiver(admin, userId);
  await deleteCirclesCreatedBy(admin, userId);
  for (const spec of USER_REF_DELETE_SPECS) {
    const parts = spec(userId);
    const table = parts[0];
    const filters = parts.slice(1);
    await bestEffortDelete(admin, table, filters);
  }
}

async function deleteAssistGraphForLeadIds(admin, leadIds) {
  if (!leadIds.length) return;
  const inIds = `in.(${leadIds.join(",")})`;
  const inLeads = `lead_id=${inIds}`;
  await bestEffortDelete(admin, "assist_lead_duplicate_flags", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_duplicate_flags", [
    `related_lead_id=${inIds}`,
  ]);
  await bestEffortDelete(admin, "assist_contact_reveal_events", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_reassignments", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_assignment_events", [inLeads]);
  await bestEffortDelete(admin, "assist_closed_business_confirmations", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_outcomes", [inLeads]);
  await bestEffortDelete(admin, "assist_opportunity_desk_queue", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_abuse_flags", [inLeads]);
  await bestEffortDelete(admin, "assist_domain_events", [inLeads]);
  await bestEffortDelete(admin, "assist_lead_assignments", [inLeads]);
  await bestEffortDelete(admin, "assist_leads", [`id=${inIds}`]);
}

async function deleteCirclesCreatedBy(admin, userId) {
  const { data, error } = await admin.select("connect_circles", {
    filters: [`created_by=eq.${userId}`],
    select: "id",
  });
  if (error) {
    console.warn("  warn list connect_circles for user:", error.message);
    return;
  }
  for (const row of Array.isArray(data) ? data : []) {
    if (!row?.id) continue;
    await deleteAssistGraphForCircle(admin, row.id);
    await bestEffortDelete(admin, "connect_circle_meetings", [
      `circle_id=eq.${row.id}`,
    ]);
    await bestEffortDelete(admin, "connect_circle_seats", [
      `circle_id=eq.${row.id}`,
    ]);
    await bestEffortDelete(admin, "connect_memberships", [
      `circle_id=eq.${row.id}`,
    ]);
    await bestEffortDelete(admin, "connect_circles", [`id=eq.${row.id}`]);
  }
}

export async function deleteAssistGraphForCircle(admin, circleId) {
  if (!circleId) return;
  const { data, error } = await admin.select("assist_leads", {
    filters: [`origin_circle_id=eq.${circleId}`],
    select: "id",
  });
  if (error) {
    console.warn("  warn list assist_leads for circle:", error.message);
    return;
  }
  const leadIds = (Array.isArray(data) ? data : [])
    .map((row) => row?.id)
    .filter(Boolean);
  await deleteAssistGraphForLeadIds(admin, leadIds);
}

async function deleteAssistGraphForGiver(admin, userId) {
  const { data, error } = await admin.select("assist_leads", {
    filters: [`giver_user_id=eq.${userId}`],
    select: "id",
  });
  if (error) {
    console.warn("  warn list assist_leads for giver:", error.message);
    return;
  }
  const leadIds = (Array.isArray(data) ? data : [])
    .map((row) => row?.id)
    .filter(Boolean);
  await deleteAssistGraphForLeadIds(admin, leadIds);
}

/**
 * Remove all public.users (+ profiles) rows for an email.
 * Does not delete auth.users.
 */
export async function purgePublicUserByEmail(admin, email) {
  const enc = encodeURIComponent(email);
  const { data, error } = await admin.select("users", {
    filters: [`email=eq.${enc}`],
    select: "id",
  });
  if (error) {
    console.warn(`  warn list public.users for ${email}:`, error.message);
    return;
  }
  for (const row of Array.isArray(data) ? data : []) {
    if (!row?.id) continue;
    await bestEffortDelete(admin, "profiles", [`user_id=eq.${row.id}`]);
    await clearUserReferencingRows(admin, row.id);
    await bestEffortDelete(admin, "users", [`id=eq.${row.id}`]);
  }
}

/**
 * Drop public.users rows that share an email but a different id (stale auth re-provision).
 */
export async function removeOrphanPublicUsersForEmail(admin, email, keepUserId) {
  const enc = encodeURIComponent(email);
  const { data, error } = await admin.select("users", {
    filters: [`email=eq.${enc}`],
    select: "id",
  });
  if (error) {
    console.warn(`  warn orphan scan public.users for ${email}:`, error.message);
    return;
  }
  for (const row of Array.isArray(data) ? data : []) {
    if (!row?.id || row.id === keepUserId) continue;
    await bestEffortDelete(admin, "profiles", [`user_id=eq.${row.id}`]);
    await clearUserReferencingRows(admin, row.id);
    await bestEffortDelete(admin, "users", [`id=eq.${row.id}`]);
  }
}

/**
 * Full teardown for one fixture email: FK cleanup → profiles → public.users → auth.users.
 */
export async function purgeFixtureIdentity(admin, email) {
  const authUser = await findAuthUserByEmail(admin, email);

  if (authUser?.id) {
    await clearUserReferencingRows(admin, authUser.id);
    await bestEffortDelete(admin, "profiles", [`user_id=eq.${authUser.id}`]);
    await bestEffortDelete(admin, "users", [`id=eq.${authUser.id}`]);
    const del = await admin.auth.admin.deleteUser(authUser.id);
    if (del.error) {
      throw new Error(`delete auth ${email}: ${del.error.message}`);
    }
    console.log(`  deleted auth user ${email}`);
  }

  // Sweep any orphan public.users rows (email unique; id may differ from last auth user).
  await purgePublicUserByEmail(admin, email);
}
