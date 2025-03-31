import { HelloName } from "./name/HelloName"
import { PartnershipSettings } from "./partnership/PartnershipSettings"
import { BackButton } from "./BackButton"
import { EnableNotifications } from "./EnableNotifications"
import { PasswordSettings } from "./password/PasswordSettings"
import { LogOutButton } from "./LogOutButton"
import { SuspenseHelper } from "../SuspenseHelper"

export const SettingsPage = async () => {
  return (
    <div className="py-0.5 text-center px-3.5 overflow-y-scroll max-h-screen w-full">
      <div className="max-w-lg pb-6 mx-auto space-y-5">
        <BackButton />

        {/* 'Settings' title */}
        <h1 className="opacity-60">Settings</h1>
        <SuspenseHelper name="Name settings">
          <HelloName />
        </SuspenseHelper>
        <EnableNotifications />

        <SuspenseHelper name="Partnership settings">
          <PartnershipSettings />
        </SuspenseHelper>

        <SuspenseHelper name="Password settings">
          <PasswordSettings />
        </SuspenseHelper>

        <LogOutButton />
      </div>
    </div>
  )
}
