import {
  captureArchitectureException,
  initArchitectureSentry,
} from "@/lib/architecture/observability/sentry";
import { getServerConfig } from "@/lib/config/env";
import { logger } from "@/lib/logging";

export { initArchitectureSentry, captureArchitectureException };

export type HealthStatus = "ok" | "degraded" | "fail";

export type HealthReport = {
  status: HealthStatus;
  phase: 3;
  checks: Record<
    string,
    {
      status: HealthStatus;
      detail?: string;
    }
  >;
  timestamp: string;
};

/** Liveness — process is up. Never exposes secrets. */
export function getLiveness(): { alive: true; timestamp: string } {
  return { alive: true, timestamp: new Date().toISOString() };
}

/**
 * Readiness — can the process serve traffic / critical dependencies.
 * Soft-degrades when optional secrets missing; fails only when public config missing.
 */
export function getReadiness(): HealthReport {
  const checks: HealthReport["checks"] = {};
  let status: HealthStatus = "ok";

  try {
    const cfg = getServerConfig();
    checks.publicConfig = { status: "ok" };
    checks.serviceRole = cfg.hasServiceRole
      ? { status: "ok" }
      : { status: "degraded", detail: "SUPABASE_SERVICE_ROLE_KEY unset" };
    checks.cronSecret = cfg.cronSecret
      ? { status: "ok" }
      : { status: "degraded", detail: "CRON_SECRET unset" };
    checks.paymentWebhookSecret = cfg.hasPaymentWebhookSecret
      ? { status: "ok", detail: "configured (money still feature-gated)" }
      : { status: "degraded", detail: "RAZORPAY_WEBHOOK_SECRET unset" };
    checks.sentry = cfg.sentryDsnServer
      ? { status: "ok" }
      : { status: "degraded", detail: "Sentry DSN unset" };

    if (Object.values(checks).some((c) => c.status === "degraded")) {
      status = "degraded";
    }
  } catch (error) {
    status = "fail";
    checks.publicConfig = {
      status: "fail",
      detail: error instanceof Error ? error.message : "config_error",
    };
    logger.error("readiness_config_failed", {
      meta: { err: error instanceof Error ? error.message : "unknown" },
    });
  }

  return {
    status,
    phase: 3,
    checks,
    timestamp: new Date().toISOString(),
  };
}

export function capturePlatformException(
  error: unknown,
  context?: {
    correlationId?: string;
    requestId?: string;
    code?: string;
    meta?: Record<string, unknown>;
  }
): string {
  initArchitectureSentry();
  return captureArchitectureException(error, context);
}
