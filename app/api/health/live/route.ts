import { NextRequest } from "next/server";
import { withApiHandler, jsonSuccess } from "@/lib/api";
import { getLiveness } from "@/lib/observability";

/** Liveness probe — no secrets, no dependency checks. */
export async function GET(request: NextRequest) {
  return withApiHandler(request, async (ctx) =>
    jsonSuccess({ ...getLiveness(), service: "gce-pwa" }, ctx)
  );
}
