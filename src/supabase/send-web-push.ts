import { createSupabaseAdmin } from "@/supabase/admin"
import webPush from "web-push"

let configured = false
function ensureVapid() {
  if (configured) return
  webPush.setVapidDetails(
    "mailto:example@yourdomain.org",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "",
    process.env.VAPID_PRIVATE_KEY || "",
  )
  configured = true
}

/** Server-only: send web push to a user by id (no-op if no subscription). */
export async function sendWebPushToUser(to_id: string, title: string, body = "") {
  ensureVapid()

  // Lookup recipient's push notif details
  const { data } = await createSupabaseAdmin().from("profiles").select().eq("user_id", to_id)
  const subscription = data?.[0]?.push_notif_subscriptions?.[0]
  if (!subscription) return { ok: false as const, reason: "no_subscription" as const }

  // Try sending the notification
  try {
    await webPush.sendNotification(subscription, JSON.stringify({ title, body }))
    return { ok: true as const }
  } catch (e) {
    return { ok: false as const, reason: "send_failed" as const, error: e }
  }
}
