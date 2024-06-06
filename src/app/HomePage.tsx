import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"
import { SetYourName } from "./SetYourName"
import { MainScreen } from "./MainScreen"
import { Logo } from "./Logo"
import { Footer } from "./Footer"
import { SettingsButton } from "./SettingsButton"
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
        <MainScreen name={name} active_partner={active_partner} />
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
