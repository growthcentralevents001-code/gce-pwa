import { z } from "zod";

/**
 * Typed environment/config (Phase 3).
 * Public config is safe for browser imports.
 * Server config must only be imported from server modules.
 */

const nodeEnvSchema = z.enum(["development", "test", "production"]).default("development");
const appEnvSchema = z
  .enum(["local", "development", "staging", "pilot", "production"])
  .default("local");

const publicEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url().optional(),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

const serverEnvSchema = z.object({
  NODE_ENV: nodeEnvSchema,
  GCE_APP_ENV: appEnvSchema.optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  SENTRY_DSN: z.string().optional(),
  SENTRY_ENVIRONMENT: z.string().optional(),
  SENTRY_RELEASE: z.string().optional(),
  CRON_SECRET: z.string().min(8).optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  GCE_CREDENTIAL_ENCRYPTION_KEY: z.string().min(16).optional(),
  ENCRYPTION_KEY: z.string().min(16).optional(),
});

export type PublicConfig = {
  supabaseUrl: string;
  supabaseAnonKey: string;
  appUrl: string | null;
  sentryDsn: string | null;
  appEnv: z.infer<typeof appEnvSchema>;
  nodeEnv: z.infer<typeof nodeEnvSchema>;
};

export type ServerConfig = PublicConfig & {
  supabaseServiceRoleKey: string | null;
  sentryDsnServer: string | null;
  sentryEnvironment: string;
  sentryRelease: string | null;
  cronSecret: string | null;
  razorpayWebhookSecret: string | null;
  razorpayKeyId: string | null;
  razorpayKeySecret: string | null;
  /** True when privileged server operations are possible. */
  hasServiceRole: boolean;
  /** True when money-capable webhook secret is configured (still feature-gated). */
  hasPaymentWebhookSecret: boolean;
};

function readPublicRaw() {
  return {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_SENTRY_DSN: process.env.NEXT_PUBLIC_SENTRY_DSN,
  };
}

/**
 * Browser-safe config. Throws if public Supabase vars missing.
 */
export function getPublicConfig(): PublicConfig {
  const parsed = publicEnvSchema.safeParse(readPublicRaw());
  if (!parsed.success) {
    throw new Error(
      `Invalid public configuration: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`
    );
  }
  const nodeEnv = nodeEnvSchema.parse(process.env.NODE_ENV ?? "development");
  const appEnv =
    appEnvSchema.parse(process.env.GCE_APP_ENV ?? process.env.NEXT_PUBLIC_GCE_APP_ENV ?? "local");

  return {
    supabaseUrl: parsed.data.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: parsed.data.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    appUrl: parsed.data.NEXT_PUBLIC_APP_URL ?? null,
    sentryDsn: parsed.data.NEXT_PUBLIC_SENTRY_DSN ?? null,
    appEnv,
    nodeEnv,
  };
}

/**
 * Server-only config. Does not throw solely because optional secrets are absent
 * (local/dev may omit Sentry/cron). Requires public vars.
 */
export function getServerConfig(): ServerConfig {
  if (typeof window !== "undefined") {
    throw new Error("getServerConfig() must not be called in the browser");
  }

  const pub = getPublicConfig();
  const parsed = serverEnvSchema.safeParse({
    NODE_ENV: process.env.NODE_ENV,
    GCE_APP_ENV: process.env.GCE_APP_ENV,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    SENTRY_DSN: process.env.SENTRY_DSN,
    SENTRY_ENVIRONMENT: process.env.SENTRY_ENVIRONMENT,
    SENTRY_RELEASE: process.env.SENTRY_RELEASE,
    CRON_SECRET: process.env.CRON_SECRET,
    RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET,
    RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID,
    RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET,
    GCE_CREDENTIAL_ENCRYPTION_KEY: process.env.GCE_CREDENTIAL_ENCRYPTION_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
  });

  if (!parsed.success) {
    throw new Error(
      `Invalid server configuration: ${parsed.error.issues.map((i) => i.path.join(".")).join(", ")}`
    );
  }

  const serviceKey = parsed.data.SUPABASE_SERVICE_ROLE_KEY ?? null;
  const webhookSecret = parsed.data.RAZORPAY_WEBHOOK_SECRET ?? null;

  // Fail fast in production if service role is required for privileged ops — soft requirement:
  // production without service role is allowed for pure static/public, but readiness will report degraded.
  if (pub.nodeEnv === "production" && pub.appEnv === "production" && !serviceKey) {
    // Soft: do not crash boot; jobs/webhooks remain disabled via missing secrets.
  }

  return {
    ...pub,
    supabaseServiceRoleKey: serviceKey,
    sentryDsnServer: parsed.data.SENTRY_DSN ?? pub.sentryDsn,
    sentryEnvironment:
      parsed.data.SENTRY_ENVIRONMENT ?? pub.appEnv ?? pub.nodeEnv,
    sentryRelease: parsed.data.SENTRY_RELEASE ?? process.env.VERCEL_GIT_COMMIT_SHA ?? null,
    cronSecret: parsed.data.CRON_SECRET ?? null,
    razorpayWebhookSecret: webhookSecret,
    razorpayKeyId: parsed.data.RAZORPAY_KEY_ID ?? null,
    razorpayKeySecret: parsed.data.RAZORPAY_KEY_SECRET ?? null,
    hasServiceRole: Boolean(serviceKey),
    hasPaymentWebhookSecret: Boolean(webhookSecret),
  };
}

export function assertCronAuthorized(provided: string | null | undefined): boolean {
  const cfg = getServerConfig();
  if (!cfg.cronSecret) return false;
  return Boolean(provided && provided === cfg.cronSecret);
}
