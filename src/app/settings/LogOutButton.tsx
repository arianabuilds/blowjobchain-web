"use client"

import { useRouter } from "next/navigation"
import { createSupabaseClient } from "@/supabase/client"

export const LogOutButton = () => {
  const router = useRouter()
  const supabase = createSupabaseClient()

  return (
    <button
      className="hover:bg-black/10 px-3 rounded-lg py-2 text-sm font-light cursor-pointer border-black/20 border"
      onClick={async () => {
        // Supabase logout call
        const { error } = await supabase.auth.signOut()
        if (error) return console.error("Error logging out:", error)

        // Redirect to HomePage
        router.push("/")
      }}
    >
      ↪ Log Out
    </button>
  )
}
