import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { getPublicConfig } from "@/lib/config";
import { getLiveness, getReadiness } from "@/lib/observability";
import { logger } from "@/lib/logging";

/**
 * Compatibility health endpoint.
 * Prefer `/api/health/live` and `/api/health/ready` for probes.
 */
export async function GET() {
  const live = getLiveness();
  const ready = getReadiness();

  let dbLatency: string | null = null;
  let dbStatus: "ok" | "degraded" = "degraded";
  try {
    const pub = getPublicConfig();
    // Anon head select — RLS-safe existence probe; not privileged.
    const supabase = createClient(pub.supabaseUrl, pub.supabaseAnonKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
    const start = Date.now();
    const { error } = await supabase
      .from("events")
      .select("id", { count: "exact", head: true });
    dbLatency = `${Date.now() - start}ms`;
    dbStatus = error ? "degraded" : "ok";
  } catch (error) {
    logger.warn("health_db_probe_failed", {
      meta: { err: error instanceof Error ? error.message : "unknown" },
    });
  }

  const status =
    ready.status === "fail" || dbStatus === "degraded" ? "degraded" : "healthy";

  return NextResponse.json({
    status,
    alive: live.alive,
    readiness: ready.status,
    timestamp: live.timestamp,
    uptime: process.uptime(),
    dbLatency,
    // Never echo secrets or env values.
  });
}
