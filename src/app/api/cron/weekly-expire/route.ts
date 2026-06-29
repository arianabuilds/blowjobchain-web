import { createSupabaseAdmin } from "@/supabase/admin"
import { NextRequest, NextResponse } from "next/server"

function pacificYmd(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now)
}

function pacificWeekdayShort(now: Date, timeZone: string) {
  return new Intl.DateTimeFormat("en-US", { timeZone, weekday: "short" }).format(now)
}

function pacificHour(now: Date, timeZone: string) {
  return parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone,
      hour: "numeric",
      hour12: false,
    }).format(now),
    10,
  )
}

/** Pacific calendar YYYY-MM-DD for the Sunday whose week is being closed. */
function eligiblePacificSundayYmd(now: Date, timeZone: string): string | null {
  const wd = pacificWeekdayShort(now, timeZone)
  const hour = pacificHour(now, timeZone)
  if (wd === "Sun" && hour >= 23) return pacificYmd(now, timeZone)
  if (wd === "Mon" && hour < 6) {
    const ymd = pacificYmd(now, timeZone)
    const [y, m, d] = ymd.split("-").map(Number)
    const utcMid = Date.UTC(y, m - 1, d, 12, 0, 0)
    return new Intl.DateTimeFormat("en-CA", {
      timeZone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date(utcMid - 86400000))
  }
  return null
}

export async function GET(req: NextRequest) {
  // Confirm only triggered by cron job
  const auth = req.headers.get("authorization")
  if (auth !== `Bearer ${process.env.CRON_SECRET}`)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  // Check if we're in our Sunday window to run
  const tz = process.env.EXPIRATION_TZ || "America/Los_Angeles"
  const sunday = eligiblePacificSundayYmd(new Date(), tz)
  if (!sunday) return NextResponse.json({ skipped: true, reason: "outside_window", tz })

  // Call the RPC function
  const { error } = await createSupabaseAdmin().rpc("expire_weekly_points", { p_sunday: sunday })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ ok: true, p_sunday: sunday, tz })
}
