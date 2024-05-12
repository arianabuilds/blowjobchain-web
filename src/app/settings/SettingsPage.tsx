import { redirect } from "next/navigation"
import { HelloName } from "../HelloName"
import { loadUserIDandName } from "../HomePage"
import Link from "next/link"

export const SettingsPage = async () => {
  const { name } = await loadUserIDandName()
  if (!name) redirect("/")

  return (
    <div className="p-4">
      {/* Back button */}
      <Link href="/" className="absolute left-5 top-5">
        {"<"}
      </Link>

      {/* 'Settings' title */}
      <h1>Settings</h1>

      {/* HelloName */}
      <HelloName name={name} />

      {/* Partnership Settings */}

      {/* Logout button */}
    </div>
  )
}
