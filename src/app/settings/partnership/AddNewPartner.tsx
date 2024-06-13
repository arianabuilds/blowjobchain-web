"use client"

import { InvitePartnerLink } from "@/app/logged-in/InvitePartnerLink"
import { useState } from "react"

export const AddNewPartner = () => {
  const [pressed, setPressed] = useState(false)
  return (
    <div className="mb-1 text-center">
      <button
        className="border border-purple-400/50 text-purple-400/40 text-sm rounded px-3 py-0.5 hover:bg-purple-800/20 active:bg-purple-500/20"
        onClick={() => setPressed(!pressed)}
      >
        + Add New Partner
      </button>
      {pressed && <InvitePartnerLink />}
    </div>
  )
}
