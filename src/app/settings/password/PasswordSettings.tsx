import { ForgotPassword } from "./ForgotPassword"
import { SetPassword } from "./SetPassword"
import PasswordIcon from "./PasswordIcon.svg"
import Image from "next/image"
import { get_user_id_server } from "@/app/get-user-id-server"

export const PasswordSettings = async () => {
  const { user_id, supabase } = await get_user_id_server()
  if (!user_id) return null

  const { data } = await supabase
    .from("pub_keys")
    .select()
    .eq("user_id", user_id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()
  const isPasswordSet = !!data?.value

  return (
    <div className="p-2 px-5 text-left rounded-lg bg-white/5">
      <h2 className="font-medium">
        {!isPasswordSet ? "Set Password" : "Password Was Set"} for Extra Security
      </h2>
      <p className="text-sm opacity-60">
        This password {!isPasswordSet ? "will be" : "is"} used as a private key to prevent anyone
        else from granting points.
      </p>
      <p className="mt-2 text-sm text-zinc-300/30">
        <Image
          className="inline mr-1 scale-x-75 -ml-0.5 relative bottom-0.5"
          src={PasswordIcon}
          alt="Password Icon"
        />{" "}
        Required when granting or claiming points
      </p>
      {!isPasswordSet ? <SetPassword /> : <ForgotPassword />}
    </div>
  )
}
