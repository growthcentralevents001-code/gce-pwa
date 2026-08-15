-- Phase 14B-P1 — retrievable display credentials for tickets and offer claims.
-- Encrypted ciphertext is server/service-role only. Check-in/redemption still
-- verify SHA-256 hashes on the parent tables. Production must not apply this
-- until a separate Founder rollout. Target: gce-dev only.

CREATE TABLE IF NOT EXISTS public.marketplace_display_credentials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_type text NOT NULL CHECK (subject_type IN ('ticket', 'offer_claim')),
  subject_id uuid NOT NULL,
  token_hash text NOT NULL,
  ciphertext text NOT NULL,
  key_version int NOT NULL DEFAULT 1,
  issued_at timestamptz NOT NULL DEFAULT now(),
  revoked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_mkt_display_cred_subject UNIQUE (subject_type, subject_id)
);

CREATE INDEX IF NOT EXISTS idx_mkt_display_cred_hash
  ON public.marketplace_display_credentials (token_hash);

COMMENT ON TABLE public.marketplace_display_credentials IS
  'Owner-retrievable AES-256-GCM display tokens. Ciphertext is never client-selectable. Hash on parent tables remains the check-in/redemption verifier.';

ALTER TABLE public.marketplace_display_credentials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketplace_display_credentials FORCE ROW LEVEL SECURITY;

REVOKE ALL ON TABLE public.marketplace_display_credentials FROM PUBLIC;
REVOKE ALL ON TABLE public.marketplace_display_credentials FROM anon;
REVOKE ALL ON TABLE public.marketplace_display_credentials FROM authenticated;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.marketplace_display_credentials TO service_role;

-- No authenticated/anon policies: client roles cannot SELECT ciphertext.
-- Privileged server uses the service role, which bypasses RLS.
