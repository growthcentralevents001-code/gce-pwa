import {
  RateLimitError,
  toPlatformErrorResponse,
  AuthenticationError,
} from "@/lib/errors";
import { AppError } from "@/lib/architecture/errors";
import { redactSensitive, logger, createCorrelationId } from "@/lib/logging";
import { getLiveness, getReadiness } from "@/lib/observability";
import { getDefaultFlag, getFlag, listKnownInactiveFlags } from "@/lib/feature-flags";
import { expectSingle, optionalSingle, translateDbError } from "@/lib/database";
import { checkRateLimit, __resetRateLimitBucketsForTests } from "@/lib/rate-limit";
import { JOB_CONVENTIONS, assertJobRunnerAuthorized } from "@/lib/jobs";
import {
  moneyMinorSchema,
  paginationSchema,
  parseOrThrow,
  offsetLimit,
  uuidSchema,
} from "@/lib/validation";
import { getPublicConfig, getServerConfig } from "@/lib/config";
import { describe, expect, it, beforeEach } from "vitest";

describe("Phase 3 config", () => {
  it("loads public config from env", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-test-key";
    const cfg = getPublicConfig();
    expect(cfg.supabaseUrl).toContain("http");
    expect(cfg.supabaseAnonKey.length).toBeGreaterThan(0);
  });

  it("server config rejects browser context simulation via hasServiceRole boolean", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-test-key";
    const cfg = getServerConfig();
    expect(typeof cfg.hasServiceRole).toBe("boolean");
  });
});

describe("Phase 3 validation", () => {
  it("parses pagination and money minor units", () => {
    const page = parseOrThrow(paginationSchema, { page: "2", pageSize: "10" });
    expect(offsetLimit(page)).toEqual({ from: 10, to: 19, limit: 10 });
    expect(moneyMinorSchema.parse({ amountMinor: 1999, currency: "INR" }).amountMinor).toBe(
      1999
    );
    expect(uuidSchema.safeParse("not-a-uuid").success).toBe(false);
  });

  it("throws AppError on invalid parse", () => {
    expect(() => parseOrThrow(uuidSchema, "x")).toThrow(AppError);
  });
});

describe("Phase 3 errors", () => {
  it("maps taxonomy to HTTP responses", () => {
    const auth = toPlatformErrorResponse(new AuthenticationError());
    expect(auth.status).toBe(401);
    const rate = toPlatformErrorResponse(new RateLimitError());
    expect(rate.status).toBe(429);
    expect(rate.body.error.code).toBe("RATE_LIMITED");
  });
});

describe("Phase 3 logging/redaction", () => {
  it("redacts secrets and supports logger", () => {
    const redacted = redactSensitive({
      authorization: "Bearer x",
      token: "abc",
      safe: 1,
    });
    expect(redacted?.authorization).toBe("[REDACTED]");
    expect(redacted?.token).toBe("[REDACTED]");
    expect(redacted?.safe).toBe(1);
    expect(createCorrelationId()).toBeTruthy();
    logger.info("phase3_test_log", { eventType: "test" });
  });
});

describe("Phase 3 observability", () => {
  it("reports liveness and readiness", () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL =
      process.env.NEXT_PUBLIC_SUPABASE_URL || "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY =
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "anon-test-key";
    expect(getLiveness().alive).toBe(true);
    const ready = getReadiness();
    expect(ready.phase).toBe(3);
    expect(["ok", "degraded", "fail"]).toContain(ready.status);
  });
});

describe("Phase 3 feature flags", () => {
  it("defaults inactive flags OFF and unknown keys disabled", async () => {
    for (const key of listKnownInactiveFlags()) {
      expect(getDefaultFlag(key)).toBe(false);
    }
    const unknown = await getFlag(null, "not_real_flag");
    expect(unknown.enabled).toBe(false);
    expect(unknown.known).toBe(false);
    expect(await getFlag(null, "marketplace_ticket_payments")).toMatchObject({
      enabled: false,
      known: true,
    });
  });
});

describe("Phase 3 database helpers", () => {
  it("expectSingle / optionalSingle / translateDbError", () => {
    expect(expectSingle({ id: 1 })).toEqual({ id: 1 });
    expect(optionalSingle(null)).toBeNull();
    expect(() => expectSingle(null)).toThrow();
    const err = translateDbError({ code: "23505", message: "duplicate" });
    expect(err).toBeInstanceOf(AppError);
  });
});

describe("Phase 3 rate limit", () => {
  beforeEach(() => __resetRateLimitBucketsForTests());

  it("allows under max and blocks when exceeded", () => {
    checkRateLimit("t", { max: 2, windowMs: 60_000 });
    checkRateLimit("t", { max: 2, windowMs: 60_000 });
    expect(() => checkRateLimit("t", { max: 2, windowMs: 60_000 })).toThrow(
      RateLimitError
    );
  });
});

describe("Phase 3 jobs conventions", () => {
  it("exposes defaults and rejects unauthorized runner", () => {
    expect(JOB_CONVENTIONS.defaultMaxAttempts).toBe(5);
    delete process.env.CRON_SECRET;
    expect(() => assertJobRunnerAuthorized("nope")).toThrow();
  });
});
