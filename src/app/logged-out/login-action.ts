"use server"

import { redirect } from "next/navigation"

import { createSupabaseServer } from "@/supabase/server"
import { createSupabaseAdmin } from "@/supabase/admin"

export async function login(formData: FormData) {
  const supabase = createSupabaseServer()

  // type-casting for convenience, should validate
  const email = formData.get("email") as string

  if (!email) return

  const { error } = await supabase.auth.signInWithOtp({ email })

  // If there was an inviterID, store the relationship
  const inviterID = formData.get("inviter-id")
  if (typeof inviterID === "string") storePartnershipInvitation(inviterID, email)

  if (error) console.log("log-in error:", error)
  // if (error) redirect("/error")

  redirect(
    `?enter-login-code&email=${email}${typeof inviterID === "string" ? `&u=${inviterID}` : ""}`,
  )
}

export async function submitLoginCode(formData: FormData) {
  const supabase = createSupabaseServer()

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

  // console.log("session", session)

  redirect("/")
}

async function storePartnershipInvitation(inviterID: string, inviteeEmail: string) {
  const supaAdmin = createSupabaseAdmin()

  const { data: newUser, error } = await supaAdmin.rpc("get_user_id_by_email", {
    email: inviteeEmail,
  })

  if (error) return console.error("Error loading new partner ID", error)
  if (!newUser?.[0]) return console.error("Error finding new invitee", inviterID, inviteeEmail)

  return supaAdmin.from("partnerships").insert({ inviter: inviterID, invitee: newUser[0].id })
}
