"use client"

import { Tables } from "@/supabase/types"
import { format } from "@expo/timeago.js"
import { useState } from "react"
import CommentIcon from "./comment-icon.svg"
import Image from "next/image"
import { useSearchParams } from "next/navigation"
import { MarkResolvedAction, PartiallyResolveAction } from "./mark-resolved-action"
import { useUserId } from "../use-user-id"

export const PointRow = ({ point, who }: { point: Tables<"points">; who: string | null }) => {
  const [open, setOpen] = useState(false)
  const { user_id } = useUserId()

  const isClaim = point.comment === "$$IS_CLAIM$$"
  const hasComment = point.comment && !isClaim

  const isCharge = point.amount < 0 && !isClaim
  const isChargesFilter = useSearchParams().has("charges")
  if (isChargesFilter && (!isCharge || point.resolved_at)) return null

  const clickable = hasComment || isCharge

  const [partial_resolution] = point.partial_resolutions

  return (
    <div
      className={`border rounded-lg border-zinc-300/20 p-2 px-3 mb-2 opacity-60 w-full ${clickable && "hover:bg-white/5 active:bg-white/10 cursor-pointer"} ${point.resolved_at && `text-sm ${!open && "!opacity-20"}`}`}
      onClick={() => clickable && setOpen(!open)}
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
              <span className={partial_resolution && "opacity-70"}>{point.amount} </span>
              {partial_resolution && (
                <>
                  <span className="opacity-70">{"->"} </span>
                  {partial_resolution.amount}{" "}
                </>
              )}
              {isCharge ? `charge${point.resolved_at ? " - Resolved" : ""}` : "point"}
              {!isCharge && point.amount !== 1 && "s"}
            </>
          )}
        </div>

        {/* Right: Comment icon */}
        <div className="flex justify-end w-12 opacity-45">
          {hasComment && <Image src={CommentIcon} alt="Has comment" className="p-[5px]" />}
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
          {isCharge && (
            <>
              <div className="flex">
                <div
                  className={`z-20 py-1 mb-0.5 mt-1.5 text-sm border opacity-50 flex-grow ${!point.resolved_at ? "hover:opacity-100 hover:border-purple-400 hover:text-purple-400 active:border-purple-400 active:text-purple-400 active:opacity-90 active:bg-purple-400/20 cursor-pointer rounded-l" : "border-white/30 rounded"}`}
                  onClick={async (event) => {
                    if (point.resolved_at) return

                    if (point.from !== user_id) {
                      event.stopPropagation()
                      return alert("Ask partner to resolve")
                    }

                    const { error } = await MarkResolvedAction(point.id)
                    if (error) alert(JSON.stringify({ error }))

                    window.location.reload()
                  }}
                >
                  {!point.resolved_at
                    ? "Mark Resolved?"
                    : `Resolved ${formatTimeAgo(point.resolved_at)} ago`}
                </div>
                {!point.resolved_at && (
                  <div
                    className="z-20 py-1 px-2 mb-0.5 mt-1.5 text-sm border rounded-r opacity-50 hover:opacity-100 hover:border-purple-400 hover:text-purple-400 active:border-purple-400 active:text-purple-400 active:opacity-90 active:bg-purple-400/20 cursor-pointer border-l-0"
                    onClick={async (event) => {
                      event.stopPropagation()

                      if (point.from !== user_id) return alert("Only partner can partially resolve")

                      const previousAmount = partial_resolution.amount || point.amount
                      const input = prompt(
                        `Partially resolve? Was ${previousAmount}, enter remaining amount:`,
                      )

                      if (input === "0") return alert("Use full resolve instead")
                      if (!input) return // pressed Cancel
                      if (Number.isNaN(+input)) return alert(`Not a number: ${input}`)
                      if (+input <= previousAmount)
                        return alert(
                          `Error: You gave ${input}, which doesn't resolve previous amount ${previousAmount}. Make new charge?`,
                        )
                      if (+input > Math.abs(previousAmount))
                        return alert(
                          `Error: You gave ${input}, which is > previous amount ${previousAmount}.`,
                        )

                      const { error } = await PartiallyResolveAction(point.id, +input)
                      if (error) alert(JSON.stringify({ error }))

                      window.location.reload()
                    }}
                  >
                    ▾
                  </div>
                )}
              </div>
              {partial_resolution && (
                <div className="text-sm opacity-60 mt-2 flex justify-between items-center">
                  <span className="opacity-70 text-xs">
                    {formatTimeAgo(partial_resolution.created_at)}
                  </span>
                  <span className="italic -ml-8">
                    Partially resolved to {partial_resolution.amount}
                  </span>
                  <span></span>
                </div>
              )}
            </>
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
