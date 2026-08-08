import { randomUUID } from "crypto";

export type LogLevel = "debug" | "info" | "warn" | "error";

export type StructuredLog = {
  level: LogLevel;
  message: string;
  correlationId?: string;
  requestId?: string;
  errorId?: string;
  code?: string;
  meta?: Record<string, unknown>;
  timestamp: string;
};

const SENSITIVE_KEYS = [
  "password",
  "secret",
  "token",
  "authorization",
  "apiKey",
  "api_key",
  "service_role",
  "aadhaar",
  "pan",
  "bankAccount",
  "account_number",
  "email",
  "phone",
  "mobile",
  "otp",
  "qr_token",
  "kyc",
  "document_number",
];

export function createCorrelationId(): string {
  return randomUUID();
}

export function createRequestId(): string {
  return randomUUID();
}

export function createErrorId(): string {
  return randomUUID();
}

export function redactSensitive(
  input: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
  if (!input) return undefined;
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(input)) {
    if (SENSITIVE_KEYS.some((s) => k.toLowerCase().includes(s.toLowerCase()))) {
      out[k] = "[REDACTED]";
    } else if (v && typeof v === "object" && !Array.isArray(v)) {
      out[k] = redactSensitive(v as Record<string, unknown>);
    } else {
      out[k] = v;
    }
  }
  return out;
}

export function logStructured(entry: Omit<StructuredLog, "timestamp">): void {
  const payload: StructuredLog = {
    ...entry,
    meta: redactSensitive(entry.meta),
    timestamp: new Date().toISOString(),
  };
  const line = JSON.stringify(payload);
  if (entry.level === "error") console.error(line);
  else if (entry.level === "warn") console.warn(line);
  else console.log(line);
}
