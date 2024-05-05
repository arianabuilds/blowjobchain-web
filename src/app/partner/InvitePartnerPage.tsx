import { Login } from "../Login"
import { Logo } from "../Logo"

export function InvitePartnerPage() {
  return (
    <div className="text-center">
      <Logo />
      <p className="mt-7">
        <b className="font-semibold">[name]</b> invites you to be their partner 💕
      </p>

      <p className="mt-8 mb-3 opacity-60">A surprisingly fun way to reward each other.</p>
      <p className="mb-12 opacity-60 italic">Earn 10 points to claim 1 blowjob card</p>

      <Login inviterID="foobar" />
    </div>
  )
}
