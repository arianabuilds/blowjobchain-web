import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"
import { createSupabaseServer } from "@/supabase/server"
import { SetYourName } from "./SetYourName"
import { EmptyList } from "./EmptyList"

export default async function Home() {
  const supabase = createSupabaseServer()
  // Are they logged in?
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Load user profile
  let name = ""
  if (user) {
    const { data, error } = await supabase.from("profiles").select().eq("user_id", user.id)
    if (error) console.error("Load-name error:", error)
    if (data) name = data[0]?.name
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 px-4">
      {/* Logo and tagline */}
      <div className="text-center">
        <p className="text-4xl font-semibold">BlowjobChain</p>
        {!user && <RotatingTagline />}
      </div>

      {/* Page content */}
      {!user ? <Login /> : !name ? <SetYourName /> : <EmptyList name={name} />}

      <footer />
    </main>
  )
}
