import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { GCE_BRAND } from "@/lib/frontend/design-language";

const root = process.cwd();
function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Phase 14B — safety posture (static)", () => {
  it("keeps money/execution flags inactive", () => {
    for (const k of [
      "marketplace_ticket_payments",
      "settlement_execution",
      "payout_execution",
      "wallet_cashout",
      "paid_lead_assist",
    ] as const) {
      expect(INACTIVE_FEATURE_FLAGS as readonly string[]).toContain(k);
    }
  });

  it("PWA SW does not NetworkFirst-cache APIs", () => {
    const sw = read("public/sw.js");
    expect(sw).toMatch(/NetworkOnly/);
    expect(sw).toMatch(/\/api\//);
    expect(sw).not.toMatch(/NetworkFirst\(\{cacheName:"apis"/);
  });

  it("manifest theme is GCE primary", () => {
    const m = JSON.parse(read("public/manifest.json"));
    expect(m.theme_color.toUpperCase()).toBe(GCE_BRAND.primaryHex);
    expect(m.background_color.toUpperCase()).toBe(GCE_BRAND.backgroundHex);
  });

  it("private shells declare noindex", () => {
    for (const f of [
      "app/dashboard/layout.tsx",
      "app/ops/layout.tsx",
      "app/settings/layout.tsx",
      "app/finance/(workspace)/layout.tsx",
    ]) {
      expect(read(f)).toMatch(/index:\s*false/);
    }
  });

  it("proxy retires legacy Venue dashboard siblings before auth", () => {
    const proxy = read("proxy.ts");
    expect(proxy).toMatch(/resolveRetiredVenueSibling/);
    expect(proxy).toMatch(/\/dashboard\/venue\/events/);
    expect(proxy).toMatch(/\/venue\/events/);
  });

  it("next.config retires admin and legacy venue siblings", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toMatch(/\/admin\/:path\*/);
    expect(cfg).toMatch(/\/dashboard\/venue\/events/);
    expect(cfg).toMatch(/destination:\s*"\/venue\/events"/);
  });

  it("no Super Admin product nav entry in Ops nav", () => {
    const ops = read("lib/frontend/navigation/ops.ts");
    expect(ops).not.toMatch(/label:\s*["']Super Admin["']/);
    expect(ops).toMatch(/No mega-admin/);
  });
});

describe("Phase 14B — BG-32 fixture gate", () => {
  it("documents that browser auth fixtures are not present in env", () => {
    expect(process.env.E2E_CUSTOMER_EMAIL ?? "").toBe("");
    expect(process.env.E2E_CUSTOMER_PASSWORD ?? "").toBe("");
  });
});
