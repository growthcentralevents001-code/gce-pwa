import { z } from "zod";

/** Strict structured AI output — never trust free-form text as DB authority. */
export const AiClassificationOutputSchema = z.object({
  suggestedSpecialisationCode: z.string().min(1).max(80).nullable().optional(),
  suggestedSpecialisationId: z.string().uuid().nullable().optional(),
  suggestedTagCodes: z.array(z.string().min(1).max(80)).max(8).default([]),
  extractedCity: z.string().max(120).nullable().optional(),
  extractedState: z.string().max(120).nullable().optional(),
  urgency: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  confidenceBps: z.number().int().min(0).max(10000),
  rankingReasons: z.array(z.string().max(200)).max(20).default([]),
  reviewRequired: z.boolean().default(false),
  reviewReason: z.string().max(500).nullable().optional(),
  missingInformation: z.array(z.string().max(200)).max(20).default([]),
});

export type AiClassificationOutput = z.infer<typeof AiClassificationOutputSchema>;

export const CreateLeadInputSchema = z.object({
  title: z.string().min(3).max(200),
  requirementSummary: z.string().min(3).max(500),
  requirementDetails: z.string().max(5000).optional().nullable(),
  specialisationId: z.string().uuid().optional().nullable(),
  tagCodes: z.array(z.string().min(1).max(80)).max(4).default([]),
  city: z.string().max(120).optional().nullable(),
  district: z.string().max(120).optional().nullable(),
  state: z.string().max(120).optional().nullable(),
  timelineNotes: z.string().max(500).optional().nullable(),
  urgency: z.enum(["low", "normal", "high", "urgent"]).default("normal"),
  budgetIndicationMinor: z.number().int().nonnegative().optional().nullable(),
  privacyLevel: z
    .enum(["standard", "restricted", "masked", "manual_review"])
    .default("standard"),
  confidentialityPreference: z.string().max(200).optional().nullable(),
  originCircleId: z.string().uuid().optional().nullable(),
  giverMembershipId: z.string().uuid().optional().nullable(),
  idempotencyKey: z.string().min(8).max(100).optional(),
});

export type CreateLeadInput = z.infer<typeof CreateLeadInputSchema>;
