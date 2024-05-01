"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login } from "./login-action"

export const Login = () => {
  const searchParams = useSearchParams()

  return !searchParams.has("login") ? (
    // Login Button
    <Link href="?login" className="group rounded-lg px-5 py-4 transition hover:bg-blue-800/30">
      <h2 className="text-2xl font-semibold">
        Log In{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
    </Link>
  ) : (
    // Login screen
    <form className="flex flex-col text-center">
      <h3 className="text-xl mb-10">Log In</h3>
      <input name="email" className="rounded p-1 px-3" placeholder="Email" type="email" />
      <button formAction={login} className="bg-blue-900/80 rounded text-white p-1 mt-2">
        Send Login Code
      </button>
    </form>
  )
}
