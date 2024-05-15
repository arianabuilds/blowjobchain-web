"use client"

import { Tables } from "@/supabase/types-generated"
import { format } from "@expo/timeago.js"
import { useState } from "react"

export const PointRow = ({ point, who }: { point: Tables<"points">; who: string | null }) => {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={`border rounded-lg border-black/50 p-2 px-3 my-2 text-black/80 ${point.comment ? "hover:bg-black/5 cursor-pointer" : ""}`}
      onClick={() => point.comment && setOpen(!open)}
    >
      <div>
        {/* Timestamp */}
        <span className="inline-block w-[5rem] opacity-70 text-sm">
          {format(point.created_at)
            .replace("ago", "")
            .replace("just ", "")
            .replace(/\d\d seconds/, "now")
            .replace(" minute", "m")
            .replace(" hour", "h")
            .replace(" day", "d")
            .replace("s ", " ")}
        </span>{" "}
        {/* who */}
        <span className="mr-1">{who?.[0]}</span>
        {/* Amount */}
        <>
          {point.amount > 0 && "+"}
          {point.amount} point
          {point.amount !== 1 ? "s" : ""}
        </>
        {/* Comment icon */}
        <span className="inline-block w-[5rem] text-right">{point.comment ? "💬" : ""}</span>
      </div>

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
