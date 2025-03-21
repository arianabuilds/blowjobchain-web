import { redirect } from "next/navigation"
import { HelloName } from "../logged-in/HelloName"
import { loadUserProfile } from "../HomePage"
import { PartnershipSettings } from "./partnership/PartnershipSettings"
import { BackButton } from "./BackButton"
import { EnableNotifications } from "./EnableNotifications"
import { PasswordSettings } from "./password/PasswordSettings"
import { LogOutButton } from "./LogOutButton"
import { SuspenseHelper } from "../SuspenseHelper"

export const SettingsPage = async () => {
  const { name, active_partner } = await loadUserProfile()
  if (!name) redirect("/")

  return (
    <div className="py-0.5 text-center px-3.5 overflow-y-scroll max-h-screen w-full">
      <div className="max-w-lg pb-6 mx-auto space-y-5">
        <BackButton />

        {/* 'Settings' title */}
        <h1 className="opacity-60">Settings</h1>
        <HelloName name={name} />
        <EnableNotifications />

        <SuspenseHelper name="Partnership settings">
          <PartnershipSettings name={name} active_partner={active_partner} />
        </SuspenseHelper>

        <SuspenseHelper name="Password settings">
          <PasswordSettings />
        </SuspenseHelper>

        <LogOutButton />
      </div>
    </div>
  )
}
