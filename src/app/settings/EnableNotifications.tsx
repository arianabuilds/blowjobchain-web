"use client"

import { registerPushNotifications } from "../registerPushNotifications"

export const EnableNotifications = () => {
  const status = false // TODO: real status

  return (
    <div
      className="border-2 border-red-500 rounded px-3 p-2 mx-3 hover:bg-red-500/10 cursor-pointer"
      onClick={registerPushNotifications}
    >
      Push Notifications: {"" + status}
    </div>
  )
}
