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
  //   redirect("/")
}
