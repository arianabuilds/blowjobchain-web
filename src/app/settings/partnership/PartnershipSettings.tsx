import { loadPartnerships } from "@/app/logged-in/load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "@/app/logged-in/getActivePartnership"

import { MembershipSettings } from "./MembershipSettings"
import { AddNewPartner } from "./AddNewPartner"

import { SetCurrentButton } from "./SetCurrentButton"

const shadedRowStyle = "rounded-lg bg-white/10 p-1 px-4 mb-3 flex justify-between"

export const PartnershipSettings = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: string | null
}) => {
  const { partnerships } = await loadPartnerships()
  if (!partnerships) return <p>Error loading partnerships</p>
  if (!isNonEmptyArray(partnerships)) return null

  const active = getActivePartnership(partnerships, active_partner)

  return (
    <div className="p-3 px-5 text-left bg-black/10 rounded-xl">
      {/* Active Partnership */}
      <h3 className="mb-1 font-medium text-zinc-300/60">Active Partnership</h3>
      <div className={`${shadedRowStyle} flex-col`}>
        {/* Top row */}
        <div className="flex justify-between">
          {/* Name */}
          <div className="text-zinc-300/80">
            {active.inviter_name !== name ? active.inviter_name : active.invitee_name}
          </div>
          {/* Current label */}
          {partnerships.length > 1 && (
            <div className="text-zinc-200/70 text-sm opacity-40 italic pt-0.5">Current</div>
          )}
        </div>

        <MembershipSettings />
      </div>

      {/* Other Partnerships */}
      {partnerships.length > 1 &&
        partnerships
          .filter((p) => p !== active)
          .map((p, i) => (
            <div key={i} className={shadedRowStyle}>
              {/* Name */}
              <div className="text-zinc-300/70">
                {p.inviter_name !== name ? p.inviter_name : p.invitee_name}
              </div>

              <SetCurrentButton {...{ p }} />
            </div>
          ))}

      <AddNewPartner />
    </div>
  )
}
