"use client"

import { printDecimals } from "./print-decimals"
import { Tables } from "@/supabase/types"
import { useState } from "react"
import { formatTimeAgo } from "./PointRow"

/** `after` in points = was + row.amount (amount is negative for weekly expire). */
function parseWeeklyExpireBeforeBalancePts(comment: string): number | null {
  const parts = comment.split("|")
  if (parts.length < 3) return null
  const jsonStr = parts.slice(2).join("|")
  try {
    const o = JSON.parse(jsonStr) as { was?: number }
    if (typeof o.was !== "number") return null
    return o.was
  } catch {
    return null
  }
}

type Point = Tables<"points">

export const WeeklyExpirationRow = ({
  points,
  idToName,
}: {
  points: Point[]
  idToName: Record<string, string | null | undefined>
}) => {
  const [open, setOpen] = useState(false)
  const created = points.reduce(
    (a, p) => (p.created_at > a ? p.created_at : a),
    points[0]!.created_at,
  )

  return (
    <div
      className={`border rounded-lg border-zinc-300/20 p-2 px-3 mb-2 opacity-60 w-full hover:bg-white/5 active:bg-white/10 cursor-pointer`}
      onClick={() => setOpen(!open)}
    >
      <div className="flex items-center justify-between">
        <span className="inline-block w-12 text-sm text-left opacity-70">
          {formatTimeAgo(created)}
        </span>
        <div className="text-center flex-1">Weekly expiration</div>
        <span className="w-12" />
      </div>
      {open && (
        <div className="mt-2 text-sm opacity-80 text-center space-y-1">
          {points.map((p) => {
            const beforePts = p.comment ? parseWeeklyExpireBeforeBalancePts(p.comment) : null
            const label = idToName[p.from] ?? "?"
            if (beforePts === null) return <div key={p.id}>{label}: (details unavailable)</div>
            const afterPts = beforePts + p.amount
            return (
              <div key={p.id}>
                {/* JSON stores point totals; headline-style balance uses cards */}
                {label}: {printDecimals(beforePts / 10)} → {printDecimals(afterPts / 10)}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
