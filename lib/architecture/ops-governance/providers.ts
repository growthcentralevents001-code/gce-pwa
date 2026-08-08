export type ProviderResult = {
  ok: boolean;
  provider: string;
  messageId?: string;
  error?: string;
  response: Record<string, unknown>;
};

export type EmailProvider = {
  send(input: {
    toUserId: string;
    subject: string;
    body: string;
    idempotencyKey: string;
    templateKey: string;
  }): Promise<ProviderResult>;
};

export type SmsProvider = {
  send(input: {
    toUserId: string;
    body: string;
    idempotencyKey: string;
    templateKey: string;
  }): Promise<ProviderResult>;
};

export type PushProvider = {
  send(input: {
    toUserId: string;
    title: string;
    body: string;
    deepLink?: string | null;
    idempotencyKey: string;
  }): Promise<ProviderResult>;
};

/** Sandbox adapters — never contact external networks. */
export function createEmailProvider(mode: "sandbox" | "live"): EmailProvider {
  if (mode === "live") {
    return {
      async send() {
        return {
          ok: false,
          provider: "live_blocked",
          error: "notifications_email_live is OFF",
          response: { blocked: true },
        };
      },
    };
  }
  return {
    async send(input) {
      return {
        ok: true,
        provider: "sandbox_email",
        messageId: `sandbox-email:${input.idempotencyKey}`,
        response: {
          mode: "sandbox",
          toUserId: input.toUserId,
          templateKey: input.templateKey,
        },
      };
    },
  };
}

export function createSmsProvider(mode: "sandbox" | "live"): SmsProvider {
  if (mode === "live") {
    return {
      async send() {
        return {
          ok: false,
          provider: "live_blocked",
          error: "notifications_sms_live is OFF",
          response: { blocked: true },
        };
      },
    };
  }
  return {
    async send(input) {
      return {
        ok: true,
        provider: "sandbox_sms",
        messageId: `sandbox-sms:${input.idempotencyKey}`,
        response: {
          mode: "sandbox",
          toUserId: input.toUserId,
          templateKey: input.templateKey,
          dlt: "pending_validation",
        },
      };
    },
  };
}

export function createPushProvider(mode: "sandbox" | "live"): PushProvider {
  if (mode === "live") {
    return {
      async send() {
        return {
          ok: false,
          provider: "live_blocked",
          error: "notifications_push_live is OFF; SW hookup deferred",
          response: { blocked: true },
        };
      },
    };
  }
  return {
    async send(input) {
      return {
        ok: true,
        provider: "sandbox_push",
        messageId: `sandbox-push:${input.idempotencyKey}`,
        response: {
          mode: "sandbox",
          toUserId: input.toUserId,
          note: "public/sw.js dirty WIP not modified",
        },
      };
    },
  };
}
