import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"
import { createSupabaseServer } from "@/supabase/server"
import { SetYourName } from "./SetYourName"
import { EmptyList } from "./EmptyList"
import { GrantAndClaimBtns } from "./GrantAndClaimBtns"

export async function HomePage() {
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
    <>
      {/* Logo and tagline */}
      <div className="text-center">
        <p className={`${!name ? "text-4xl pt-24" : "text-2xl pt-5"} font-semibold`}>
          BlowjobChain
        </p>
        {!user && <RotatingTagline />}
      </div>

      {/* Page content */}
      {!user ? <Login /> : !name ? <SetYourName /> : <EmptyList name={name} />}

      <footer className="pb-6">{!!name && <GrantAndClaimBtns />}</footer>
    </>
  )
}
