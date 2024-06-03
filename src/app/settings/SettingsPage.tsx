import { redirect } from "next/navigation"
import { HelloName } from "../HelloName"
import { loadUserProfile } from "../HomePage"
import { PartnershipSettings } from "./PartnershipSettings"
import { BackButton } from "./BackButton"
import { EnableNotifications } from "./EnableNotifications"

export const SettingsPage = async () => {
  const { name, active_partner } = await loadUserProfile()
  if (!name) redirect("/")

  return (
    <div className="py-0.5 text-center space-y-5 px-1.5 overflow-y-scroll max-h-screen">
      {/* Back button */}
      <BackButton />

      {/* 'Settings' title */}
      <h1 className="opacity-80">Settings</h1>

      {/* HelloName */}
      <HelloName name={name} />

      <EnableNotifications />

      {/* Partnership Settings */}
      <PartnershipSettings name={name} active_partner={active_partner} />

      {/* Logout button */}
    </div>
  )
}
