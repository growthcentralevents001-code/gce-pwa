import { describe, expect, it } from "vitest";
import {
  filterNavItems,
  filterNavSections,
  isLegacyNavHref,
  LEGACY_NAV_IDS,
  PUBLIC_NAV,
  CUSTOMER_PRIMARY_NAV,
  WORKSPACE_LEGACY_QUARANTINE,
  workspaceNavSections,
  OPS_NAV_SECTIONS,
} from "@/lib/frontend/navigation";
import {
  workspaceLabel,
  isCanonicalWorkspaceKey,
} from "@/lib/frontend/workspace/labels";
import { toneFromStatusKeyword } from "@/lib/frontend/status";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";

describe("Batch 0 navigation", () => {
  it("quarantines legacy role hrefs", () => {
    expect(isLegacyNavHref("/dashboard/zbp")).toBe(true);
    expect(isLegacyNavHref("/dashboard/affiliate")).toBe(true);
    expect(isLegacyNavHref("/dashboard/bdm")).toBe(true);
    expect(isLegacyNavHref("/dashboard/franchisee")).toBe(true);
    expect(isLegacyNavHref("/partner-dashboard")).toBe(true);
    expect(isLegacyNavHref("/admin/dashboard")).toBe(true);
    expect(isLegacyNavHref("/dashboard/personal")).toBe(false);
  });

  it("never includes legacy role ids in active public/customer nav", () => {
    const publicIds = PUBLIC_NAV.map((i) => i.id);
    const customerIds = CUSTOMER_PRIMARY_NAV.map((i) => i.id);
    for (const id of LEGACY_NAV_IDS) {
      expect(publicIds).not.toContain(id);
      expect(customerIds).not.toContain(id);
    }
  });

  it("filters quarantined workspace legacy entries", () => {
    const items = WORKSPACE_LEGACY_QUARANTINE.map((q) => ({
      id: q.id,
      label: q.id,
      href: q.href,
      quarantined: q.quarantined,
    }));
    expect(filterNavItems(items)).toHaveLength(0);
  });

  it("filters by workspace and inactive feature flags", () => {
    const sections = workspaceNavSections("venue");
    const filtered = filterNavSections(sections, {
      currentWorkspace: "venue",
      allowedWorkspaces: ["venue", "personal"],
    });
    expect(filtered.some((s) => s.items.length > 0)).toBe(true);

    const withFlag = filterNavItems(
      [
        {
          id: "paid",
          label: "Paid",
          href: "/x",
          featureFlag: "paid_lead_assist",
        },
      ],
      { inactiveFeatureFlags: ["paid_lead_assist"] }
    );
    expect(withFlag).toHaveLength(0);
  });

  it("keeps ops under /ops and not inventing ops workspace keys", () => {
    const hrefs = OPS_NAV_SECTIONS.flatMap((s) => s.items.map((i) => i.href));
    // Batch 8 inventory also places holds + Opportunity Desk outside /ops/*
    const allowed = (h: string) =>
      h.startsWith("/ops") ||
      h === "/compliance/holds" ||
      h.startsWith("/desk/");
    expect(hrefs.every(allowed)).toBe(true);
    expect(WORKSPACE_KEYS).not.toContain("connect-ops");
    expect(WORKSPACE_KEYS).not.toContain("marketplace-ops");
    expect(WORKSPACE_KEYS).not.toContain("enterprise-ops");
  });

  it("limits customer bottom nav to five primary items", () => {
    const mobile = filterNavItems(CUSTOMER_PRIMARY_NAV, { mobile: true });
    expect(mobile.length).toBeLessThanOrEqual(5);
    expect(mobile.every((i) => i.href.startsWith("/customer"))).toBe(true);
  });
});

describe("Batch 0 workspace labels", () => {
  it("labels all 12 canonical workspaces", () => {
    expect(WORKSPACE_KEYS).toHaveLength(12);
    for (const key of WORKSPACE_KEYS) {
      expect(isCanonicalWorkspaceKey(key)).toBe(true);
      expect(workspaceLabel(key).length).toBeGreaterThan(0);
      expect(workspaceLabel(key)).not.toBe(key); // human-friendly, not raw key for known ones — personal is "Personal"
    }
  });

  it("rejects unknown workspace keys", () => {
    expect(isCanonicalWorkspaceKey("super-admin")).toBe(false);
    expect(isCanonicalWorkspaceKey("zbp")).toBe(false);
  });
});

describe("Batch 0 status tones", () => {
  it("maps semantic keywords", () => {
    expect(toneFromStatusKeyword("approved")).toBe("success");
    expect(toneFromStatusKeyword("pending review")).toBe("pending");
    expect(toneFromStatusKeyword("failed")).toBe("error");
    expect(toneFromStatusKeyword("inactive")).toBe("inactive");
  });
});
