import { InvitePartnerLink } from "../InvitePartnerLink"

export const PartnershipSettings = () => {
  return (
    <div className="bg-black/5 rounded-xl p-2 text-left">
      <h3 className="mb-5">Partnership Settings:</h3>
      {/* Active Partnership */}

      {/* Other Partnerships */}

      {/* Invite New Partner */}
      <InvitePartnerLink />

      {/* Archived Partnerships */}
    </div>
  )
}
