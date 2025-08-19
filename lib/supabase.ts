import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // CRITICAL: Force Supabase to use production site URL
    flowType: 'pkce',
    // This ensures Supabase doesn't redirect to localhost
    detectSessionInUrl: false,
    autoRefreshToken: true,
    persistSession: true,
  },
})

