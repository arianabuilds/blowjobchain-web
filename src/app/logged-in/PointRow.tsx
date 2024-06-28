"use client"

import { Tables } from "@/supabase/types"
import { format } from "@expo/timeago.js"
import { useState } from "react"
import CommentIcon from "./comment-icon.svg"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { MarkResolvedAction } from "./mark-resolved-action"
import { useUserId } from "../use-user-id"

export const PointRow = ({ point, who }: { point: Tables<"points">; who: string | null }) => {
  const [open, setOpen] = useState(false)
  const { user_id } = useUserId()

  const isClaim = point.comment === "$$IS_CLAIM$$"
  const hasComment = point.comment && !isClaim

  const isCharge = point.amount < 0 && !isClaim
  const isChargesFilter = useSearchParams().has("charges")
  if (isChargesFilter && (!isCharge || point.resolved_at)) return null

  return (
    <div
      className={`border rounded-lg border-zinc-300/20 p-2 px-3 mb-2 opacity-60 w-full ${hasComment || isCharge ? "hover:bg-white/5 active:bg-white/10 cursor-pointer" : ""}`}
      onClick={() => (hasComment || isCharge) && setOpen(!open)}
    >
      {/* First row */}
      <div className="flex items-center justify-between">
        {/* Left: Timestamp */}
        <span className="inline-block w-12 text-sm text-left opacity-70">
          {formatTimeAgo(point.created_at)}
        </span>

        {/* Center section */}
        <div>
          {/* who */}
          <span className="mr-1">{who?.[0]}</span>

          {isClaim ? (
            "claimed a card"
          ) : (
            // Amount
            <>
              {point.amount > 0 && "+"}
              {point.amount} {isCharge ? "charge" : "point"}
              {!isCharge && point.amount !== 1 ? "s" : ""}
            </>
          )}
        </div>

        {/* Right: Comment icon */}
        <div className="flex justify-end w-12 opacity-45">
          {hasComment ? <Image src={CommentIcon} alt="Has comment" className="p-[5px]" /> : ""}
        </div>
      </div>

      {/* Expanded View */}
      {open && (
        <>
          {/* Comment */}
          <div className="mt-1 text-sm opacity-60">
            {point.comment ? (
              <>
                {'"'}
                {point.comment}
                {'"'}
              </>
            ) : (
              <span className="text-xs italic">No comment written.</span>
            )}
          </div>

          {/* Mark Resolved button */}
          {isCharge && point.from === user_id && (
            <div
              className={`z-20 py-1 mb-0.5 mt-1.5 text-sm border rounded opacity-50 ${!point.resolved_at ? "hover:opacity-100 hover:border-purple-400 hover:text-purple-400 active:border-purple-400 active:text-purple-400 active:opacity-90 active:bg-purple-400/20 cursor-pointer" : "border-white/30"}`}
              onClick={async () => {
                if (point.resolved_at) return

                const { error } = await MarkResolvedAction(point.id)
                if (error) alert(JSON.stringify({ error }))

                window.location.reload()
              }}
            >
              {!point.resolved_at
                ? "Mark Resolved?"
                : `Resolved ${formatTimeAgo(point.resolved_at)} ago`}
            </div>
          )}
        </>
      )}
    </div>
  )
}

function formatTimeAgo(timestamp: string) {
  return format(timestamp)
    .replace("ago", "")
    .replace("just ", "")
    .replace(/\d\d seconds/, "now")
    .replace(" minute", "m")
    .replace(" hour", "h")
    .replace(" day", "d")
    .replace(" week", "w")
    .replace(" month", "mo")
    .replace(" year", "y")
    .replace("s ", " ")
}
