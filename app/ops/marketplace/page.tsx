import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function MarketplaceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="marketplace"
      title="Marketplace Ops"
      permission="ops.marketplace"
      description="Venue / Event / Offer operational review. Marketplace Ops holds final Venue onboarding approval. MBDP recommend ≠ approve."
    />
  );
}
