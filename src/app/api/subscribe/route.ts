import { createSupabaseServer } from "@/supabase/server"
import { NextRequest, NextResponse } from "next/server"
import webPush from "web-push"

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

export async function POST(req: NextRequest) {
  const subscription = await req.json()

  const supabase = createSupabaseServer()
  const user_id = (await supabase.auth.getUser()).data?.user?.id
  if (!user_id) return NextResponse.json({ error: "Missing user_id" }, { status: 401 })

  // Store subscription info in db
  await supabase
    .from("profiles")
    .update({ push_notif_subscriptions: [subscription] })
    .eq("user_id", user_id)

  const payload = JSON.stringify({ title: "bjchain notifications enabled", body: "be in touch" })

  try {
    await webPush.sendNotification(subscription, payload)
    return NextResponse.json({ message: "Notification sent" })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
