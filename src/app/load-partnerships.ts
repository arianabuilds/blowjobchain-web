import { createSupabaseServer } from "@/supabase/server"
import { Database } from "@/supabase/types"

export type PartnershipWithName =
  Database["public"]["Functions"]["get_partnerships_with_names"]["Returns"]
export async function loadPartnerships() {
  const supabase = createSupabaseServer()
  const { data: partnerships, error } = await supabase.rpc("get_partnerships_with_names").select()
  return { partnerships }
}
