import { Balance } from "./Balance"
import { GrantAndClaimBtns } from "./GrantAndClaimBtns"
import { loadPartnerships } from "./load-partnerships"
import { isNonEmptyArray } from "./settings/getActivePartnership"

export const Footer = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: null | string
}) => {
  const { partnerships } = await loadPartnerships()

  return (
    <div>
      <p className="mb-3 text-center italic opacity-40 text-lg">10 points = 1 blowjob card</p>
      {partnerships && isNonEmptyArray(partnerships) && (
        <Balance name={name} partnerships={partnerships} active_partner={active_partner} />
      )}
      <GrantAndClaimBtns partnerships={partnerships} active_partner={active_partner} />
    </div>
  )
}
