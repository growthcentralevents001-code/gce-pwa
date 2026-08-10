import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function EnterpriseOpsPage() {
  return (
    <VerticalOpsPage
      vertical="enterprise"
      title="Enterprise Ops"
      permission="ops.enterprise"
      description="Client / opportunity / project exceptions. No territory ownership. Finance co-sign strictly > ₹5,00,000 stays Finance. Expert has no automatic commission."
    />
  );
}
