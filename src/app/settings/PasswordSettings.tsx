import { SetPassword } from "./SetPassword"

export const PasswordSettings = () => {
  return (
    <div className="bg-black/5 rounded-lg p-2 text-left px-5">
      <h2 className="font-medium">Set Password for Extra Security</h2>
      <p className="text-sm opacity-60">
        This password will be used as a private key to prevent anyone else from granting points.
      </p>
      <p className="text-sm text-black/60 mt-2">🔒 Required when granting or claiming points</p>
      <SetPassword />
    </div>
  )
}
