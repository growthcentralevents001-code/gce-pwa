/**
 * Controlled Associate Tag catalog (FD-036).
 * v1: curated constants — no free-text for rule-critical Tags.
 * Max 4 slots enforced by architecture/connect/tags.ts.
 */

export type AssociateTagCatalogEntry = {
  key: string;
  label: string;
};

/** Curated Tag options for Associate membership applications. */
export const ASSOCIATE_TAG_CATALOG: readonly AssociateTagCatalogEntry[] = [
  { key: "networking", label: "Business networking" },
  { key: "b2b_referrals", label: "B2B referrals" },
  { key: "local_services", label: "Local services" },
  { key: "professional_practice", label: "Professional practice" },
  { key: "retail_trade", label: "Retail & trade" },
  { key: "technology_software", label: "Technology & software" },
  { key: "real_estate_property", label: "Real estate & property" },
  { key: "education_training", label: "Education & training" },
  { key: "healthcare_wellness", label: "Healthcare & wellness" },
  { key: "manufacturing", label: "Manufacturing" },
  { key: "logistics_supply", label: "Logistics & supply" },
  { key: "hospitality_events", label: "Hospitality & events" },
] as const;

export function findAssociateTag(
  key: string
): AssociateTagCatalogEntry | undefined {
  return ASSOCIATE_TAG_CATALOG.find((t) => t.key === key);
}

export function assertCatalogTagKeys(keys: string[]): void {
  for (const key of keys) {
    if (!findAssociateTag(key)) {
      throw new Error(`Unknown Tag key: ${key}`);
    }
  }
}
