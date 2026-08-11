import { describe, expect, it } from "vitest";
import {
  SETTINGS_COPY,
  SETTINGS_NAV,
  channelLiveStatus,
  channelOperationalHint,
} from "@/lib/frontend/settings/format";

describe("Batch 9 settings presentation safety", () => {
  it("preserves one-account multi-role and role vs account copy", () => {
    expect(SETTINGS_COPY.oneAccount).toMatch(/One account/i);
    expect(SETTINGS_COPY.roleVsAccount).toMatch(/suspended role/i);
    expect(SETTINGS_COPY.noSelfRole).toMatch(/cannot grant yourself roles/i);
  });

  it("does not invent live email/SMS/push delivery", () => {
    const channels = channelLiveStatus();
    expect(channels.emailLive).toBe(false);
    expect(channels.smsLive).toBe(false);
    expect(channels.pushLive).toBe(false);
    expect(channels.marketingLive).toBe(false);
    expect(channelOperationalHint("email")).toMatch(/not currently active/i);
    expect(channelOperationalHint("sms")).toMatch(/not currently active/i);
    expect(channelOperationalHint("push")).toMatch(/not currently active/i);
  });

  it("keeps marketing separate and contact-reveal non-bypassable", () => {
    expect(SETTINGS_COPY.marketingSeparate).toMatch(/optional/i);
    expect(SETTINGS_COPY.contactReveal).toMatch(/server-authorized/i);
    expect(SETTINGS_COPY.contactReveal).not.toMatch(/always show/i);
  });

  it("avoids invented legal timelines and owns-all-data claims", () => {
    expect(SETTINGS_COPY.privacyRequest).toMatch(/review/i);
    expect(SETTINGS_COPY.privacyRequest).not.toMatch(/30 days/i);
    expect(SETTINGS_COPY.noDataOwnership).not.toMatch(/owns all/i);
    expect(SETTINGS_COPY.noHardDelete).toMatch(/hard-delete/i);
  });

  it("does not productize MFA or fake sessions", () => {
    expect(SETTINGS_COPY.noMfa).toMatch(/not enabled/i);
    expect(SETTINGS_COPY.noSessions).toMatch(/not exposed/i);
  });

  it("uses inventory settings routes without invented workspaces", () => {
    const hrefs = SETTINGS_NAV.map((i) => i.href);
    expect(hrefs).toContain("/settings");
    expect(hrefs).toContain("/settings/profile");
    expect(hrefs).toContain("/settings/organisation");
    expect(hrefs).toContain("/settings/workspaces");
    expect(hrefs).toContain("/settings/notifications");
    expect(hrefs).toContain("/settings/privacy");
    expect(hrefs).toContain("/settings/security");
    expect(hrefs.every((h) => h.startsWith("/settings"))).toBe(true);
  });

  it("has no decorative blue strings in settings copy helpers", () => {
    const blob = JSON.stringify(SETTINGS_COPY);
    expect(blob).not.toMatch(/blue/i);
    expect(blob).not.toMatch(/#2563EB/);
  });
});
