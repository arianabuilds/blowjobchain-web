"use client"

import { useState } from "react"
import { MembershipUpgradeButtons } from "./MembershipUpgradeButtons"

export const MembershipSettings = () => {
  const [showButtons, setShowButtons] = useState(false)
  return (
    <div className="flex flex-col p-2 px-5 mx-auto my-2 text-center rounded-lg bg-black/5 sm:px-10">
      <h4 className="mx-auto text-sm opacity-70">Free Usage Remaining</h4>
      <div className="space-x-5 min-w-[50%] mb-3">
        <span>You: 2 cards</span>
        <span>Partner: 2 cards</span>
      </div>

      {/* Upgrade Membership Box */}
      <div className="inline-block p-2 min-w-[70%] rounded-lg bg-white/15 space-y-1">
        <h4
          className="text-sm font-semibold  text-white text-opacity-50 hover:text-opacity-70 active:text-opacity-90 cursor-pointer"
          onClick={() => setShowButtons(!showButtons)}
        >
          Upgrade Couple Membership
        </h4>
        {showButtons && <MembershipUpgradeButtons />}
      </div>
    </div>
  )
}
