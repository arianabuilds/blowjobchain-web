"use client"

import { createSupabaseClient } from "@/supabase/client"
import { privateToPublic } from "ed25519-keys"
import { useRef, useState } from "react"

export const SetPassword = () => {
  const $input = useRef<HTMLInputElement>(null)
  const [saving, setSaving] = useState(false)
  return (
    <div className="flex mt-2">
      <input
        className="w-56 p-2 rounded-lg opacity-60 text-gray-600"
        placeholder="correcthorsebatterystaple"
        ref={$input}
      />
      <button
        className="w-20 ml-2 text-sm border border-zinc-300/50 rounded-lg hover:bg-white/10 active:bg-white/20"
        onClick={async () => {
          // Are they logged in?
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Error: not logged in")

          // 1. user inputs password
          const password = $input.current?.value
          if (!password) return

          setSaving(true)

          // 2, 3: password -> private key -> public key
          const pubKey = await passwordToPublicKey(password)

          // 4. store public key in db
          const { error } = await supabase.from("pub_keys").insert({ value: pubKey, user_id })
          if (error) alert(JSON.stringify(error))

          window.location.reload()
        }}
      >
        Sav{!saving ? "e" : "ing"}
      </button>
    </div>
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

export async function passwordToPublicKey(password: string) {
  // 2. password derives private key
  const privateKey = new Uint32Array(
    await derivePrivateKey(password, "oursalt_sjdkjfskjdfklsjfnvn"),
  ).toString()
  // console.log("privateKey", privateKey)

  // 3. private key calculates public key
  const pubKey = await privateToPublic(privateKey).catch(console.error)
  // console.log("pubKey", pubKey)

  return pubKey
}
