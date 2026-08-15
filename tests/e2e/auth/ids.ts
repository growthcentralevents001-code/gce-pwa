import { existsSync, readFileSync } from "node:fs";
import { createHash } from "node:crypto";
import { resolve } from "node:path";

export function fixtureUuid(key: string) {
  const hash = createHash("sha256").update(`gce:phase14b:${key}`).digest();
  const bytes = Buffer.from(hash.subarray(0, 16));
  bytes[6] = (bytes[6] & 0x0f) | 0x40;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export type FixtureIds = Record<string, string> & {
  users?: Record<string, string>;
};

export function loadFixtureIds(): FixtureIds {
  const defaults: FixtureIds = {
    mkt_event_attr: fixtureUuid("mkt:event:attributed"),
    mkt_event_unattr: fixtureUuid("mkt:event:unattributed"),
    mkt_offer: fixtureUuid("mkt:offer:01"),
    mkt_offer_expired: fixtureUuid("mkt:offer:expired"),
    mkt_expired_claim: fixtureUuid("mkt:claim:expired"),
    mkt_venue: fixtureUuid("mkt:venue:01"),
    mkt_venue_b: fixtureUuid("mkt:venue:02"),
    membership: fixtureUuid("membership:01"),
    membershipMulti: fixtureUuid("membership:multi"),
    circle: fixtureUuid("circle:01"),
    ent_client: fixtureUuid("ent:client:01"),
    ent_opp: fixtureUuid("ent:opp:01"),
    ent_project_a: fixtureUuid("ent:project:a"),
    ent_project_b: fixtureUuid("ent:project:b"),
  };
  const path = resolve(process.cwd(), ".playwright/fixture-ids.json");
  if (existsSync(path)) {
    const parsed = JSON.parse(readFileSync(path, "utf8")) as FixtureIds;
    return { ...defaults, ...parsed } as FixtureIds;
  }
  return defaults;
}
