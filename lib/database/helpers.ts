import { DatabaseError, NotFoundError } from "@/lib/errors";
import { offsetLimit, type PaginationInput } from "@/lib/validation";

export type DbErrorLike = {
  message?: string;
  code?: string;
  details?: string;
  hint?: string;
};

/**
 * Translate Supabase/Postgrest errors into platform DatabaseError.
 * Does not leak connection strings or SQL.
 */
export function translateDbError(error: DbErrorLike | null | undefined, fallback = "Database error") {
  if (!error) return new DatabaseError(fallback);
  const code = error.code;
  // Unique violation
  if (code === "23505") {
    return new DatabaseError("Conflict with existing record", {
      details: { code },
      internalMessage: error.message,
      expose: false,
    });
  }
  return new DatabaseError(fallback, {
    details: { code },
    internalMessage: error.message,
    expose: false,
  });
}

export function expectSingle<T>(
  data: T | T[] | null | undefined,
  notFoundMessage = "Resource not found"
): T {
  if (Array.isArray(data)) {
    if (data.length === 0) throw new NotFoundError(notFoundMessage);
    return data[0]!;
  }
  if (data == null) throw new NotFoundError(notFoundMessage);
  return data;
}

export function optionalSingle<T>(data: T | T[] | null | undefined): T | null {
  if (Array.isArray(data)) return data[0] ?? null;
  return data ?? null;
}

export function paginationRange(pagination: PaginationInput) {
  return offsetLimit(pagination);
}

/** Apply common Supabase range pagination. */
export function applyRange<T extends { range: (from: number, to: number) => T }>(
  query: T,
  pagination: PaginationInput
): T {
  const { from, to } = offsetLimit(pagination);
  return query.range(from, to);
}
