"use client"

import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/supabase/client"

export const LogOutButton = () => {
  const router = useRouter()

  return (
    <button
      className="px-3 py-2 text-sm font-light border rounded-lg cursor-pointer hover:bg-black/10 active:bg-black/20 border-zinc-400/20"
      onClick={async () => {
        // Supabase logout call
        const { error } = await createSupabaseClient().auth.signOut()
        if (error) return console.error("Error logging out:", error)

        // Redirect to HomePage
        router.push("/")
      }}
    >
      <span className="relative mr-1 top-px">⤷</span> Log Out
    </button>
  )
}
