"use server"

// import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { createClient } from "@/supabase/server"

export async function login(formData: FormData) {
  const supabase = createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = { email: formData.get("email") as string }

  const { error } = await supabase.auth.signInWithOtp(data)

  if (error) console.log("log-in error:", error)
  //   if (error) redirect("/error")

  //   revalidatePath("/", "layout")
  redirect(`?enter-login-code&email=${data.email}`)
}

export async function submitLoginCode(formData: FormData) {
  const supabase = createClient()

  const {
    data: { session },
    error,
  } = await supabase.auth.verifyOtp({
    email: formData.get("email") as string,
    token: formData.get("login-code") as string,
    type: "email",
  })

  if (error) console.log("log-in error:", error)
  //   if (error) redirect("/error")

  console.log("session", session)

  redirect("/")
}
