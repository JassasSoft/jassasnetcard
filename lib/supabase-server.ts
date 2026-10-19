import { createClient } from '@supabase/supabase-js'

export function getSupabaseServer() {
  const supabaseUrl = process.env.SUPABASE_URL?.trim()
  const supabaseSecretKey = process.env.SUPABASE_SECRET_KEY?.trim()

  if (!supabaseUrl || !supabaseSecretKey) {
    throw new Error('Missing server-side Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseSecretKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
      detectSessionInUrl: false,
    },
  })
}
