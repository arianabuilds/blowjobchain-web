"use client"

import { Tables } from "@/supabase/types"
import { useState } from "react"

export const PubKeyChangeLine = ({
  pubKeyChange: { value },
  who,
}: {
  pubKeyChange: Tables<"pub_keys">
  who: string | null
}) => {
  const [open, setOpen] = useState(false)
  return (
    <div
      className={`mb-2 opacity-30 text-sm italic ${value ? "hover:opacity-40 active:opacity-50 cursor-pointer" : ""}`}
      onClick={() => setOpen(!open)}
    >
      {who} {value ? "set new" : "removed their"} pub key
      {open && value && <div className="text-xs">{value ? `${value.slice(0, 10)}...` : ""}</div>}
    </div>
  )
}
