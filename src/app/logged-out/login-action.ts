"use server"

import { redirect } from "next/navigation"
import { createTransport } from "nodemailer"

import { createSupabaseServer } from "@/supabase/server"
import { createSupabaseAdmin } from "@/supabase/admin"

export async function login(formData: FormData) {
  // type-casting for convenience, should validate
  const email = formData.get("email") as string

  if (!email) return

  const { data, error } = await createSupabaseAdmin().auth.admin.generateLink({
    email,
    type: "magiclink",
  })
  if (error) return console.log("log-in error:", error), redirect("/error")

  await sendLoginEmail(email, data.properties)

  // If there was an inviterID, store the relationship
  const inviterID = formData.get("inviter-id")
  if (typeof inviterID === "string") storePartnershipInvitation(inviterID, email)

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

const { SMTP_SERVER, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD } = process.env
const nodemailer = createTransport({
  // @ts-expect-error
  host: SMTP_SERVER,
  port: SMTP_PORT,
  secure: true,
  auth: { user: SMTP_USERNAME, pass: SMTP_PASSWORD },
})

async function sendLoginEmail(
  recipient_email: string,
  {
    action_link,
    email_otp,
  }: {
    action_link: string
    email_otp: string
  },
) {
  try {
    await nodemailer.sendMail({
      from: '"BlowjobChain" <blowjobchain@gmail.com>',
      to: recipient_email,
      subject: `Confirm Your Email: ${email_otp}`,
      html: `<h2>Confirm your email</h2>
    <p><a href="${action_link}">Click here</a> or enter this code: ${email_otp}</p>`,
    })
  } catch (error) {
    console.error("Failed to send login email:", error)
  }
}
