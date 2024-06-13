"use client"

import { BackSVG } from "../BackButton"
import { PartnershipsWithName } from "@/app/logged-in/load-partnerships"
import { useEffect, useState } from "react"
import { useUserId } from "@/app/use-user-id"
import { useRouter } from "next/navigation"

export const SetCurrentButton = ({ p }: { p: PartnershipsWithName[0] }) => {
  const { user_id, supabase } = useUserId()
  const { refresh } = useRouter()

  const [pending, setPending] = useState(false)
  // Reset pending if partnership changes
  useEffect(() => setPending(false), [p.created_at])

  return (
    <button
      type="submit"
      className={`px-2 text-sm text-zinc-300 border rounded text-opacity-30 border-zinc-200/20 hover:bg-white/10 hover:text-opacity-70 hover:border-purple-600 active:bg-white/30 group ${pending && "opacity-60"}`}
      onClick={async () => {
        setPending(true)

        // Validate user.id
        if (user_id === undefined) return alert("Still loading login status")
        if (!user_id) return console.error("Error: not logged in")

        // Save new active_partner id to db
        const { error } = await supabase
          .from("profiles")
          .update({ active_partner: p.inviter !== user_id ? p.inviter : p.invitee })
          .eq("user_id", user_id)
        if (error) return console.error("Error setting active_partner:", error)

        refresh()
      }}
    >
      Set{!pending ? " Current" : "ting..."}{" "}
      <BackSVG
        className="relative inline opacity-50 -scale-x-100 group-hover:opacity-90 bottom-px"
        size={10}
      />
    </button>
  )
}
