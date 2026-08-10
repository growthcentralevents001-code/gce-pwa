import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function FinanceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="finance"
      title="Finance Ops entry"
      permission="ops.finance"
      description="Scoped operational entry into Finance. Batch 7 owns Finance presentation. Settlement / payout / refund execution remain OFF. No second finance engine."
    />
  );
}
