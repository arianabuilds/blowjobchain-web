import { createSupabaseServer } from "@/supabase/server"

/** Gets current user_id from cookie. Could be forged. Use `supa.auth.getUser()` to validate remotely. */
export const get_user_id = async () => ({
  user_id: (await createSupabaseServer().auth.getSession()).data?.session?.user.id,
})
