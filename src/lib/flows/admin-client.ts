import { createClient, type SupabaseClient } from '@supabase/supabase-js'

// Lazy, shared service-role client for the Flows engine.
// Mirrors src/lib/automations/admin-client.ts — same shape so anyone
// reading either file picks up the convention immediately.
let _adminClient: SupabaseClient | null = null

export function supabaseAdmin(): SupabaseClient {
  if (!_adminClient) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    // Fail with an actionable message rather than letting createClient
    // throw a bare "supabaseKey is required". A missing service-role
    // key is the usual cause of admin-path 500s on a fresh deploy.
    if (!url || !serviceKey) {
      throw new Error(
        'Server is missing Supabase admin credentials. Set SUPABASE_SERVICE_ROLE_KEY (and NEXT_PUBLIC_SUPABASE_URL) in the deployment environment.',
      )
    }
    _adminClient = createClient(url, serviceKey)
  }
  return _adminClient
}
