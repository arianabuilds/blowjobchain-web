import { createSupabaseAdmin } from "@/supabase/admin"
import { NextRequest, NextResponse } from "next/server"
import webPush from "web-push"

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

export async function POST(req: NextRequest) {
  const { to_id, title, body = "" } = await req.json()

  // lookup in DB to's push subscription
  const { data } = await createSupabaseAdmin().from("profiles").select().eq("user_id", to_id)
  const subscription = data?.[0]?.push_notif_subscriptions?.[0]
  if (!subscription) return NextResponse.json({ message: "No push notif subscription" })

  try {
    await webPush.sendNotification(subscription, JSON.stringify({ title, body }))
    return NextResponse.json({ message: "Notification sent" })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
