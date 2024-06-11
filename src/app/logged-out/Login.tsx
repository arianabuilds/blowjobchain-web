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
      className="inline-block px-5 py-4 transition rounded-lg group hover:bg-[#5c0241] active:bg-pink-600/20"
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
    <form className="flex flex-col -mt-20 text-center">
      <h3 className="mb-10 text-xl opacity-70">{!inviterID ? "Log In" : "Join"}</h3>
      <input
        name="email"
        className="p-1 px-3 rounded text-black/70"
        placeholder="Email"
        type="email"
      />
      <input name="inviter-id" value={inviterID} type="hidden" />
      <SendLoginCodeButton />
    </form>
  ) : (
    // Enter Login Code
    <form className="flex flex-col -mt-20 text-center">
      <p className="mb-2 text-sm opacity-60 ">
        Email sent to <i>{email}</i>
      </p>
      <h3 className="mb-10 text-xl">Enter Login Code</h3>
      <input name="email" value={email as string} type="hidden" />
      <input
        name="login-code"
        className="p-1 px-3 rounded text-black/70"
        placeholder="6-digit code"
        type="text"
      />
      <SubmitCodeButton />
    </form>
  )
}

const buttonClass =
  "p-1 mt-2 text-white/80 rounded bg-fuchsia-900/40 hover:bg-fuchsia-800/50 active:bg-fuchsia-700/50"

function SendLoginCodeButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} formAction={login} className={buttonClass}>
      Send{pending ? "ing" : ""} Login Code
    </button>
  )
}

function SubmitCodeButton() {
  const { pending } = useFormStatus()
  return (
    <button disabled={pending} formAction={submitLoginCode} className={buttonClass}>
      Submit{pending ? "ting..." : ""}
    </button>
  )
}
