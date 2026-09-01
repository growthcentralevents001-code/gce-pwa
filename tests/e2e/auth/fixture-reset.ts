/**
 * gce-dev-only fixture-scoped resets for idempotent deep E2E.
 * Refuses production project ref. Never unfiltered.
 */
import { loadTestEnv } from "./helpers";

const GCE_DEV_PROJECT_REF = "hvevqoltcwumcvxetxsf";
const GCE_PROD_PROJECT_REF = "tzeqeywezmqslovpflqu";

function adminRest() {
  loadTestEnv();
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  if (!url || !serviceKey) {
    throw new Error("Missing Supabase env for fixture reset");
  }
  const host = new URL(url).hostname;
  if (host.includes(GCE_PROD_PROJECT_REF)) {
    throw new Error("REFUSED: production Supabase project");
  }
  if (!host.includes(GCE_DEV_PROJECT_REF)) {
    throw new Error(`REFUSED: expected gce-dev (${GCE_DEV_PROJECT_REF})`);
  }
  const rest = `${url.replace(/\/$/, "")}/rest/v1`;
  const headers = {
    apikey: serviceKey,
    Authorization: `Bearer ${serviceKey}`,
    Prefer: "return=minimal",
  };
  return { rest, headers };
}

async function deleteFiltered(table: string, filter: string) {
  const { rest, headers } = adminRest();
  const res = await fetch(`${rest}/${table}?${filter}`, {
    method: "DELETE",
    headers,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`fixture reset ${table} failed: ${res.status} ${text}`);
  }
}

/** Clear live claims/redemptions/visits on the reusable fixture offer so claim→visit→redeem can re-run. */
export async function resetFixtureOfferClaims(offerEventId: string) {
  if (!offerEventId) throw new Error("offerEventId required");
  await deleteFiltered(
    "marketplace_redemptions",
    `offer_event_id=eq.${offerEventId}`
  );
  await deleteFiltered(
    "marketplace_offer_visits",
    `offer_event_id=eq.${offerEventId}`
  );
  await deleteFiltered(
    "marketplace_offer_claims",
    `offer_event_id=eq.${offerEventId}`
  );
}
