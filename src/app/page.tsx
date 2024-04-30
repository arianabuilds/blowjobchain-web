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
      <a href="/login" className="group rounded-lg px-5 py-4 transition hover:bg-blue-800/30">
        <h2 className="text-2xl font-semibold">
          Log In{" "}
          <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
            -&gt;
          </span>
        </h2>
      </a>

      <footer />
    </main>
  )
}
