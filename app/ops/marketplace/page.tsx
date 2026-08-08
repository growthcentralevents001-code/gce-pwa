import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function MarketplaceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="marketplace"
      title="Marketplace Ops"
      permission="ops.marketplace"
      description="Venue / Event / Offer approvals and CX exceptions. Final listing approval remains Platform Marketplace Ops (FD-037)."
    />
  );
}
