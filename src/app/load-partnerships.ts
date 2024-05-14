import { createSupabaseServer } from "@/supabase/server"
import { Database } from "@/supabase/types"

const rpc_name = "get_partnerships_with_names"
export type PartnershipsWithName = Database["public"]["Functions"][typeof rpc_name]["Returns"]

export async function loadPartnerships() {
  const supabase = createSupabaseServer()
  const { data } = await supabase.rpc(rpc_name).select()
  return { partnerships: data }
}
