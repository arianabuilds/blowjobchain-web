import { redirect } from "next/navigation"
import { HelloName } from "../HelloName"
import { loadUserIDandName } from "../HomePage"
import { PartnershipSettings } from "./PartnershipSettings"
import { BackButton } from "./BackButton"

export const SettingsPage = async () => {
  const { name } = await loadUserIDandName()
  if (!name) redirect("/")

  return (
    <div className="py-0.5 text-center space-y-5">
      {/* Back button */}
      <BackButton />

      {/* 'Settings' title */}
      <h1 className="opacity-80">Settings</h1>

      {/* HelloName */}
      <HelloName name={name} />

      {/* Partnership Settings */}
      <PartnershipSettings />

      {/* Logout button */}
    </div>
  )
}
