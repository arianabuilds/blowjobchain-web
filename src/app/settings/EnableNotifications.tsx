"use client"

import { useState } from "react"
import { registerPushNotifications } from "./registerPushNotifications"
import { IoMdNotificationsOutline } from "react-icons/io"

export const EnableNotifications = () => {
  const [enabled, setEnabled] = useState(false)
  if (enabled) return null

  return (
    <div className="justify-center">
      <div
        className="opacity-60 bg-white bg-opacity-15 hover:bg-opacity-25 active:bg-opacity-35 px-5 py-2.5 rounded-lg inline-flex items-center cursor-pointer"
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
