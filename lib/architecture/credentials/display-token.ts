import {
  createCipheriv,
  createDecipheriv,
  createHash,
  randomBytes,
  timingSafeEqual,
} from "node:crypto";
import { AppError } from "../errors";

const ALG = "aes-256-gcm";
const IV_LENGTH = 12;
const TAG_LENGTH = 16;
const TOKEN_BYTES = 24;
export const DISPLAY_TOKEN_KEY_VERSION = 1;
const CIPHER_PREFIX = "v1:";

/**
 * AES-256-GCM key from the server-only env secret.
 * SHA-256 lets passphrase or hex material both yield 32 bytes.
 * Never persist this key in the database.
 */
export function getDisplayTokenKey(): Buffer {
  const raw =
    process.env.GCE_CREDENTIAL_ENCRYPTION_KEY || process.env.ENCRYPTION_KEY;
  if (!raw || raw.trim().length < 16) {
    throw new AppError(
      "CONFIGURATION_ERROR",
      "Display credential encryption is not configured",
      { status: 500, expose: false }
    );
  }
  return createHash("sha256").update(raw.trim()).digest();
}

/** Cryptographically random opaque display credential (not a booking/ticket id). */
export function generateDisplayToken(): string {
  return randomBytes(TOKEN_BYTES).toString("base64url");
}

export function hashDisplayToken(raw: string): string {
  return createHash("sha256").update(raw, "utf8").digest("hex");
}

export function verifyDisplayToken(raw: string, expectedHash: string): boolean {
  if (!raw || !expectedHash) return false;
  const actual = Buffer.from(hashDisplayToken(raw), "hex");
  const expected = Buffer.from(expectedHash, "hex");
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

export function encryptDisplayToken(raw: string): {
  ciphertext: string;
  keyVersion: number;
} {
  const iv = randomBytes(IV_LENGTH);
  const cipher = createCipheriv(ALG, getDisplayTokenKey(), iv);
  const enc = Buffer.concat([cipher.update(raw, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  const packed = Buffer.concat([iv, tag, enc]).toString("base64");
  return {
    ciphertext: `${CIPHER_PREFIX}${packed}`,
    keyVersion: DISPLAY_TOKEN_KEY_VERSION,
  };
}

export function decryptDisplayToken(stored: string): string {
  if (!stored.startsWith(CIPHER_PREFIX)) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Stored display credential is not usable",
      { status: 500, expose: false }
    );
  }
  const buf = Buffer.from(stored.slice(CIPHER_PREFIX.length), "base64");
  if (buf.length <= IV_LENGTH + TAG_LENGTH) {
    throw new AppError(
      "INTERNAL_ERROR",
      "Stored display credential is not usable",
      { status: 500, expose: false }
    );
  }
  const iv = buf.subarray(0, IV_LENGTH);
  const tag = buf.subarray(IV_LENGTH, IV_LENGTH + TAG_LENGTH);
  const data = buf.subarray(IV_LENGTH + TAG_LENGTH);
  try {
    const decipher = createDecipheriv(ALG, getDisplayTokenKey(), iv);
    decipher.setAuthTag(tag);
    return Buffer.concat([decipher.update(data), decipher.final()]).toString(
      "utf8"
    );
  } catch {
    throw new AppError(
      "INTERNAL_ERROR",
      "Stored display credential is not usable",
      { status: 500, expose: false }
    );
  }
}

/** True when a value looks like a packed ciphertext (never log/return this). */
export function isPackedCiphertext(value: unknown): boolean {
  return typeof value === "string" && value.startsWith(CIPHER_PREFIX);
}
