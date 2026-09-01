import type { SupabaseClient } from "@supabase/supabase-js";
import { z } from "zod";
import { AppError } from "../errors";
import { writeAuditEvent } from "../audit/write";

export const publicContactSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  message: z.string().trim().min(10).max(4000),
});

export type PublicContactInput = z.infer<typeof publicContactSchema>;

export async function submitPublicContact(
  client: SupabaseClient,
  input: PublicContactInput & {
    userId?: string | null;
    correlationId?: string;
  }
) {
  const parsed = publicContactSchema.parse(input);
  const message = [
    `Contact from ${parsed.name} <${parsed.email}>`,
    "",
    parsed.message,
  ].join("\n");

  const { data, error } = await client
    .from("customer_support_signals")
    .insert({
      user_id: input.userId ?? null,
      message,
      status: "queued_for_phase13",
      metadata: {
        source: "public_contact",
        name: parsed.name,
        email: parsed.email,
        submitted_at: new Date().toISOString(),
      },
    })
    .select("id, status, created_at")
    .single();

  if (error || !data) {
    throw new AppError("INTERNAL_ERROR", "Failed to submit contact enquiry", {
      cause: error,
    });
  }

  await writeAuditEvent(client, {
    action: "customer_cx.public_contact_submitted",
    resourceType: "customer_support_signals",
    resourceId: String(data.id),
    actorUserId: input.userId ?? null,
    after: { id: data.id, source: "public_contact" },
    correlationId: input.correlationId,
  });

  return data;
}
