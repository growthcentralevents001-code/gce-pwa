import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function ComplianceOpsPage() {
  return (
    <VerticalOpsPage
      vertical="compliance"
      title="Compliance"
      permission="ops.compliance"
      description="Holds, privacy, retention review, risk disposition. Retention enforcement remains OFF. Flags require review — they are not legal determinations."
    />
  );
}
