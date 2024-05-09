import { createSupabaseServer } from "@/supabase/server"

export async function loadPartnerships() {
  const supabase = createSupabaseServer()
  const { data: partnerships, error } = await supabase.rpc("get_partnerships_with_names").select()
  return { partnerships }
}
