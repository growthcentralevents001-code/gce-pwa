import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { listActiveSpecialisations } from "@/lib/architecture/connect/specialisations";

/**
 * GET /api/connect/specialisations — active business specialisations for applicants.
 */
export const GET = withAuthedRoute(async (_request, ctx) => {
  const specialisations = await listActiveSpecialisations(ctx.supabase);
  return jsonSuccess({ specialisations }, ctx);
});
