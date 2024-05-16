"use client"

import { createSupabaseClient } from "@/supabase/client"
import { PartnershipsWithName } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./settings/getActivePartnership"
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

  return (
    <div className="flex justify-center space-x-10">
      <button
        disabled={pendingGrant}
        className={`${buttonClasses} border-blue-400/70 bg-blue-300 hover:bg-blue-300/60`}
        onClick={async () => {
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

          window.location.reload()
        }}
      >
        Grant{pendingGrant && "ing..."}
      </button>
      <button
        disabled={pendingClaim}
        className={`${buttonClasses} border-purple-400/80 bg-purple-300/80 hover:bg-purple-300/50`}
        onClick={() => {
          if (!active) return alert("Earn 10 points from your partner to claim 1 blowjob card")

          setPendingClaim(true)
          claimPoints(active)
        }}
      >
        Claim{pendingClaim && "ing..."}
      </button>
    </div>
  )
}

async function claimPoints({ inviter, invitee }: { inviter: string; invitee: string }) {
  // Get user session
  const supabase = createSupabaseClient()
  const user_id = (await supabase.auth.getSession()).data.session?.user.id
  if (!user_id) return alert("Not Logged In")
  let partner = inviter !== user_id ? inviter : invitee

  // Save to db
  const { error } = await supabase
    .from("points")
    .insert({ amount: -10, from: user_id, to: partner })
  if (error) alert(JSON.stringify({ error }))

  window.location.reload()
}
