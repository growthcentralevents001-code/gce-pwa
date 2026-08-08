import { z, type ZodSchema, type ZodTypeAny } from "zod";
import { AppError } from "@/lib/architecture/errors";

/** Shared Zod helpers (Phase 3). Prefer these over ad hoc parse in routes. */

export const uuidSchema = z.string().uuid();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

export type PaginationInput = z.infer<typeof paginationSchema>;

/** Money in minor units (paise). Never float. */
export const moneyMinorSchema = z.object({
  amountMinor: z.number().int().nonnegative(),
  currency: z.string().length(3).default("INR"),
});

export const isoDateTimeSchema = z.string().min(10);

export function parseOrThrow<T>(schema: ZodSchema<T>, data: unknown, message = "Validation failed"): T {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", message, {
      status: 400,
      details: parsed.error.flatten(),
      expose: true,
    });
  }
  return parsed.data;
}

export function safeParseResult<T>(schema: ZodSchema<T>, data: unknown) {
  return schema.safeParse(data);
}

export function offsetLimit(pagination: PaginationInput): { from: number; to: number; limit: number } {
  const limit = pagination.pageSize;
  const from = (pagination.page - 1) * limit;
  const to = from + limit - 1;
  return { from, to, limit };
}

/** Deduce a shallow object schema field list for docs/debug (not security). */
export function schemaKeys(schema: ZodTypeAny): string[] {
  const shape = (schema as z.ZodObject<z.ZodRawShape>).shape;
  if (!shape || typeof shape !== "object") return [];
  return Object.keys(shape);
}

export {
  roleAssignmentCreateSchema,
  organisationCreateSchema,
  workspaceSwitchSchema,
  featureFlagUpdateSchema,
  paymentWebhookEnvelopeSchema,
} from "@/lib/architecture/validation/schemas";
