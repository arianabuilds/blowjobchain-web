import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"
import { createSupabaseServer } from "@/supabase/server"
import { SetYourName } from "./SetYourName"
import { MainScreen } from "./MainScreen"
import { Logo } from "./Logo"
import { Footer } from "./Footer"
import { SettingsButton } from "./SettingsButton"

export async function HomePage() {
  const supabase = createSupabaseServer()
  // Are they logged in?
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Load user profile
  let name: string | null = null
  if (user) {
    const { data, error } = await supabase.from("profiles").select().eq("user_id", user.id)
    if (error) console.error("Load-name error:", error)
    if (data) name = data[0]?.name
  }

  return (
    <>
      {/* Logo and tagline */}
      <div className="text-center">
        <Logo big={!name} />
        {!user && <RotatingTagline />}
        {user && <SettingsButton />}
      </div>

      {/* Page content */}
      {!user ? <Login /> : !name ? <SetYourName /> : <MainScreen name={name} />}

      <footer className="pb-6">{!!name && <Footer name={name} />}</footer>
    </>
  )
}
