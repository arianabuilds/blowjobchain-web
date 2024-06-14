"use client"

import { createSupabaseClient } from "@/supabase/client"

export const ForgotPassword = () => {
  return (
    <>
      <button
        className=" rounded-lg w-full text-sm py-1.5 my-1.5 opacity-70 bg-purple-500 bg-opacity-40 hover:bg-opacity-50 active:bg-opacity-60"
        onClick={async () => {
          // Are they logged in
          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getSession()).data.session?.user.id
          if (!user_id) return alert("Error: not logged in")

          // Confirmation dialog
          const confirmed =
            confirm(`Are you sure you want to remove your password & public key from your account?
          
This will be shown in the chain.`)
          if (!confirmed) return

          // Remove pubkey from account
          const { error } = await supabase
            .from("profiles")
            .update({ pub_key: null })
            .eq("user_id", user_id)
          if (error) alert(JSON.stringify(error))

          window.location.reload()
        }}
      >
        Forgot Password?
      </button>
    </>
  )
}
