"use client"

import { useState } from "react"
import { registerPushNotifications } from "../registerPushNotifications"

export const EnableNotifications = () => {
  const [status, setStatus] = useState(false)

  return (
    <div
      className="bg-black/5 justify-between px-5 rounded-xl py-2 flex items-center space-x-2 cursor-pointer"
      onClick={async () => {
        if (!status) await registerPushNotifications()

        setStatus(!status)
      }}
    >
      <span>Notifications</span>

      {/* Toggle Switch */}
      <div className={`relative w-14 h-7 rounded-full ${!status ? "bg-gray-300" : "bg-green-500"}`}>
        <div
          className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition transform ${!status ? "translate-x-1" : "translate-x-7"}`}
        ></div>
      </div>
    </div>
  )
}
