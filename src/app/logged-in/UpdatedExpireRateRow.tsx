"use client"

import { Tables } from "@/supabase/types"
import { format } from "@expo/timeago.js"

function formatTimeAgo(iso: string) {
  return format(new Date(iso), "tiny")
}

export const UpdatedExpireRateRow = ({
  row,
  setByName,
}: {
  row: Tables<"updated_expire_rate">
  setByName: string | null | undefined
}) => {
  const pct = (n: number) => `${Math.round(n * 100)}%`
  return (
    <div className="border rounded-lg border-zinc-300/20 p-2 px-3 mb-2 opacity-60 w-full">
      <div className="flex items-center justify-between">
        <span className="inline-block w-12 text-sm text-left opacity-70">{formatTimeAgo(row.created_at)}</span>
        <div className="text-center flex-1 text-sm">
          <span className="mr-1 opacity-70">{setByName?.[0]}</span>
          Expire rate {pct(row.previous_r)} → {pct(row.next_r)}
        </div>
        <span className="w-12" />
      </div>
    </div>
  )
}
