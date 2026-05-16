"use client"

import { createSupabaseClient } from "@/supabase/client"
import { useEffect, useState } from "react"
import { setPartnershipExpireRateAction } from "./set-expire-rate-action"

export const ExpireRateControl = ({ inviter, invitee }: { inviter: string; invitee: string }) => {
  const [open, setOpen] = useState(false)
  const [currentExpireRate, setCurrentExpireRate] = useState<number | null>(null)
  const [pct, setPct] = useState(0)
  const [pending, setPending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  useEffect(
    function loadExpireRate() {
      let cancelled = false
      loadPartnershipExpirationRate(inviter, invitee).then((r) => {
        if (cancelled) return
        setCurrentExpireRate(r)
        setPct(Math.round(r * 100))
      })
      return () => {
        cancelled = true
      }
    },
    [inviter, invitee],
  )

  const pctSummary = currentExpireRate === null ? "…" : `${Math.round(currentExpireRate * 100)}%`

  return (
    <div className="mt-3 pt-3 border-t border-white/10 text-sm">
      {/* Outer headline */}
      <button
        type="button"
        className="flex w-full items-center justify-between gap-2 rounded py-1 text-left opacity-70 hover:opacity-90"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span>Weekly balance expiration</span>
        <span className="shrink-0 text-xs opacity-50">
          {pctSummary}
          <span className="ml-1.5 opacity-40">{open ? "▼" : "▶"}</span>
        </span>
      </button>

      {/* Expanded details */}
      {open && (
        <>
          <div className="mt-2 mb-2 text-xs opacity-50">
            Current: {pctSummary} of each partner&apos;s balance removed each week. 0% = off.
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <label className="sr-only" htmlFor="expire-rate-pct">
              Percent per week
            </label>
            <input
              id="expire-rate-pct"
              type="number"
              min={0}
              max={100}
              step={1}
              value={pct}
              onChange={(e) => setPct(Number(e.target.value))}
              className="w-16 rounded bg-black/30 border border-white/10 px-2 py-1 text-right"
            />
            <span className="opacity-60">%</span>

            <button
              type="button"
              disabled={pending}
              className="rounded border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-amber-200/90 hover:bg-amber-900/20 disabled:opacity-40"
              onClick={async () => {
                setMsg(null)
                const r = Math.round(Math.min(100, Math.max(0, pct)) * 100) / 10000
                setPending(true)
                const res = await setPartnershipExpireRateAction(inviter, invitee, r)
                setPending(false)
                if (res.error) return setMsg(res.error)
                if (res.skipped) return setMsg("No change (same rate)")
                window.location.reload()
              }}
            >
              {pending ? "Saving…" : "Save rate"}
            </button>
          </div>

          {msg && (
            <p
              className={`mt-1 text-xs ${msg.startsWith("No change") ? "text-zinc-400" : "text-red-400/90"}`}
            >
              {msg}
            </p>
          )}
        </>
      )}
    </div>
  )
}

async function loadPartnershipExpirationRate(inviter: string, invitee: string): Promise<number> {
  const supabase = createSupabaseClient()
  const { data, error } = await supabase.rpc("get_partnership_expiration_rate", {
    p_inviter: inviter,
    p_invitee: invitee,
  })
  if (error) {
    console.error("get_partnership_expiration_rate:", error.message)
    return 0
  }
  return Number(data ?? 0)
}
