"use server"

import { createSupabaseAdmin } from "@/supabase/admin"
import { createSupabaseServer } from "@/supabase/server"

/** We want users to be able to mark charges as Resolved, but only if they themselves granted them. We also don't want them editing any of the other columns. */
export const MarkResolvedAction = async (id: number) => {
  // Use supa-as-server to grab user from cookie
  const user_id = (await createSupabaseServer().auth.getUser()).data?.user?.id
  if (!user_id) return { error: "Missing user_id", status: 401 }

  // Use supa-as-admin to perform the precise Update
  const { error } = await createSupabaseAdmin()
    .from("points")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", id)
    .eq("from", user_id)

  return { error }
}
