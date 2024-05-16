import { NextRequest, NextResponse } from "next/server"
import webPush from "web-push"

webPush.setVapidDetails(
  "mailto:example@yourdomain.org",
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
  process.env.VAPID_PRIVATE_KEY || "",
)

export async function POST(req: NextRequest) {
  const { from_id, to_id, body } = await req.json()

  // lookup in DB to's push subscription

  //   const payload = JSON.stringify({ title: "Test Notification", body: "from blowjobchain" })

  try {
    // await webPush.sendNotification(subscription, payload)
    return NextResponse.json({ message: "Notification sent" })
  } catch (error) {
    return NextResponse.json({ error }, { status: 500 })
  }
}
