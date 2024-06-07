import { createSupabaseServer } from "@/supabase/server"
import { ForgotPassword } from "./ForgotPassword"
import { SetPassword } from "./SetPassword"

export const PasswordSettings = async () => {
  const { data } = await createSupabaseServer().from("profiles").select("pub_key").single()
  const isPasswordSet = !!data?.pub_key

  return (
    <div className="p-2 px-5 text-left rounded-lg bg-black/5">
      <h2 className="font-medium">
        {!isPasswordSet ? "Set Password" : "Password Was Set"} for Extra Security
      </h2>
      <p className="text-sm opacity-60">
        This password {!isPasswordSet ? "will be" : "is"} used as a private key to prevent anyone
        else from granting points.
      </p>
      <p className="mt-2 text-sm text-black/60">🔒 Required when granting or claiming points</p>
      {!isPasswordSet ? <SetPassword /> : <ForgotPassword />}
    </div>
  )
}
