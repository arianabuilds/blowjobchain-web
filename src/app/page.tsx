import { Login } from "./Login"
import { RotatingTagline } from "./RotatingTagline"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-24 px-4">
      {/* Logo and tagline */}
      <div className="text-center">
        <p className="text-4xl font-semibold">BlowjobChain</p>
        <RotatingTagline />
      </div>

      {/* Login button */}
      <Login />

      <footer />
    </main>
  )
}
