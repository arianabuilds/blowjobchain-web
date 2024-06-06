import { Login } from "./logged-out/Login"
import { RotatingTagline } from "./logged-out/RotatingTagline"
import { SetYourName } from "./logged-in/SetYourName"
import { MainList } from "./logged-in/MainList"
import { Logo } from "./Logo"
import { Footer } from "./logged-in/Footer"
import { SettingsButton } from "./logged-in/SettingsButton"
import { Tables } from "@/supabase/types"
import { get_user_id_server } from "./get-user-id-server"

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
        <Login />
      ) : !name ? (
        <SetYourName />
      ) : (
        <MainList name={name} active_partner={active_partner} />
      )}

      <footer className="pb-6">
        {!!name && <Footer name={name} active_partner={active_partner} />}
      </footer>
    </>
  )
}

export async function loadUserProfile(): Promise<Tables<"profiles"> | Record<string, undefined>> {
  // Are they logged in?
  const { user_id, supabase } = await get_user_id_server()
  if (!user_id) return {}

  // Load user profile
  const { data, error } = await supabase.from("profiles").select().eq("user_id", user_id)
  if (error) return console.error("Load-name error:", error), {}

  return data[0]
}
