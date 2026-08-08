import { z } from "zod";
import {
  AiClassificationOutputSchema,
  type AiClassificationOutput,
} from "./schemas";
import { LOW_CONFIDENCE_BPS } from "./constants";

export type AiProviderRunInput = {
  purpose: "classification" | "ranking" | "duplicate_similarity";
  /** Sanitised requirement text only — no phone/email/IDs. */
  requirementText: string;
  specialisationCodeHint?: string | null;
  tagCodeHints?: string[];
  cityHint?: string | null;
  stateHint?: string | null;
  canonicalSpecialisations: Array<{ id: string; code: string; label: string }>;
};

export type AiProviderResult = {
  provider: string;
  modelId: string;
  promptTemplateVersion: string;
  status: "completed" | "failed" | "fallback";
  confidenceBps: number;
  reviewRequired: boolean;
  output: AiClassificationOutput;
  errorMessage?: string | null;
  costMetadata?: Record<string, unknown>;
};

/**
 * Provider abstraction — Stage 1 uses deterministic fallback as the safe default.
 * External LLM adapters must implement the same contract and never receive PII contact fields.
 */
export interface LeadAssistAiProvider {
  readonly providerId: string;
  classify(input: AiProviderRunInput): Promise<AiProviderResult>;
}

export function sanitiseRequirementForAi(text: string): string {
  return text
    .replace(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi, "[redacted-email]")
    .replace(/\b(?:\+?\d[\d\s\-()]{8,}\d)\b/g, "[redacted-phone]")
    .slice(0, 4000);
}

export class DeterministicLeadAssistProvider implements LeadAssistAiProvider {
  readonly providerId = "deterministic_fallback";

  async classify(input: AiProviderRunInput): Promise<AiProviderResult> {
    const text = sanitiseRequirementForAi(input.requirementText).toLowerCase();
    let matched =
      input.canonicalSpecialisations.find(
        (s) =>
          input.specialisationCodeHint &&
          s.code.toLowerCase() === input.specialisationCodeHint.toLowerCase()
      ) ?? null;

    if (!matched) {
      matched =
        input.canonicalSpecialisations.find((s) => {
          const code = s.code.toLowerCase();
          const label = s.label.toLowerCase();
          return text.includes(code) || text.includes(label);
        }) ?? null;
    }

    const confidenceBps = matched
      ? input.specialisationCodeHint
        ? 8200
        : 6400
      : 3200;
    const reviewRequired = confidenceBps < LOW_CONFIDENCE_BPS || !matched;

    const raw = {
      suggestedSpecialisationCode: matched?.code ?? null,
      suggestedSpecialisationId: matched?.id ?? null,
      suggestedTagCodes: (input.tagCodeHints ?? []).slice(0, 4),
      extractedCity: input.cityHint ?? null,
      extractedState: input.stateHint ?? null,
      urgency: "normal" as const,
      confidenceBps,
      rankingReasons: [
        matched ? "specialisation_match" : "no_specialisation_match",
        "deterministic_rules",
        "circle_first_eligible_filter_applies",
      ],
      reviewRequired,
      reviewReason: reviewRequired ? "low_confidence_or_ambiguous" : null,
      missingInformation: matched ? [] : ["specialisation"],
    };

    const parsed = AiClassificationOutputSchema.safeParse(raw);
    if (!parsed.success) {
      return {
        provider: this.providerId,
        modelId: "rules-v1",
        promptTemplateVersion: "phase10-v1",
        status: "fallback",
        confidenceBps: 0,
        reviewRequired: true,
        output: AiClassificationOutputSchema.parse({
          suggestedTagCodes: [],
          confidenceBps: 0,
          rankingReasons: ["invalid_structured_output"],
          reviewRequired: true,
          reviewReason: "schema_validation_failed",
          missingInformation: ["classification"],
          urgency: "normal",
        }),
        errorMessage: "Structured output validation failed",
      };
    }

    return {
      provider: this.providerId,
      modelId: "rules-v1",
      promptTemplateVersion: "phase10-v1",
      status: "completed",
      confidenceBps: parsed.data.confidenceBps,
      reviewRequired: parsed.data.reviewRequired,
      output: parsed.data,
      costMetadata: { billed: false },
    };
  }
}

export function validateAiStructuredOutput(data: unknown): AiClassificationOutput {
  return AiClassificationOutputSchema.parse(data);
}

export function assertNoToolActionPayload(data: unknown): void {
  if (!data || typeof data !== "object") return;
  const obj = data as Record<string, unknown>;
  const blob = JSON.stringify(obj).toLowerCase();
  if (
    ("action" in obj || "tool" in obj) &&
    (blob.includes("wallet") ||
      blob.includes("commission") ||
      blob.includes("execute_sql") ||
      blob.includes("secret"))
  ) {
    throw new z.ZodError([
      {
        code: "custom",
        path: ["action"],
        message: "Disallowed AI action payload",
      },
    ]);
  }
}
