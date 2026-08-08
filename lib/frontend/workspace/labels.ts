import type { WorkspaceKey } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";

/** Human-friendly labels for the canonical 12 workspaces (FD-035 / ADR-003). */
export const WORKSPACE_LABELS: Record<WorkspaceKey, string> = {
  personal: "Personal",
  "connect-member": "Connect Member",
  "connect-bdp": "Connect BDP",
  "marketplace-bdp": "Marketplace BDP",
  venue: "Venue",
  "enterprise-bdp": "Enterprise BDP",
  "enterprise-client": "Enterprise Client",
  "platform-ops": "Platform Ops",
  "opportunity-desk": "Opportunity Desk",
  finance: "Finance",
  compliance: "Compliance",
  support: "Support",
};

export function workspaceLabel(key: WorkspaceKey | string): string {
  if ((WORKSPACE_KEYS as readonly string[]).includes(key)) {
    return WORKSPACE_LABELS[key as WorkspaceKey];
  }
  return key;
}

export function isCanonicalWorkspaceKey(key: string): key is WorkspaceKey {
  return (WORKSPACE_KEYS as readonly string[]).includes(key);
}
