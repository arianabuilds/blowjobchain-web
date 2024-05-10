import { Balance } from "./Balance"
import { GrantAndClaimBtns } from "./GrantAndClaimBtns"
import { loadPartnerships } from "./load-partnerships"

export const Footer = async ({ name }: { name: string }) => {
  const { partnerships } = await loadPartnerships()

  return (
    <div>
      <p className="mb-3 text-center italic opacity-40 text-lg">10 points = 1 blowjob card</p>
      {partnerships && <Balance name={name} partnerships={partnerships} />}
      <GrantAndClaimBtns partnerships={partnerships} />
    </div>
  )
}
