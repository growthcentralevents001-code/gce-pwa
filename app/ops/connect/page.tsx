import { VerticalOpsPage } from "../_components/vertical-ops-page";

export default function ConnectOpsPage() {
  return (
    <VerticalOpsPage
      vertical="connect"
      title="Connect Ops"
      permission="ops.connect"
      description="Membership / Circle / Connect BDP operational queues. RM/PRM coordination only — no automatic commission."
    />
  );
}
