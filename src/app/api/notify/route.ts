import { sendWebPushToUser } from "@/supabase/send-web-push"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { to_id, title, body = "" } = await req.json()

  const result = await sendWebPushToUser(to_id, title, body)
  if (result.ok) return NextResponse.json({ message: "Notification sent" })
  if (result.reason === "no_subscription")
    return NextResponse.json({ message: "No push notif subscription" })

  return NextResponse.json({ error: result.error }, { status: 500 })
}
