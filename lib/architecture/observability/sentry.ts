import * as Sentry from "@sentry/nextjs";
import { createErrorId, logStructured, redactSensitive } from "../logging";

let sentryInitialized = false;

/**
 * Lightweight Sentry wiring for architecture/server paths (ADR-010).
 * No-ops when DSN is absent — never throws due to missing config.
 */
export function initArchitectureSentry(): void {
  if (sentryInitialized) return;
  const dsn = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;
  if (!dsn) {
    sentryInitialized = true;
    return;
  }
  try {
    Sentry.init({
      dsn,
      tracesSampleRate: 0.05,
      environment: process.env.NODE_ENV,
      beforeSend(event) {
        // Redact obvious sensitive bags if present
        if (event.extra) {
          event.extra = redactSensitive(
            event.extra as Record<string, unknown>
          ) as typeof event.extra;
        }
        return event;
      },
    });
  } catch {
    // Ignore init failures in constrained environments
  }
  sentryInitialized = true;
}

export function captureArchitectureException(
  error: unknown,
  context?: {
    correlationId?: string;
    requestId?: string;
    code?: string;
    meta?: Record<string, unknown>;
  }
): string {
  const errorId = createErrorId();
  initArchitectureSentry();
  logStructured({
    level: "error",
    message: "architecture_exception",
    errorId,
    correlationId: context?.correlationId,
    requestId: context?.requestId,
    code: context?.code,
    meta: {
      ...context?.meta,
      err: error instanceof Error ? error.message : String(error),
    },
  });

  try {
    Sentry.withScope((scope) => {
      scope.setTag("layer", "architecture");
      if (context?.correlationId) {
        scope.setTag("correlationId", context.correlationId);
      }
      if (context?.code) scope.setTag("code", context.code);
      scope.setExtra("errorId", errorId);
      if (context?.meta) {
        scope.setExtra("meta", redactSensitive(context.meta));
      }
      Sentry.captureException(error);
    });
  } catch {
    // Sentry optional
  }

  return errorId;
}
