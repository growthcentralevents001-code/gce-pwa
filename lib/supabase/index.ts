/**
 * Phase 3 Supabase client conventions.
 *
 * Privilege levels:
 * - createBrowserSupabaseClient — anon + user session (browser)
 * - createServerSupabaseClient — anon + cookie session (SSR / Route Handlers / Server Actions)
 * - createServiceRoleSupabaseClient / createPrivilegedSupabaseClient — service role, SERVER ONLY
 *
 * @deprecated Prefer factories from this module over ad hoc createClient calls.
 * Legacy `@supabase/auth-helpers-nextjs` usage is transitional (ADR-001).
 */
export {
  createBrowserSupabaseClient,
  createServerSupabaseClient,
  createServiceRoleSupabaseClient,
} from "./clients";

import { createServiceRoleSupabaseClient } from "./clients";

/** Explicit privileged alias — never import from client components. */
export function createPrivilegedSupabaseClient() {
  return createServiceRoleSupabaseClient();
}
