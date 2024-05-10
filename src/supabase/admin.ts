import { createClient } from "@supabase/supabase-js"
import { Database } from "./types"

/** Full admin access to Supabase DB */
export function createSupabaseAdmin() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SECRET_SUPABASE_SERVICE_KEY!,
  )
}
