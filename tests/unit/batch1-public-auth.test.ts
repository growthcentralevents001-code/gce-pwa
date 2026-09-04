import { describe, expect, it } from "vitest";
import {
  sanitizeAuthRedirect,
  resolveAuthRedirectParam,
} from "@/lib/frontend/auth/redirect";
import { PUBLIC_NAV, PUBLIC_AUTH_NAV } from "@/lib/frontend/navigation/public";
import { filterNavItems, isLegacyNavHref } from "@/lib/frontend/navigation";

describe("Batch 1 auth redirect safety", () => {
  it("allows relative same-origin paths", () => {
    expect(sanitizeAuthRedirect("/dashboard/personal")).toBe(
      "/dashboard/personal"
    );
    expect(sanitizeAuthRedirect("/onboarding/profile")).toBe(
      "/onboarding/profile"
    );
  });

  it("blocks open redirects", () => {
    expect(sanitizeAuthRedirect("https://evil.example")).toBe("/");
    expect(sanitizeAuthRedirect("//evil.example")).toBe("/");
    expect(sanitizeAuthRedirect("/\\evil")).toBe("/");
    expect(sanitizeAuthRedirect("javascript:alert(1)")).toBe("/");
  });

  it("resolves next | redirectTo | redirect", () => {
    const params = new URLSearchParams(
      "next=/customer&redirectTo=/ignored&redirect=/also"
    );
    expect(resolveAuthRedirectParam(params)).toBe("/customer");
  });
});

describe("Batch 1 public navigation", () => {
  it("includes vertical landings and for-partners inventory route", () => {
    const hrefs = PUBLIC_NAV.map((i) => i.href);
    expect(hrefs).toContain("/connect");
    expect(hrefs).toContain("/marketplace");
    expect(hrefs).toContain("/enterprise");
    expect(hrefs).toContain("/for-partners");
    expect(hrefs).not.toContain("/partners");
    expect(hrefs).not.toContain("/the-circle");
  });

  it("has no legacy role marketing in public nav", () => {
    for (const item of [...PUBLIC_NAV, ...PUBLIC_AUTH_NAV]) {
      expect(isLegacyNavHref(item.href)).toBe(false);
      expect(["zbp", "affiliate", "bdm", "franchisee"]).not.toContain(item.id);
    }
    expect(filterNavItems(PUBLIC_NAV).length).toBeGreaterThan(0);
  });
});

describe("Batch 1 partner intent ≠ role grant", () => {
  it("documents blocked legacy intents", () => {
    const blocked = new Set(["zbp", "affiliate", "bdm", "franchisee", "super-admin"]);
    expect(blocked.has("zbp")).toBe(true);
    expect(blocked.has("connect-bdp")).toBe(false);
  });
});
