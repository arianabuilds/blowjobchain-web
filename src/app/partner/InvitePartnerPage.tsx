import { Login } from "../Login"
import { Logo } from "../Logo"

export function InvitePartnerPage() {
  return (
    <div className="text-center">
      <Logo />
      <p className="mt-5">[inviter-name] invites you to be their partner on BlowjobChain</p>

      <p>A surprisingly fun way to reward each other.</p>
      <p>Earn 10 points to claim 1 blowjob card</p>

      <Login />
    </div>
  )
}
