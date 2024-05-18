"use client"

import { useState } from "react"
import { registerPushNotifications } from "../registerPushNotifications"
import { IoMdNotificationsOutline } from "react-icons/io"

export const EnableNotifications = () => {
  const [enabled, setEnabled] = useState(false)
  if (enabled) return null

  return (
    <div className="justify-center">
      <div
        className="border border-black/40 bg-white/10 px-5 py-2.5 rounded-lg inline-flex items-center active:bg-white/20 cursor-pointer"
        onClick={async () => {
          // todo: if in browser, not PWA
          // if (mobileNotInstalled) {
          //   return alert("Must 'Install to Homescreen' first")
          // }

          await registerPushNotifications()
          alert("Notifications enabled")
          setEnabled(!enabled)
        }}
      >
        <IoMdNotificationsOutline size={22} className="mr-1.5" />
        Enable Notifications
      </div>
    </div>
  )
}
