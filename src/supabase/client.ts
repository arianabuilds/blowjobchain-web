import { createBrowserClient } from "@supabase/ssr"

/** Access supabase from Client Components, as the logged-in user (per their cookies) */
export function createSupabaseClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
