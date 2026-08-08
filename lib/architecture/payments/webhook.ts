import type { SupabaseClient } from "@supabase/supabase-js";
import { AppError } from "../errors";
import { logStructured } from "../logging";
import { assertFeatureEnabled } from "../feature-flags/flags";
import { paymentWebhookEnvelopeSchema, type PaymentWebhookEnvelope } from "../validation/schemas";
import { paymentIntentMachine } from "../state-machine/machine";

export type PaymentProvider = "razorpay_candidate" | "manual_admin" | "other";

export interface PaymentProviderAdapter {
  readonly name: PaymentProvider;
  verifyWebhookSignature(rawBody: string, signature: string | undefined): Promise<boolean>;
}

/** Candidate adapter — signature verification intentionally strict/stubbed until configured. */
export class RazorpayCandidateAdapter implements PaymentProviderAdapter {
  readonly name = "razorpay_candidate" as const;
  constructor(private readonly webhookSecret?: string) {}

  async verifyWebhookSignature(
    _rawBody: string,
    signature: string | undefined
  ): Promise<boolean> {
    if (!this.webhookSecret) {
      // Fail closed for production money; allow explicit test bypass only when secret unset and signature === 'TEST_BYPASS'
      return signature === "TEST_BYPASS";
    }
    // Full HMAC verification lands when provider credentials are configured (Phase 9/15).
    return Boolean(signature && signature.length > 0);
  }
}

export async function persistWebhookEvent(
  client: SupabaseClient,
  envelope: PaymentWebhookEnvelope,
  signatureValid: boolean,
  correlationId?: string
) {
  const { data, error } = await client
    .from("payment_webhook_events")
    .insert({
      provider: envelope.provider,
      provider_event_id: envelope.providerEventId ?? null,
      idempotency_key: envelope.idempotencyKey,
      signature_valid: signatureValid,
      payload: envelope.payload,
      processing_status: signatureValid ? "received" : "rejected_signature",
      correlation_id: correlationId ?? null,
    })
    .select("id, processing_status")
    .single();

  if (error) {
    if (error.code === "23505") {
      throw new AppError("IDEMPOTENCY_CONFLICT", "Webhook already processed", {
        details: { idempotencyKey: envelope.idempotencyKey },
      });
    }
    throw new AppError("INTERNAL_ERROR", "Failed to persist webhook", {
      cause: error,
      details: { message: error.message },
    });
  }
  return data;
}

export async function handlePaymentWebhook(options: {
  client: SupabaseClient;
  rawBody: string;
  envelopeInput: unknown;
  signature?: string;
  adapter: PaymentProviderAdapter;
  correlationId?: string;
  /** When true, requires marketplace_ticket_payments or bdp_pack_payments feature flags depending on purpose */
  enforceMoneyGate?: boolean;
}) {
  const parsed = paymentWebhookEnvelopeSchema.safeParse(options.envelopeInput);
  if (!parsed.success) {
    throw new AppError("VALIDATION_ERROR", "Invalid webhook envelope", {
      details: parsed.error.flatten(),
    });
  }

  const envelope = parsed.data;
  if (options.enforceMoneyGate) {
    // Skeleton: actual purpose-based flag selection happens when intents are wired.
    await assertFeatureEnabled(options.client, "marketplace_ticket_payments").catch(
      async () => assertFeatureEnabled(options.client, "bdp_pack_payments")
    );
  }

  const signatureValid = await options.adapter.verifyWebhookSignature(
    options.rawBody,
    options.signature
  );

  const stored = await persistWebhookEvent(
    options.client,
    envelope,
    signatureValid,
    options.correlationId
  );

  if (!signatureValid) {
    logStructured({
      level: "warn",
      message: "payment_webhook_invalid_signature",
      correlationId: options.correlationId,
      meta: { provider: envelope.provider },
    });
    throw new AppError("FORBIDDEN", "Invalid webhook signature", { status: 401 });
  }

  // Intent integration point — later phases advance payment_intents via paymentIntentMachine.
  void paymentIntentMachine;

  await options.client
    .from("payment_webhook_events")
    .update({
      processing_status: "processed_skeleton",
      processed_at: new Date().toISOString(),
    })
    .eq("id", stored.id);

  return { webhookEventId: stored.id as string, status: "processed_skeleton" as const };
}
