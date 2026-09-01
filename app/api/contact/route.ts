import { withApiHandler, validateBody } from "@/lib/api/context";
import { publicContactSchema, submitPublicContact } from "@/lib/architecture/customer-cx/contact";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";

export const POST = async (request: Request) =>
  withApiHandler(
    request,
    async (ctx) => {
      const body = validateBody(publicContactSchema, await request.json());
      const admin = createPrivilegedSupabaseClient();
      const signal = await submitPublicContact(admin, {
        ...body,
        userId: ctx.user?.id ?? null,
        correlationId: ctx.correlationId,
      });
      return {
        status: 201,
        body: {
          ok: true,
          enquiryId: signal.id,
          status: signal.status,
          message: "Your message has been received. Our team will respond when available.",
        },
      };
    },
    { rateLimitKey: "public_contact", rateLimitMax: 8, rateLimitWindowMs: 60_000 }
  );
