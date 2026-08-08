import { describe, expect, it } from "vitest";
import { paymentWebhookEnvelopeSchema } from "@/lib/architecture/validation/schemas";
import { roleAssignmentCreateSchema } from "@/lib/architecture/validation/schemas";

describe("validation schemas", () => {
  it("parses payment webhook envelope", () => {
    const parsed = paymentWebhookEnvelopeSchema.parse({
      provider: "razorpay_candidate",
      idempotencyKey: "idem_12345678",
      payload: { event: "payment.captured" },
    });
    expect(parsed.provider).toBe("razorpay_candidate");
  });

  it("rejects invalid role assignment payloads", () => {
    expect(() =>
      roleAssignmentCreateSchema.parse({
        userId: "not-a-uuid",
        roleKey: "connect_bdp",
      })
    ).toThrow();
  });
});
