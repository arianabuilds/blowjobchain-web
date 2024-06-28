"use server"

import { createSupabaseAdmin } from "@/supabase/admin"

export const MarkResolvedAction = async () => {
  const supa = createSupabaseAdmin()
  const user = await supa.auth.getUser()
  console.log("hello", user)
}
