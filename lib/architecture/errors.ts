import { createErrorId } from "./logging";

export type ErrorCode =
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INVALID_TRANSITION"
  | "FEATURE_DISABLED"
  | "IDEMPOTENCY_CONFLICT"
  | "INTERNAL_ERROR";

export class AppError extends Error {
  readonly code: ErrorCode;
  readonly status: number;
  readonly errorId: string;
  readonly details?: unknown;
  readonly expose: boolean;

  constructor(
    code: ErrorCode,
    message: string,
    options?: {
      status?: number;
      details?: unknown;
      expose?: boolean;
      cause?: unknown;
    }
  ) {
    super(message, { cause: options?.cause });
    this.name = "AppError";
    this.code = code;
    this.status = options?.status ?? statusForCode(code);
    this.errorId = createErrorId();
    this.details = options?.details;
    this.expose = options?.expose ?? this.status < 500;
  }
}

function statusForCode(code: ErrorCode): number {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
    case "FEATURE_DISABLED":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "IDEMPOTENCY_CONFLICT":
    case "INVALID_TRANSITION":
      return 409;
    default:
      return 500;
  }
}

export function toErrorResponse(error: unknown, correlationId?: string) {
  if (error instanceof AppError) {
    return {
      status: error.status,
      body: {
        error: {
          code: error.code,
          message: error.expose ? error.message : "An unexpected error occurred",
          errorId: error.errorId,
          correlationId,
          details: error.expose ? error.details : undefined,
        },
      },
    };
  }

  const errorId = createErrorId();
  return {
    status: 500,
    body: {
      error: {
        code: "INTERNAL_ERROR" as const,
        message: "An unexpected error occurred",
        errorId,
        correlationId,
      },
    },
  };
}
