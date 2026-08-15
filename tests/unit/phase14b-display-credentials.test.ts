import { createHash } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import {
  decryptDisplayToken,
  encryptDisplayToken,
  generateDisplayToken,
  hashDisplayToken,
  isPackedCiphertext,
  verifyDisplayToken,
} from "@/lib/architecture/credentials/display-token";
import { __resetRateLimitBucketsForTests } from "@/lib/rate-limit/memory";

const TEST_KEY = "phase14b-p1-unit-test-credential-key";

describe("Phase 14B-P1 display credentials", () => {
  afterEach(() => {
    __resetRateLimitBucketsForTests();
  });

  it("generates high-entropy opaque tokens (not Math.random / ids)", () => {
    const a = generateDisplayToken();
    const b = generateDisplayToken();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThanOrEqual(24);
    expect(a).not.toMatch(/^[0-9]+$/);
  });

  it("hashes with SHA-256 hex and verifies with timing-safe compare", () => {
    const raw = generateDisplayToken();
    const hash = hashDisplayToken(raw);
    expect(hash).toHaveLength(64);
    expect(verifyDisplayToken(raw, hash)).toBe(true);
    expect(verifyDisplayToken("other-token", hash)).toBe(false);
    expect(createHash("sha256").update(raw, "utf8").digest("hex")).toBe(hash);
  });

  it("encrypts and decrypts with AES-256-GCM using the server env key", () => {
    const prev = process.env.GCE_CREDENTIAL_ENCRYPTION_KEY;
    process.env.GCE_CREDENTIAL_ENCRYPTION_KEY = TEST_KEY;
    try {
      const raw = generateDisplayToken();
      const packed = encryptDisplayToken(raw);
      expect(packed.keyVersion).toBe(1);
      expect(isPackedCiphertext(packed.ciphertext)).toBe(true);
      expect(packed.ciphertext).not.toContain(raw);
      expect(decryptDisplayToken(packed.ciphertext)).toBe(raw);
    } finally {
      process.env.GCE_CREDENTIAL_ENCRYPTION_KEY = prev;
    }
  });

  it("does not treat ciphertext as reversible base64 of the token", () => {
    const prev = process.env.GCE_CREDENTIAL_ENCRYPTION_KEY;
    process.env.GCE_CREDENTIAL_ENCRYPTION_KEY = TEST_KEY;
    try {
      const raw = "opaque-display-token-value";
      const packed = encryptDisplayToken(raw);
      const b64 = packed.ciphertext.replace(/^v1:/, "");
      expect(Buffer.from(b64, "base64").toString("utf8")).not.toContain(raw);
    } finally {
      process.env.GCE_CREDENTIAL_ENCRYPTION_KEY = prev;
    }
  });
});
