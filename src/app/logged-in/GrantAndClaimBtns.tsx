"use client"

import { createSupabaseClient } from "@/supabase/client"
import { PartnershipsWithName } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { useState } from "react"

const buttonClasses = `w-[9.1rem] py-2 border-2 rounded-md text-gray-800 transition font-medium`

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

  const { loadedPublicKey, publicKey } = usePublicKey()

  return (
    <div className="flex justify-center space-x-10">
      <button
        disabled={pendingGrant}
        className={`${buttonClasses} border-blue-400/70 bg-blue-300 hover:bg-blue-300/60`}
        onClick={async () => {
          // Use account public key info
          if (!loadedPublicKey) return alert("Error: Still loading account info")
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
        className={`${buttonClasses} border-purple-400/80 bg-purple-300/80 hover:bg-purple-300/50`}
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

/** Has the current user set a public key for their account? `loadedPublicKey` reports pending state whether this hook has finished.
 */
function usePublicKey(): { loadedPublicKey: boolean; publicKey?: null | string } {
  // Hasn't finished loading yet:
  // return { loadedPublicKey: false, publicKey: undefined }

  // No pubkey set for user:
  return { loadedPublicKey: true, publicKey: null }

  // Pubkey found for user:
  // return { loadedPublicKey: true, publicKey: "example_pub_key" }
}
