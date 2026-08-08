import { NextRequest } from "next/server";
import { withApiHandler, jsonSuccess } from "@/lib/api";
import {
  assertJobRunnerAuthorized,
  claimAndRunJob,
  createJobWorkerClient,
} from "@/lib/jobs";
import { logger } from "@/lib/logging";

/**
 * ADR-014 / Phase 3 job runner.
 * Protected by CRON_SECRET. Does not execute settlement.
 */
export async function POST(request: NextRequest) {
  return withApiHandler(
    request,
    async (ctx) => {
      assertJobRunnerAuthorized(request.headers.get("x-cron-secret"));
      const client = createJobWorkerClient();

      const result = await claimAndRunJob(client, {
        leaseOwner: `cron:${ctx.correlationId}`,
        handler: async (job) => {
          logger.info("job_handler_skeleton", {
            correlationId: ctx.correlationId,
            eventType: "background_job.run",
            meta: { jobType: job.job_type, jobId: job.id },
          });
          return { acknowledged: true, jobType: job.job_type };
        },
      });

      return jsonSuccess(
        {
          ok: true,
          phase: 3,
          correlationId: ctx.correlationId,
          ...result,
        },
        ctx
      );
    },
    { rateLimitKey: "jobs-run", rateLimitMax: 30, rateLimitWindowMs: 60_000 }
  );
}
