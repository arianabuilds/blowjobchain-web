import { redirect } from "next/navigation"
import { HelloName } from "../HelloName"
import { loadUserIDandName } from "../HomePage"
import Link from "next/link"
import { PartnershipSettings } from "./PartnershipSettings"

export const SettingsPage = async () => {
  const { name } = await loadUserIDandName()
  if (!name) redirect("/")

  return (
    <div className="p-4 text-center space-y-3">
      {/* Back button */}
      <Link href="/" className="absolute left-5 top-5">
        {"<"}
      </Link>

      {/* 'Settings' title */}
      <h1>Settings</h1>

      {/* HelloName */}
      <HelloName name={name} />

      {/* Partnership Settings */}
      <PartnershipSettings />

      {/* Logout button */}
    </div>
  )
}
