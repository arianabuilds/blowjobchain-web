"use client"

import { createSupabaseClient } from "@/supabase/client"
import { privateToPublic } from "ed25519-keys"
import { useRef, useState } from "react"

export const SetPassword = () => {
  const $input = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  return (
    <>
      <input
        className="w-56 p-2 py-2 mt-2 rounded-lg opacity-90"
        placeholder="correcthorsebatterystaple"
        ref={$input}
      />
      <button
        className="p-2 px-5 ml-2 text-sm border rounded-lg hover:bg-white/10"
        onClick={async () => {
          // Are they logged in?
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Error: not logged in")

          // 1. user inputs password
          const input = $input.current?.value
          if (!input) return

          setSaving(true)

          // 2. password derives private key
          const privateKey = new Uint32Array(
            await derivePrivateKey(input, "oursalt_sjdkjfskjdfklsjfnvn"),
          ).toString()
          // console.log("privateKey", privateKey)

          // 3. private key calculates public key
          const pubKey = await privateToPublic(privateKey).catch(console.error)
          // console.log("pubKey", pubKey)

          //   // 4. store public key in db
          const { error } = await supabase
            .from("profiles")
            .update({ pub_key: pubKey })
            .eq("user_id", user_id)
          if (error) alert(JSON.stringify(error))

          window.location.reload()
        }}
      >
        Sav{!saving ? "e" : "ing"}
      </button>
    </>
  )
}

async function derivePrivateKey(input: string, salt: string): Promise<ArrayBuffer> {
  const enc = new TextEncoder()
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    enc.encode(input),
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  )

  return crypto.subtle.deriveBits(
    { name: "PBKDF2", salt: enc.encode(salt), iterations: 1000, hash: "SHA-256" },
    keyMaterial,
    256,
  )
}
