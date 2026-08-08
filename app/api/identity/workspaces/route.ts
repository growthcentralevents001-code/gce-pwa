import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { resolveAvailableWorkspaces } from "@/lib/architecture/identity/current";

/**
 * GET /api/identity/workspaces — assignment-derived workspace list.
 */
export const GET = withAuthedRoute(async (_request, ctx) => {
  const result = await resolveAvailableWorkspaces(ctx.supabase, ctx.user.id);
  return jsonSuccess(result, ctx);
});
