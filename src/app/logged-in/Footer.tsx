import { Balance } from "./Balance"
import { GrantAndClaimBtns } from "./GrantAndClaimBtns"
import { loadPartnerships } from "./load-partnerships"
import { isNonEmptyArray } from "./getActivePartnership"

export const Footer = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: null | string
}) => {
  const { partnerships } = await loadPartnerships()

  return (
    <div className="mb-8">
      <p className="text-zinc-300/80 mb-1 text-sm text-center opacity-40 mt-2">
        10 points = 1 blowjob card
      </p>
      {partnerships && isNonEmptyArray(partnerships) && (
        <Balance name={name} partnerships={partnerships} active_partner={active_partner} />
      )}
      <GrantAndClaimBtns partnerships={partnerships} active_partner={active_partner} />
    </div>
  )
}
