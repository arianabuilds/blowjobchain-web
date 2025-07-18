import { Login } from "./logged-out/Login"
import { RotatingTagline } from "./logged-out/RotatingTagline"
import { SetYourName } from "./logged-in/SetYourName"
import { MainList } from "./logged-in/MainList"
import { Logo } from "./Logo"
import { Footer } from "./logged-in/Footer"
import { SettingsButton } from "./logged-in/SettingsButton"
import { Tables } from "@/supabase/types"
import { get_user_id_server } from "./get-user-id-server"
import { Suspense } from "react"
import Image from "next/image"
import orgasm from "./logged-in/orgasm.png"

export async function HomePage() {
  const { user_id, name, active_partner } = await loadUserProfile()

  return (
    <>
      {/* Logo and tagline */}
      <div className="text-center">
        <Logo big={!name} />
        {!user_id && <RotatingTagline />}
        {name && <SettingsButton />}
      </div>

      {/* Page content */}
      {!user_id ? (
        <div className="flex flex-col justify-center flex-1">
          <Login />
        </div>
      ) : !name ? (
        <SetYourName />
      ) : (
        <>
          <Image className="max-w-[22rem] mx-auto px-2" src={orgasm} alt="Orgasm image" />
          <Suspense
            fallback={<div className="mt-20 mb-20 italic animate-pulse">Loading your data...</div>}
          >
            <MainList name={name} active_partner={active_partner} />
          </Suspense>
        </>
      )}

      <footer className="pb-6">
        {!!name && (
          <Suspense fallback={<></>}>
            <Footer name={name} active_partner={active_partner} />
          </Suspense>
        )}
      </footer>
    </>
  )
}

type NotLoggedIn = Record<string, undefined>
type NoProfileYet = NotLoggedIn & { user_id: string }
type Profile = Tables<"profiles">
export async function loadUserProfile(): Promise<NotLoggedIn | NoProfileYet | Profile> {
  // Are they logged in?
  const { user_id, supabase } = await get_user_id_server()
  if (!user_id) return {}

  // Load user profile
  const { data: profile, error } = await supabase
    .from("profiles")
    .select()
    .eq("user_id", user_id)
    .maybeSingle()
  if (error) return console.error("Load-name error:", error), {}

  if (!profile) return { user_id } as NoProfileYet

  return profile
}
