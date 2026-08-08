import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function ComplianceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="compliance"
      title="Compliance Admin"
      permission="ops.compliance"
      description="Holds, privacy, retention review, risk disposition. Retention enforcement remains OFF (OD-009)."
    />
  );
}
