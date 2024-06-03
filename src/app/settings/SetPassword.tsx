"use client"

import { createSupabaseClient } from "@/supabase/client"
import { PBKDF2 } from "crypto-js"
import { privateToPublic } from "ed25519-keys"
import { useRef, useState } from "react"

export const SetPassword = () => {
  const $input = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  return (
    <>
      <input
        className="w-56 p-2 py-2 rounded-lg mt-2 opacity-90"
        placeholder="correcthorsebatterystaple"
        ref={$input}
      />
      <button
        className="border ml-2 p-2 rounded-lg text-sm px-5 hover:bg-white/10"
        onClick={async () => {
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Error: not logged in")

          // 1. user inputs password
          const input = $input.current?.value
          if (!input) return

          setSaving(true)

          // 2. password derives private key
          const privateKey = PBKDF2(input, "oursalt_sjdkjfskjdfklsjfnvn").toString()

          // 3. private key calculates public key
          const pubKey = await privateToPublic(privateKey).catch(console.error)

          //   // 4. store public key in db
          const { error } = await supabase
            .from("profiles")
            .update({ pub_key: pubKey })
            .eq("user_id", user_id)
          if (error) alert(JSON.stringify(error))

          setSaving(false)
        }}
      >
        Sav{!saving ? "e" : "ing"}
      </button>
    </>
  )
}
