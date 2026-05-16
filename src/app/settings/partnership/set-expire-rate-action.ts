"use server"

import { createSupabaseServer } from "@/supabase/server"
import { sendWebPushToUser } from "@/supabase/send-web-push"

export async function setPartnershipExpireRateAction(
  inviter: string,
  invitee: string,
  nextR: number,
): Promise<{ error?: string; skipped?: boolean }> {
  // Auth as user
  const supabase = await createSupabaseServer()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user?.id) return { error: "Not logged in" }

  // Call set_expire_rate() RPC
  const { data: inserted, error } = await supabase.rpc("set_partnership_expire_rate", {
    p_inviter: inviter,
    p_invitee: invitee,
    p_next_r: nextR,
  })
  if (error) return { error: error.message }

  // If inserted, send notification to partner
  if (inserted) {
    const partnerId = user.id === inviter ? invitee : inviter
    const { data: meProf } = await supabase
      .from("profiles")
      .select("name")
      .eq("user_id", user.id)
      .maybeSingle()
    const changerName = meProf?.name ?? "Your partner"
    const pct = `${Math.round(nextR * 100)}%`
    await sendWebPushToUser(
      partnerId,
      `${changerName} updated weekly expiration`,
      `New rate: ${pct}`,
    )
  }

  return { skipped: !inserted }
}
