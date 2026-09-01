import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { advisorySeatCheck } from "@/lib/architecture/connect/seatCheck";
import { AppError } from "@/lib/errors";

/**
 * GET /api/connect/seat-check — advisory Circle capacity for preferred geo.
 * Does not reserve seats. Query: city, state, district?, locality?, specialisationId?
 */
export const GET = withAuthedRoute(async (request, ctx) => {
  const url = new URL(request.url);
  const city = url.searchParams.get("city")?.trim() || null;
  const state = url.searchParams.get("state")?.trim() || null;
  const district = url.searchParams.get("district")?.trim() || null;
  const locality = url.searchParams.get("locality")?.trim() || null;
  const specialisationId =
    url.searchParams.get("specialisationId")?.trim() || null;

  if (!city || !state) {
    throw new AppError(
      "VALIDATION_ERROR",
      "city and state are required for seat check",
      { status: 400 }
    );
  }

  const result = await advisorySeatCheck(ctx.supabase, {
    preferredCity: city,
    preferredState: state,
    preferredDistrict: district,
    preferredLocality: locality,
    specialisationId,
  });

  return jsonSuccess(result, ctx);
});
