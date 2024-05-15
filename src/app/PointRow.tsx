"use client"

import { Tables } from "@/supabase/types-generated"
import { format } from "@expo/timeago.js"
import { useState } from "react"

export const PointRow = ({ point, who }: { point: Tables<"points">; who: string | null }) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border rounded-lg border-black/50 p-2 px-3 my-2 text-black/80 w-full ${point.comment ? "hover:bg-black/5 cursor-pointer" : ""}`}
      onClick={() => point.comment && setOpen(!open)}
    >
      {/* First row */}
      <div className="justify-between flex items-center">
        {/* Left: Timestamp */}
        <span className="inline-block w-12 opacity-70 text-sm text-left">
          {format(point.created_at)
            .replace("ago", "")
            .replace("just ", "")
            .replace(/\d\d seconds/, "now")
            .replace(" minute", "m")
            .replace(" hour", "h")
            .replace(" day", "d")
            .replace(" month", "mo")
            .replace(" year", "y")
            .replace("s ", " ")}
        </span>

        {/* Center section */}
        <div>
          {/* who */}
          <span className="mr-1">{who?.[0]}</span>
          {/* Amount */}
          <>
            {point.amount > 0 && "+"}
            {point.amount} point
            {point.amount !== 1 ? "s" : ""}
          </>
        </div>

        {/* Right: Comment icon */}
        <span className="inline-block w-12 text-right opacity-60">{point.comment ? "💬" : ""}</span>
      </div>

      {/* Hidden second row */}
      {open && (
        <div className="text-sm opacity-60 mt-1 text-center">
          {'"'}
          {point.comment}
          {'"'}
        </div>
      )}
    </div>
  )
}
