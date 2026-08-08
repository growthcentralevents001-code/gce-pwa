import { describe, expect, it } from "vitest";
import { WORKSPACE_KEYS, type WorkspaceKey } from "@/lib/architecture/types";
import { isCanonicalWorkspaceKey } from "@/lib/frontend/workspace/labels";

/** Mirrors WorkspaceSwitcher allowed-key filtering (no React). */
function filterAllowedWorkspaces(allowed: string[]): WorkspaceKey[] {
  return allowed.filter((k): k is WorkspaceKey => isCanonicalWorkspaceKey(k));
}

describe("Batch 0 workspace switcher filtering", () => {
  it("drops unknown and legacy keys", () => {
    const filtered = filterAllowedWorkspaces([
      "personal",
      "zbp",
      "affiliate",
      "super-admin",
      "connect-bdp",
      "not-a-workspace",
    ]);
    expect(filtered).toEqual(["personal", "connect-bdp"]);
  });

  it("preserves all canonical keys when provided", () => {
    expect(filterAllowedWorkspaces([...WORKSPACE_KEYS])).toEqual([
      ...WORKSPACE_KEYS,
    ]);
  });

  it("handles empty entitlement list", () => {
    expect(filterAllowedWorkspaces([])).toEqual([]);
  });
});
