import { z } from "zod";
import { GCE_ROLE_KEYS, ASSIGNMENT_SCOPE_TYPES, ASSIGNMENT_STATUSES, INACTIVE_FEATURE_FLAGS, WORKSPACE_KEYS } from "../types";

export const roleAssignmentCreateSchema = z.object({
  userId: z.string().uuid(),
  roleKey: z.enum(GCE_ROLE_KEYS),
  status: z.enum(ASSIGNMENT_STATUSES).default("pending"),
  scopeType: z.enum(ASSIGNMENT_SCOPE_TYPES).default("platform"),
  scopeId: z.string().uuid().nullable().optional(),
  organisationId: z.string().uuid().nullable().optional(),
  title: z.string().max(200).optional(),
  effectiveFrom: z.string().datetime().optional(),
  effectiveTo: z.string().datetime().nullable().optional(),
  reason: z.string().max(1000).optional(),
});

export const organisationCreateSchema = z.object({
  kind: z.enum([
    "platform_legal_entity",
    "venue_partner",
    "enterprise_client",
    "business_professional",
    "vendor",
    "other",
  ]),
  legalName: z.string().min(1).max(300),
  tradingName: z.string().max(300).optional(),
  primaryCity: z.string().max(120).optional(),
  gstin: z.string().max(20).optional(),
  countryCode: z.string().length(2).default("IN"),
});

export const workspaceSwitchSchema = z.object({
  workspaceKey: z.enum(WORKSPACE_KEYS),
});

export const featureFlagUpdateSchema = z.object({
  key: z.enum(INACTIVE_FEATURE_FLAGS),
  enabled: z.boolean(),
});

export const paymentWebhookEnvelopeSchema = z.object({
  provider: z.enum(["razorpay_candidate", "manual_admin", "other"]),
  providerEventId: z.string().min(1).max(200).optional(),
  idempotencyKey: z.string().min(8).max(200),
  payload: z.record(z.string(), z.unknown()),
  signature: z.string().optional(),
});

export type RoleAssignmentCreateInput = z.infer<typeof roleAssignmentCreateSchema>;
export type OrganisationCreateInput = z.infer<typeof organisationCreateSchema>;
export type PaymentWebhookEnvelope = z.infer<typeof paymentWebhookEnvelopeSchema>;
