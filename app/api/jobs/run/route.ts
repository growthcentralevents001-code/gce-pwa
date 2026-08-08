import { NextRequest } from "next/server";
import { withApiArchitecture } from "@/lib/architecture/api/http";
import { createServiceRoleSupabaseClient } from "@/lib/supabase/clients";
import { runJobOnce } from "@/lib/architecture/jobs/queue";
import { AppError } from "@/lib/architecture/errors";

/**
 * ADR-014 MVP worker endpoint — VPS cron / PM2 can hit this route.
 * Protected by CRON_SECRET. Does not execute settlement.
 */
export async function POST(request: NextRequest) {
  return withApiArchitecture(request, async ({ correlationId }) => {
    const secret = process.env.CRON_SECRET;
    const provided = request.headers.get("x-cron-secret");
    if (!secret || provided !== secret) {
      throw new AppError("UNAUTHORIZED", "Invalid cron secret", { status: 401 });
    }

    const client = createServiceRoleSupabaseClient();
    const result = await runJobOnce(client, {
      leaseOwner: `cron:${correlationId}`,
      handler: async (job) => {
        // Skeleton: later phases register typed handlers by job_type.
        return { acknowledged: true, jobType: job.job_type };
      },
    });

    return {
      status: 200,
      body: {
        ok: true,
        correlationId,
        ...result,
      },
    };
  });
}
