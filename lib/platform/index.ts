/**
 * Phase 3 platform foundation barrel.
 * Prefer importing from domain folders (`@/lib/config`, `@/lib/api`, …).
 */
export * as config from "@/lib/config";
export * as validation from "@/lib/validation";
export * as errors from "@/lib/errors";
export * as logging from "@/lib/logging";
export * as observability from "@/lib/observability";
export * as featureFlags from "@/lib/feature-flags";
export * as database from "@/lib/database";
export * as api from "@/lib/api";
export * as jobs from "@/lib/jobs";
export * as rateLimit from "@/lib/rate-limit";
export * as permissions from "@/lib/permissions";
