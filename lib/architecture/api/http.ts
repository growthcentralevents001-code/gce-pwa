import { NextResponse } from "next/server";
import { ZodSchema } from "zod";
import { AppError, toErrorResponse } from "../errors";
import { createCorrelationId, createRequestId, logStructured } from "../logging";

export type ApiHandlerResult = {
  status?: number;
  body?: unknown;
};

export async function withApiArchitecture<T>(
  request: Request,
  handler: (ctx: {
    correlationId: string;
    requestId: string;
  }) => Promise<ApiHandlerResult | T>
): Promise<NextResponse> {
  const correlationId =
    request.headers.get("x-correlation-id") ?? createCorrelationId();
  const requestId = createRequestId();

  try {
    const result = await handler({ correlationId, requestId });
    if (result instanceof NextResponse) return result;
    if (result && typeof result === "object" && "body" in (result as object)) {
      const r = result as ApiHandlerResult;
      return NextResponse.json(r.body ?? {}, {
        status: r.status ?? 200,
        headers: {
          "x-correlation-id": correlationId,
          "x-request-id": requestId,
        },
      });
    }
    return NextResponse.json(result ?? {}, {
      status: 200,
      headers: {
        "x-correlation-id": correlationId,
        "x-request-id": requestId,
      },
    });
  } catch (error) {
    const mapped = toErrorResponse(error, correlationId);
    logStructured({
      level: "error",
      message: "api_handler_error",
      correlationId,
      requestId,
      errorId: mapped.body.error.errorId,
      code: mapped.body.error.code,
      meta: {
        path: new URL(request.url).pathname,
        message: error instanceof Error ? error.message : "unknown",
      },
    });
    try {
      const { captureArchitectureException } = await import(
        "../observability/sentry"
      );
      captureArchitectureException(error, {
        correlationId,
        requestId,
        code: mapped.body.error.code,
        meta: { path: new URL(request.url).pathname },
      });
    } catch {
      // Observability optional at bootstrap
    }
    return NextResponse.json(mapped.body, {
      status: mapped.status,
      headers: {
        "x-correlation-id": correlationId,
        "x-request-id": requestId,
      },
    });
  }
}

export function parseJsonWithSchema<T>(schema: ZodSchema<T>, data: unknown): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Request validation failed", {
      details: parsed.error.flatten(),
    });
  }
  return parsed.data;
}
