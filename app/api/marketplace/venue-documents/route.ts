import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { createPrivilegedSupabaseClient } from "@/lib/supabase";
import {
  uploadVenueOnboardingDocument,
  createVenueDocumentSignedUrl,
  VENUE_DOC_MAX_BYTES,
} from "@/lib/architecture/marketplace/documents";
import { AppError } from "@/lib/errors";
import { z } from "zod";

export const POST = withAuthedRoute(async (request, ctx) => {
  const contentType = request.headers.get("content-type") ?? "";
  const admin = createPrivilegedSupabaseClient();
  const assignments = ctx.entitlements.activeAssignments;

  if (contentType.includes("multipart/form-data")) {
    const form = await request.formData();
    const venueId = String(form.get("venueId") ?? "");
    const label = String(form.get("label") ?? "Onboarding document");
    const file = form.get("file");
    if (!venueId || !(file instanceof File)) {
      throw new AppError("VALIDATION_ERROR", "venueId and file are required", {
        status: 400,
      });
    }
    if (file.size > VENUE_DOC_MAX_BYTES) {
      throw new AppError("VALIDATION_ERROR", "File exceeds permitted size", {
        status: 400,
      });
    }
    const bytes = Buffer.from(await file.arrayBuffer());
    const result = await uploadVenueOnboardingDocument(admin, {
      venueId,
      actorUserId: ctx.user.id,
      assignments,
      label: label.slice(0, 200),
      fileName: file.name.slice(0, 200),
      mimeType: file.type || "application/octet-stream",
      sizeBytes: file.size,
      bytes,
      correlationId: ctx.correlationId,
    });
    return jsonSuccess(result, ctx, 201);
  }

  const body = await request.json();
  const parsed = z
    .object({
      action: z.literal("signed_url"),
      venueId: z.string().uuid(),
      documentId: z.string().uuid(),
    })
    .parse(body);

  const result = await createVenueDocumentSignedUrl(admin, {
    venueId: parsed.venueId,
    documentId: parsed.documentId,
    actorUserId: ctx.user.id,
    assignments,
    correlationId: ctx.correlationId,
  });
  return jsonSuccess(result, ctx);
});
