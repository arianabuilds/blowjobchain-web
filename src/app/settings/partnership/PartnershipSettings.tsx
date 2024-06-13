import { loadPartnerships } from "@/app/logged-in/load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "@/app/logged-in/getActivePartnership"

import { MembershipSettings } from "./MembershipSettings"
import { AddNewPartner } from "./AddNewPartner"

import { SetCurrentButton } from "./SetCurrentButton"

const shadedRowStyle = "rounded-lg bg-black/15 p-1 px-4 mb-3 flex justify-between"

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
    <div className="p-3 px-5 text-left bg-white/5 rounded-xl">
      {/* Active Partnership */}
      <h3 className="mb-1 font-medium opacity-70">Active Partnership</h3>
      <div className={`${shadedRowStyle} flex-col`}>
        {/* Top row */}
        <div className="flex justify-between">
          {/* Name */}
          <div className="opacity-90">
            {active.inviter_name !== name ? active.inviter_name : active.invitee_name}
          </div>
          {/* Current label */}
          {partnerships.length > 1 && (
            <div className="text-sm opacity-40 italic pt-0.5">Current</div>
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
              <div className="opacity-80">
                {p.inviter_name !== name ? p.inviter_name : p.invitee_name}
              </div>

              <SetCurrentButton {...{ p }} />
            </div>
          ))}

      <AddNewPartner />
    </div>
  )
}
