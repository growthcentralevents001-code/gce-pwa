import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function EnterpriseOpsPage() {
  return (
    <VerticalOpsPage
      vertical="enterprise"
      title="Enterprise Ops"
      permission="ops.enterprise"
      description="Client / EBDP / project exceptions. Quotations &gt; ₹5L still require Finance co-sign (FD-038)."
    />
  );
}
