import { NextRequest } from "next/server";
import { withApiArchitecture, parseJsonWithSchema } from "@/lib/architecture/api/http";
import { paymentWebhookEnvelopeSchema } from "@/lib/architecture/validation/schemas";
import {
  handlePaymentWebhook,
  RazorpayCandidateAdapter,
} from "@/lib/architecture/payments/webhook";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/clients";
import { AppError } from "@/lib/architecture/errors";
import { isFeatureEnabled } from "@/lib/architecture/feature-flags/flags";

/**
 * Payment webhook skeleton (ADR-006).
 * Does not execute settlement. Money features remain flag-gated OFF by default.
 */
export async function POST(request: NextRequest) {
  return withApiArchitecture(request, async ({ correlationId }) => {
    const rawBody = await request.text();
    let json: unknown;
    try {
      json = JSON.parse(rawBody || "{}");
    } catch {
      throw new AppError("VALIDATION_ERROR", "Webhook body must be JSON");
    }

    // Allow either raw Razorpay-like body or a wrapped envelope for local tests.
    const maybeEnvelope =
      json &&
      typeof json === "object" &&
      "idempotencyKey" in (json as object)
        ? json
        : {
            provider: "razorpay_candidate",
            idempotencyKey:
              request.headers.get("x-idempotency-key") ||
              request.headers.get("x-razorpay-event-id") ||
              `evt_${Date.now()}`,
            providerEventId: request.headers.get("x-razorpay-event-id") ?? undefined,
            payload: json as Record<string, unknown>,
            signature: request.headers.get("x-razorpay-signature") ?? undefined,
          };

    const envelope = parseJsonWithSchema(paymentWebhookEnvelopeSchema, maybeEnvelope);
    const client = createServiceRoleSupabaseClient();

    const ticketPayments = await isFeatureEnabled(client, "marketplace_ticket_payments");
    const packPayments = await isFeatureEnabled(client, "bdp_pack_payments");
    if (!ticketPayments && !packPayments) {
      // Accept and store for audit, but do not advance money state machines in Phase 2.
      // Still require valid signature when secret configured.
    }

    const adapter = new RazorpayCandidateAdapter(
      process.env.RAZORPAY_WEBHOOK_SECRET
    );

    const result = await handlePaymentWebhook({
      client,
      rawBody,
      envelopeInput: envelope,
      signature: envelope.signature ?? request.headers.get("x-razorpay-signature") ?? undefined,
      adapter,
      correlationId,
      enforceMoneyGate: false,
    });

    return {
      status: 200,
      body: {
        ok: true,
        phase: "phase2_skeleton",
        moneyGates: {
          marketplace_ticket_payments: ticketPayments,
          bdp_pack_payments: packPayments,
        },
        ...result,
      },
    };
  });
}
