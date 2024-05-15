"use client"

import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { login, submitLoginCode } from "./login-action"
import { useFormStatus } from "react-dom"

export const Login = ({ inviterID }: { inviterID?: string }) => {
  const searchParams = useSearchParams()
  const isLoginScreen = searchParams.has("login")
  const isEnterLoginCodeScreen = searchParams.has("enter-login-code")
  const email = searchParams.get("email")

  return !isLoginScreen && !isEnterLoginCodeScreen && !inviterID ? (
    // Login Button
    <Link
      href="?login"
      className="inline-block group rounded-lg px-5 py-4 transition hover:bg-blue-800/30"
    >
      <h2 className="text-2xl font-semibold">
        Log In{" "}
        <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
          -&gt;
        </span>
      </h2>
    </Link>
  ) : !isEnterLoginCodeScreen ? (
    // Login screen
    <form className="flex flex-col text-center">
      <h3 className="text-xl mb-10">{!inviterID ? "Log In" : "Join"}</h3>
      <input name="email" className="rounded p-1 px-3" placeholder="Email" type="email" />
      <input name="inviter-id" value={inviterID} type="hidden" />
      <SendLoginCodeButton />
    </form>
  ) : (
    // Enter Login Code
    <form className="flex flex-col text-center">
      <p className="opacity-60 text-sm mb-2">
        Email sent to <i>{email}</i>
      </p>
      <h3 className="text-xl mb-10">Enter Login Code</h3>
      <input name="email" value={email as string} type="hidden" />
      <input
        name="login-code"
        className="rounded p-1 px-3"
        placeholder="6-digit code"
        type="text"
      />
      <SubmitCodeButton />
    </form>
  )
}

function SendLoginCodeButton() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      formAction={login}
      className="bg-blue-900/80 rounded text-white p-1 mt-2"
    >
      Send{pending ? "ing" : ""} Login Code
    </button>
  )
}

function SubmitCodeButton() {
  const { pending } = useFormStatus()
  return (
    <button
      disabled={pending}
      formAction={submitLoginCode}
      className="bg-blue-900/80 rounded text-white p-1 mt-2"
    >
      Submit{pending ? "ting..." : ""}
    </button>
  )
}
