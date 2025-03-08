"use server"

import { createSupabaseAdmin } from "@/supabase/admin"
import { createSupabaseServer } from "@/supabase/server"

/** We want users to be able to mark charges as Resolved, but only if they themselves granted them. We also don't want them editing any of the other columns. */
export const MarkResolvedAction = async (id: number) => {
  // Use supa-as-server to grab user from cookie
  const user_id = (await (await createSupabaseServer()).auth.getUser()).data?.user?.id
  if (!user_id) return { error: "Missing user_id", status: 401 }

  // Use supa-as-admin to perform the precise Update
  const { error } = await createSupabaseAdmin()
    .from("points")
    .update({ resolved_at: new Date().toISOString() })
    .eq("id", id)
    .eq("from", user_id)

  return { error }
}

/** Users can partially resolve a toxicity charge. */
export const PartiallyResolveAction = async (id: number, amount: number) => {
  const supaServer = await createSupabaseServer()
  // Use supa-as-server to grab user from cookie
  const user_id = (await supaServer.auth.getUser()).data?.user?.id
  if (!user_id) return { error: "Missing user_id", status: 401 }

  // Grab the negative points item in question
  // so we can validate the partial resolution rules
  const { error: readError, data: point } = await supaServer
    .from("points")
    .select()
    .eq("id", id)
    .eq("from", user_id)
    .limit(1)
    .single()

  // Found points that they have read access to?
  if (readError) return { error: readError }

  // Validate our Partial Resolution logic
  if (amount === 0) return { error: "Use full resolve instead" }
  if (amount <= point.amount)
    return {
      error: `Error: You gave ${amount}, which doesn't resolve original amount ${point.amount}. Make new charge?`,
    }
  if (amount > Math.abs(point.amount))
    return { error: `Error: You gave ${amount}, which is > original amount ${point.amount}.` }

  const { error } = await createSupabaseAdmin()
    .from("partial_resolutions")
    .insert({ amount, points_id: id })

  return { error }
}
