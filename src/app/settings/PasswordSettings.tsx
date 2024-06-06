import { ForgotPassword } from "./ForgotPassword"
import { SetPassword } from "./SetPassword"

export const PasswordSettings = () => {
  const isPasswordSet = true
  return (
    <div className="bg-black/5 rounded-lg p-2 text-left px-5">
      <h2 className="font-medium">
        {!isPasswordSet ? "Set Password" : "Password Set"} for Extra Security
      </h2>
      <p className="text-sm opacity-60">
        This password {!isPasswordSet ? "will be" : "is"} used as a private key to prevent anyone
        else from granting points.
      </p>
      <p className="text-sm text-black/60 mt-2">🔒 Required when granting or claiming points</p>
      {!isPasswordSet ? <SetPassword /> : <ForgotPassword />}
    </div>
  )
}
