import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"
import { createClient } from "@/supabase/server"

export default async function Home() {
  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 px-4">
      {/* Logo and tagline */}
      <div className="text-center">
        <p className="text-4xl font-semibold">BlowjobChain</p>
        <RotatingTagline />
      </div>

      {!user ? <Login /> : <>Logged in: {user.email}</>}

      <footer />
    </main>
  )
}
