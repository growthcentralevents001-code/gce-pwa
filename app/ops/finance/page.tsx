import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function FinanceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="finance"
      title="Finance Admin"
      permission="ops.finance"
      description="Holds / reconciliation / refund review integration. Corrections only via Phase 9 immutable architecture."
    />
  );
}
