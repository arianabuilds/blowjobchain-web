"use client"

import { createSupabaseClient } from "@/supabase/client"
import { PartnershipsWithName } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { useState } from "react"

const buttonClasses = `w-[9.1rem] py-2 border-2 rounded-lg`

export const GrantAndClaimBtns = ({
  partnerships,
  active_partner,
}: {
  partnerships: PartnershipsWithName | null
  active_partner?: null | string
}) => {
  const [pendingGrant, setPendingGrant] = useState(false)
  const [pendingClaim, setPendingClaim] = useState(false)
  let active = null
  if (partnerships && isNonEmptyArray(partnerships))
    active = getActivePartnership(partnerships, active_partner)

  const { publicKey } = usePublicKey()

  return (
    <div className="flex justify-center space-x-7 text-white/60">
      <button
        disabled={pendingGrant}
        className={`${buttonClasses} border-amber-500/40 bg-amber-500/5 hover:bg-amber-900/20 active:bg-amber-900/40`}
        onClick={async () => {
          // Use account public key info
          if (publicKey === undefined) return alert("Error: Still loading publicKey info")
          let password: null | string | undefined = undefined
          if (publicKey) password = prompt("Your Password — to sign the transaction:")
          if (password === null) return // pressed 'Cancel'

          if (!active) return alert("Add a partner to grant them blowjob points")

          // Get user session
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Not Logged In")
          let partner = active.inviter !== user_id ? active.inviter : active.invitee

          // Prompt points and optional comment
          const points = prompt("Grant how many points?")
          if (!points) return
          const comment = prompt("Add optional comment:")

          setPendingGrant(true)

          // Save to db
          const { error } = await supabase
            .from("points")
            .insert({ amount: +points, comment, from: user_id, to: partner })
          if (error) alert(JSON.stringify({ error }))

          // Notify partner
          await notifyPartner(user_id, active, +points, comment || "")

          window.location.reload()
        }}
      >
        Grant{pendingGrant && "ing..."}
      </button>
      <button
        disabled={pendingClaim}
        className={`${buttonClasses} border-orange-600/70 bg-orange-600/10 hover:bg-orange-600/20 active:bg-orange-600/30`}
        onClick={async () => {
          if (!active) return alert("Earn 10 points from your partner to claim 1 blowjob card")

          setPendingClaim(true)
          // Get user session
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Not Logged In")
          let partner = active.inviter !== user_id ? active.inviter : active.invitee

          const amount = -10

          // Save to db
          const { error } = await supabase
            .from("points")
            .insert({ amount, from: user_id, to: partner })
          if (error) alert(JSON.stringify({ error }))

          // Notify partner
          await notifyPartner(user_id, active, amount)

          window.location.reload()
        }}
      >
        Claim{pendingClaim && "ing..."}
      </button>
    </div>
  )
}

function notifyPartner(
  user_id: string,
  active: PartnershipsWithName[0],
  amount: number,
  comment?: string,
) {
  const to_id = active.inviter !== user_id ? active.inviter : active.invitee
  const from_name = active.inviter === user_id ? active.inviter_name : active.invitee_name
  const title = `${from_name} ${amount === -10 ? "is claiming a card" : `granted you ${amount} point${amount !== 1 ? "s" : ""}`}`

  return fetch("/api/notify", {
    method: "POST",
    body: JSON.stringify({ to_id, title, body: comment }),
    headers: { "Content-Type": "application/json" },
  })
}

/** Has the current user set a public key for their account? `undefined` before finished loading
 */
function usePublicKey(): { publicKey?: null | string } {
  // Hasn't finished loading yet:
  return { publicKey: undefined }

  // No pubkey set for user:
  return { publicKey: null }

  // Pubkey found for user:
  return { publicKey: "example_pub_key" }
}
