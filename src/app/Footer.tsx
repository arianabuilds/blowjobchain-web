import { Balance } from "./Balance"
import { GrantAndClaimBtns } from "./GrantAndClaimBtns"

export const Footer = () => {
  return (
    <div>
      <p className="mb-3 text-center italic opacity-40 text-lg">10 points = 1 blowjob card</p>
      <Balance />
      <GrantAndClaimBtns />
    </div>
  )
}
