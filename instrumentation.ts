/**
 * Next.js instrumentation — initializes architecture Sentry baseline (ADR-010).
 * Official Next.js docs: instrumentation.ts runs once on server start.
 */
export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { initArchitectureSentry } = await import(
      "@/lib/architecture/observability/sentry"
    );
    initArchitectureSentry();
  }
}
