import {
  createCorrelationId,
  createErrorId,
  createRequestId,
  logStructured,
  redactSensitive,
  type LogLevel,
} from "@/lib/architecture/logging";
import { getPublicConfig } from "@/lib/config/env";

export {
  createCorrelationId,
  createErrorId,
  createRequestId,
  redactSensitive,
  logStructured,
};

export type LoggerFields = {
  correlationId?: string;
  requestId?: string;
  errorId?: string;
  actorUserId?: string | null;
  workspaceKey?: string | null;
  action?: string;
  resourceType?: string;
  resourceId?: string | null;
  eventType?: string;
  code?: string;
  meta?: Record<string, unknown>;
};

function baseMeta(fields: LoggerFields): Record<string, unknown> {
  let appEnv = "unknown";
  try {
    appEnv = getPublicConfig().appEnv;
  } catch {
    // Config may be unavailable during early boot/tests
  }
  return redactSensitive({
    environment: appEnv,
    actorUserId: fields.actorUserId ?? undefined,
    workspaceKey: fields.workspaceKey ?? undefined,
    action: fields.action,
    resourceType: fields.resourceType,
    resourceId: fields.resourceId ?? undefined,
    eventType: fields.eventType,
    ...(fields.meta ?? {}),
  }) as Record<string, unknown>;
}

function write(level: LogLevel, message: string, fields: LoggerFields = {}): void {
  logStructured({
    level,
    message,
    correlationId: fields.correlationId,
    requestId: fields.requestId,
    errorId: fields.errorId,
    code: fields.code,
    meta: baseMeta(fields),
  });
}

/**
 * Structured application logger (Phase 3). Prefer over console.*.
 */
export const logger = {
  debug: (message: string, fields?: LoggerFields) => write("debug", message, fields),
  info: (message: string, fields?: LoggerFields) => write("info", message, fields),
  warn: (message: string, fields?: LoggerFields) => write("warn", message, fields),
  error: (message: string, fields?: LoggerFields) => write("error", message, fields),
  child(defaults: LoggerFields) {
    const merge = (fields?: LoggerFields): LoggerFields => ({ ...defaults, ...fields });
    return {
      debug: (message: string, fields?: LoggerFields) => write("debug", message, merge(fields)),
      info: (message: string, fields?: LoggerFields) => write("info", message, merge(fields)),
      warn: (message: string, fields?: LoggerFields) => write("warn", message, merge(fields)),
      error: (message: string, fields?: LoggerFields) => write("error", message, merge(fields)),
    };
  },
};
