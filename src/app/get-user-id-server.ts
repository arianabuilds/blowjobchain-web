import { createSupabaseServer } from "@/supabase/server"

/** Gets current user_id from cookie. Could be forged. Use `supa.auth.getUser()` to validate remotely. */
export const get_user_id_server = async () => {
  const supabase = createSupabaseServer()
  return {
    user_id: (await supabase.auth.getSession({ suppressWarning: true })).data?.session?.user.id,
    supabase,
  }
}
