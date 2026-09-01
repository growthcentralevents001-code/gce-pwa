-- gce-dev: allow anonymous public contact intake via privileged API insert.
-- Production untouched until separately promoted.

ALTER TABLE public.customer_support_signals
  ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN public.customer_support_signals.user_id IS
  'Authenticated submitter when known; NULL for anonymous /contact intake (metadata carries name+email).';
