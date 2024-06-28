"use client"

import { Tables } from "@/supabase/types"
import { format } from "@expo/timeago.js"
import { useState } from "react"
import CommentIcon from "./comment-icon.svg"
import Image from "next/image"

export const PointRow = ({ point, who }: { point: Tables<"points">; who: string | null }) => {
  const [open, setOpen] = useState(false)
  const hasComment = point.comment && point.comment !== "$$IS_CLAIM$$"

  return (
    <div
      className={`border rounded-lg border-zinc-300/20 p-2 px-3 mb-2 opacity-60 w-full ${hasComment ? "hover:bg-white/5 active:bg-white/10 cursor-pointer" : ""}`}
      onClick={() => hasComment && setOpen(!open)}
    >
      {/* First row */}
      <div className="flex items-center justify-between">
        {/* Left: Timestamp */}
        <span className="inline-block w-12 text-sm text-left opacity-70">
          {format(point.created_at)
            .replace("ago", "")
            .replace("just ", "")
            .replace(/\d\d seconds/, "now")
            .replace(" minute", "m")
            .replace(" hour", "h")
            .replace(" day", "d")
            .replace(" week", "w")
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
        <div className="flex justify-end w-12 opacity-45">
          {hasComment ? <Image src={CommentIcon} alt="Has comment" className="p-[5px]" /> : ""}
        </div>
      </div>

      {/* Hidden second row */}
      {open && (
        <div className="mt-1 text-sm text-center opacity-60">
          {'"'}
          {point.comment}
          {'"'}
        </div>
      )}
    </div>
  )
}
