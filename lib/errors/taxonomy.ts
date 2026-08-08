import { AppError, toErrorResponse, type ErrorCode } from "@/lib/architecture/errors";

export { AppError, toErrorResponse };
export type { ErrorCode };

export type LogSeverity = "debug" | "info" | "warn" | "error";

type PlatformErrorOptions = {
  status?: number;
  details?: unknown;
  expose?: boolean;
  cause?: unknown;
  internalMessage?: string;
  severity?: LogSeverity;
  correlationId?: string;
};

/**
 * Named error taxonomy (Phase 3) built on AppError for response compatibility.
 */
export class PlatformError extends AppError {
  readonly internalMessage: string;
  readonly severity: LogSeverity;
  readonly correlationId?: string;

  constructor(
    code: ErrorCode,
    userMessage: string,
    options: PlatformErrorOptions = {}
  ) {
    super(code, userMessage, {
      status: options.status,
      details: options.details,
      expose: options.expose,
      cause: options.cause,
    });
    this.name = "PlatformError";
    this.internalMessage = options.internalMessage ?? userMessage;
    this.severity = options.severity ?? (this.status >= 500 ? "error" : "warn");
    this.correlationId = options.correlationId;
  }
}

export class ValidationError extends PlatformError {
  constructor(message = "Validation failed", options?: PlatformErrorOptions) {
    super("VALIDATION_ERROR", message, { expose: true, ...options, status: 400 });
    this.name = "ValidationError";
  }
}

export class AuthenticationError extends PlatformError {
  constructor(message = "Authentication required", options?: PlatformErrorOptions) {
    super("UNAUTHORIZED", message, { expose: true, ...options, status: 401 });
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends PlatformError {
  constructor(message = "Insufficient permissions", options?: PlatformErrorOptions) {
    super("FORBIDDEN", message, { expose: true, ...options, status: 403 });
    this.name = "AuthorizationError";
  }
}

export class NotFoundError extends PlatformError {
  constructor(message = "Resource not found", options?: PlatformErrorOptions) {
    super("NOT_FOUND", message, { expose: true, ...options, status: 404 });
    this.name = "NotFoundError";
  }
}

export class ConflictError extends PlatformError {
  constructor(message = "Conflict", options?: PlatformErrorOptions) {
    super("CONFLICT", message, { expose: true, ...options, status: 409 });
    this.name = "ConflictError";
  }
}

export class StateTransitionError extends PlatformError {
  constructor(message = "Invalid state transition", options?: PlatformErrorOptions) {
    super("INVALID_TRANSITION", message, { expose: true, ...options, status: 409 });
    this.name = "StateTransitionError";
  }
}

export class RateLimitError extends PlatformError {
  constructor(message = "Too many requests", options?: PlatformErrorOptions) {
    super("RATE_LIMITED", message, {
      expose: true,
      severity: "warn",
      ...options,
      status: 429,
    });
    this.name = "RateLimitError";
  }
}

export class ExternalServiceError extends PlatformError {
  constructor(message = "External service error", options?: PlatformErrorOptions) {
    super("EXTERNAL_SERVICE_ERROR", message, {
      expose: false,
      severity: "error",
      ...options,
      status: 502,
    });
    this.name = "ExternalServiceError";
  }
}

export class DatabaseError extends PlatformError {
  constructor(message = "Database error", options?: PlatformErrorOptions) {
    super("DATABASE_ERROR", message, {
      expose: false,
      severity: "error",
      ...options,
      status: 500,
    });
    this.name = "DatabaseError";
  }
}

export class ConfigurationError extends PlatformError {
  constructor(message = "Configuration error", options?: PlatformErrorOptions) {
    super("CONFIGURATION_ERROR", message, {
      expose: false,
      severity: "error",
      ...options,
      status: 500,
    });
    this.name = "ConfigurationError";
  }
}

export class InternalError extends PlatformError {
  constructor(message = "Internal error", options?: PlatformErrorOptions) {
    super("INTERNAL_ERROR", message, {
      expose: false,
      severity: "error",
      ...options,
      status: 500,
    });
    this.name = "InternalError";
  }
}

export function toPlatformErrorResponse(error: unknown, correlationId?: string) {
  if (error instanceof PlatformError) {
    return toErrorResponse(error, correlationId ?? error.correlationId);
  }
  return toErrorResponse(error, correlationId);
}
