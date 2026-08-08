import { NextRequest } from "next/server";
import { withApiHandler, jsonSuccess } from "@/lib/api";
import { getReadiness } from "@/lib/observability";

/** Readiness probe — dependency soft-checks; never returns secrets. */
export async function GET(request: NextRequest) {
  return withApiHandler(request, async (ctx) => {
    const report = getReadiness();
    return jsonSuccess(report, ctx, report.status === "fail" ? 503 : 200);
  });
}
