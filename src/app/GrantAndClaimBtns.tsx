"use client"

import { createSupabaseClient } from "@/supabase/client"
import { PartnershipsWithName } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./settings/getActivePartnership"

const buttonClasses = `px-10 py-2 border-2 rounded-md text-gray-800 transition font-medium`

export const GrantAndClaimBtns = ({
  partnerships,
  active_partner,
}: {
  partnerships: PartnershipsWithName | null
  active_partner?: null | string
}) => {
  let active = null
  if (partnerships && isNonEmptyArray(partnerships))
    active = getActivePartnership(partnerships, active_partner)

  return (
    <div className="flex justify-center space-x-10">
      <button
        className={`${buttonClasses} border-blue-400/70 bg-blue-300 hover:bg-blue-300/60`}
        onClick={() =>
          !active ? alert("Add a partner to grant them blowjob points") : grantPoints(active)
        }
      >
        Grant
      </button>
      <button
        className={`${buttonClasses} border-purple-400/80 bg-purple-300/80 hover:bg-purple-300/50`}
        onClick={() => alert("Earn 10 points from your partner to claim 1 blowjob card")}
      >
        Claim
      </button>
    </div>
  )
}

async function grantPoints({ inviter, invitee }: { inviter: string; invitee: string }) {
  // Get user session
  const supabase = createSupabaseClient()
  const user_id = (await supabase.auth.getSession()).data.session?.user.id
  if (!user_id) return alert("Not Logged In")
  let partner = inviter !== user_id ? inviter : invitee

  // Prompt points and optional comment
  const points = prompt("Grant how many points?")
  if (!points) return
  const comment = prompt("Add optional comment:")

  // Save to db
  const { error } = await supabase
    .from("points")
    .insert({ amount: +points, comment, from: user_id, to: partner })
  if (error) alert(JSON.stringify({ error }))

  window.location.reload()
}
