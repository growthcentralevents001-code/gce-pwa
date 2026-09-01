import { withAuthedRoute, jsonSuccess } from "@/lib/api/context";
import { ASSOCIATE_TAG_CATALOG } from "@/lib/architecture/connect/tagCatalog";

/**
 * GET /api/connect/tag-catalog — controlled Associate Tag options (FD-036).
 */
export const GET = withAuthedRoute(async (_request, ctx) => {
  return jsonSuccess({ tags: [...ASSOCIATE_TAG_CATALOG] }, ctx);
});
