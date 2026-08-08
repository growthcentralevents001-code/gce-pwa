import { NextResponse } from "next/server";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import { createServerSupabaseClient } from "@/lib/supabase/clients";
import {
  createCorrelationId,
  createRequestId,
  logger,
} from "@/lib/logging";
import { toPlatformErrorResponse, AuthenticationError, AppError } from "@/lib/errors";
import { capturePlatformException } from "@/lib/observability";
import { assertNotSelfApproval, canPerform, type PermissionContext } from "@/lib/architecture/rbac/permissions";
import type { PermissionAction } from "@/lib/architecture/types";
import { resolveActiveEntitlements } from "@/lib/architecture/identity/resolveEntitlements";
import { parseOrThrow } from "@/lib/validation";
import type { ZodSchema } from "zod";
import { checkRateLimit } from "@/lib/rate-limit/memory";

export type RequestContext = {
  correlationId: string;
  requestId: string;
  supabase: SupabaseClient;
  user: User | null;
};

export type AuthedRequestContext = RequestContext & {
  user: User;
  entitlements: Awaited<ReturnType<typeof resolveActiveEntitlements>>;
};

export async function createRequestContext(request: Request): Promise<RequestContext> {
  const correlationId =
    request.headers.get("x-correlation-id") ?? createCorrelationId();
  const requestId = createRequestId();
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { correlationId, requestId, supabase, user };
}

export async function requireUser(ctx: RequestContext): Promise<AuthedRequestContext> {
  if (!ctx.user) {
    throw new AuthenticationError();
  }
  const entitlements = await resolveActiveEntitlements(ctx.supabase, ctx.user.id);
  return { ...ctx, user: ctx.user, entitlements };
}

export function assertPermission(
  ctx: AuthedRequestContext,
  action: PermissionAction,
  options?: {
    requirePlatformAdmin?: boolean;
    allowOwner?: boolean;
    isSelfSubject?: boolean;
    resourceOwnerUserId?: string | null;
  }
): void {
  const active = ctx.entitlements.activeAssignments[0] ?? null;
  const permissionCtx: PermissionContext = {
    userId: ctx.user.id,
    activeAssignment: active,
    assignments: ctx.entitlements.activeAssignments,
    isSelfSubject: options?.isSelfSubject,
    resourceOwnerUserId: options?.resourceOwnerUserId,
  };
  assertNotSelfApproval(permissionCtx, action);
  if (!canPerform(permissionCtx, action, options)) {
    throw new AppError("FORBIDDEN", "Insufficient permissions", { status: 403 });
  }
}

export function jsonSuccess<T>(
  body: T,
  ctx: { correlationId: string; requestId: string },
  status = 200
): NextResponse {
  return NextResponse.json(body, {
    status,
    headers: {
      "x-correlation-id": ctx.correlationId,
      "x-request-id": ctx.requestId,
    },
  });
}

export function jsonError(error: unknown, ctx: { correlationId: string; requestId: string }) {
  const mapped = toPlatformErrorResponse(error, ctx.correlationId);
  logger.error("api_error", {
    correlationId: ctx.correlationId,
    requestId: ctx.requestId,
    errorId: mapped.body.error.errorId,
    code: mapped.body.error.code,
    meta: {
      message: error instanceof Error ? error.message : "unknown",
    },
  });
  if (!(error instanceof AppError) || error.status >= 500) {
    capturePlatformException(error, {
      correlationId: ctx.correlationId,
      requestId: ctx.requestId,
      code: mapped.body.error.code,
    });
  }
  return NextResponse.json(mapped.body, {
    status: mapped.status,
    headers: {
      "x-correlation-id": ctx.correlationId,
      "x-request-id": ctx.requestId,
    },
  });
}

/**
 * Standard Route Handler wrapper (Phase 3).
 * Flow: rate-limit → context → handler → success/error.
 */
export async function withApiHandler(
  request: Request,
  handler: (ctx: RequestContext) => Promise<NextResponse | { status?: number; body?: unknown }>,
  options?: { rateLimitKey?: string; rateLimitMax?: number; rateLimitWindowMs?: number }
): Promise<NextResponse> {
  const correlationId =
    request.headers.get("x-correlation-id") ?? createCorrelationId();
  const requestId = createRequestId();

  try {
    if (options?.rateLimitKey) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        request.headers.get("x-real-ip") ||
        "unknown";
      checkRateLimit(`${options.rateLimitKey}:${ip}`, {
        max: options.rateLimitMax ?? 60,
        windowMs: options.rateLimitWindowMs ?? 60_000,
      });
    }

    const ctx = await createRequestContext(request);
    // Preserve incoming correlation when present
    ctx.correlationId = correlationId;
    ctx.requestId = requestId;

    const result = await handler(ctx);
    if (result instanceof NextResponse) return result;
    return jsonSuccess(result.body ?? {}, ctx, result.status ?? 200);
  } catch (error) {
    return jsonError(error, { correlationId, requestId });
  }
}

export function validateBody<T>(schema: ZodSchema<T>, data: unknown): T {
  return parseOrThrow(schema, data);
}

/** Re-export Phase 2 wrapper for compatibility. */
export { withApiArchitecture, parseJsonWithSchema } from "@/lib/architecture/api/http";
