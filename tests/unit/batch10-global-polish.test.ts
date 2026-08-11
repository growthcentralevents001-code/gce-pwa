import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  GCE_BRAND,
  GCE_ELEVATION,
  GCE_MOTION,
  GCE_RADIUS,
  GCE_SPACING,
  GCE_SURFACE,
} from "@/lib/frontend/design-language";
import { gceTransition, motionDuration } from "@/lib/frontend/motion";
import { INACTIVE_FEATURE_FLAGS } from "@/lib/architecture/types";
import { WORKSPACE_KEYS } from "@/lib/architecture/types";

const root = process.cwd();

function read(rel: string) {
  return readFileSync(join(root, rel), "utf8");
}

describe("Batch 10 — design tokens (no decorative blue)", () => {
  it("brand tokens use GCE orange/cream, not blue", () => {
    expect(GCE_BRAND.primaryHex).toBe("#EA580C");
    expect(GCE_BRAND.secondaryHex).toBe("#F97316");
    expect(GCE_BRAND.backgroundHex).toBe("#FFF7ED");
    expect(GCE_BRAND.forbiddenDecorative).toContain("#2563EB");
    const productBlob = JSON.stringify({
      GCE_SURFACE,
      GCE_RADIUS,
      GCE_ELEVATION,
      GCE_SPACING,
      GCE_MOTION,
      primary: GCE_BRAND.primaryHex,
      secondary: GCE_BRAND.secondaryHex,
      background: GCE_BRAND.backgroundHex,
    });
    expect(productBlob).not.toContain("#2563EB");
    expect(productBlob.toLowerCase()).not.toMatch(/\bblue-\d/);
    expect(productBlob).not.toMatch(/\bsky-\d/);
    expect(productBlob).not.toMatch(/\bcyan-\d/);
    expect(productBlob).not.toMatch(/\bindigo-\d/);
  });

  it("globals.css maps info to orange (not blue)", () => {
    const css = read("app/globals.css");
    expect(css).toMatch(/--info:\s*24\s+95%\s+53%/);
    expect(css).not.toMatch(/--info:.*210/);
    expect(css).toMatch(/prefers-reduced-motion:\s*reduce/);
  });

  it("canonical radius families are controlled", () => {
    expect(GCE_RADIUS.card).toBe("rounded-2xl");
    expect(GCE_RADIUS.control).toBe("rounded-md");
    expect(GCE_RADIUS.chip).toBe("rounded-full");
  });
});

describe("Batch 10 — PWA manifest + SW cache safety config", () => {
  it("manifest theme/background use GCE brand colors", () => {
    const manifest = JSON.parse(read("public/manifest.json")) as {
      theme_color: string;
      background_color: string;
      name: string;
      short_name: string;
      display: string;
    };
    expect(manifest.theme_color.toUpperCase()).toBe("#EA580C");
    expect(manifest.background_color.toUpperCase()).toBe("#FFF7ED");
    expect(manifest.name).toMatch(/GCE/i);
    expect(manifest.short_name).toBe("GCE");
    expect(manifest.display).toBe("standalone");
  });

  it("service worker does not cache /api responses (NetworkOnly)", () => {
    const sw = read("public/sw.js");
    expect(sw).toMatch(/\/api\/.*\/i/);
    expect(sw).toMatch(/NetworkOnly/);
    expect(sw).not.toMatch(/cacheName:"apis"/);
    expect(sw).not.toMatch(/NetworkFirst\(\{cacheName:"apis"/);
  });

  it("next.config configures NetworkOnly for /api in production PWA", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toMatch(/NetworkOnly/);
    expect(cfg).toMatch(/\/api\//);
    expect(cfg).toMatch(/source:\s*"\/admin"/);
  });

  it("root viewport themeColor is GCE primary", () => {
    const layout = read("app/layout.tsx");
    expect(layout).toMatch(/#EA580C/);
    expect(layout).not.toMatch(/#2563EB/);
  });
});

describe("Batch 10 — productization guards", () => {
  it("Settings does not productize dark-mode toggle or accent picker", () => {
    const settingsLayout = read("app/settings/layout.tsx");
    expect(settingsLayout).toMatch(/No dark-mode productization/);
    const settingsFiles = [
      "app/settings/page.tsx",
      "components/settings/SettingsShell.tsx",
      "lib/frontend/settings/format.ts",
    ];
    for (const f of settingsFiles) {
      const src = read(f);
      expect(src.toLowerCase()).not.toMatch(/accent picker/);
      expect(src.toLowerCase()).not.toMatch(/theme.?picker/);
    }
  });

  it("Ops nav sections do not include a Super Admin route", () => {
    const ops = read("lib/frontend/navigation/ops.ts");
    expect(ops).toMatch(/No mega-admin \/ Super Admin entry/);
    expect(ops).not.toMatch(/href:\s*["'][^"']*super-admin/i);
    expect(ops).not.toMatch(/label:\s*["']Super Admin["']/i);
  });

  it("WorkspaceSwitcher remains the single switcher module path", () => {
    const partner = read("components/app-shell/PartnerShell.tsx");
    expect(partner).toMatch(/WorkspaceSwitcher/);
    expect(WORKSPACE_KEYS).not.toContain("super-admin" as never);
  });

  it("inactive feature flags remain gated (safe posture)", () => {
    const required = [
      "marketplace_ticket_payments",
      "settlement_execution",
      "payout_execution",
      "wallet_cashout",
    ] as const;
    for (const k of required) {
      expect(INACTIVE_FEATURE_FLAGS as readonly string[]).toContain(k);
    }
  });
});

describe("Batch 10 — motion + reduced motion", () => {
  it("motion helpers collapse duration under reduced motion media", () => {
    // jsdom may lack matchMedia — helpers must not throw
    expect(typeof motionDuration("fast")).toBe("number");
    expect(gceTransition("normal").duration).toBeGreaterThanOrEqual(0);
    expect(GCE_MOTION.fastMs).toBeLessThan(GCE_MOTION.normalMs);
  });
});

describe("Batch 10 — legacy route retirement config", () => {
  it("redirects retire admin mega-UI and invent-fee venue plans", () => {
    const cfg = read("next.config.ts");
    expect(cfg).toMatch(/\/admin\/:path\*/);
    expect(cfg).toMatch(/\/venue\/plans/);
    expect(cfg).toMatch(/\/partner-dashboard/);
    expect(cfg).toMatch(/destination:\s*"\/ops"/);
  });

  it("proxy also redirects authenticated /admin to /ops", () => {
    const proxy = read("proxy.ts");
    expect(proxy).toMatch(/isAdminPath/);
    expect(proxy).toMatch(/\/ops/);
    expect(proxy).not.toMatch(/userHasRole/);
  });
});
