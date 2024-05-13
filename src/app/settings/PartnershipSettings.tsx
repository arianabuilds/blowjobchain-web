import { InvitePartnerLink } from "../InvitePartnerLink"
import { loadPartnerships } from "../load-partnerships"

export const PartnershipSettings = async ({ name }: { name: string }) => {
  const { partnerships } = await loadPartnerships()
  if (!partnerships) return <p>Error loading partnerships</p>
  const [first, ...others] = partnerships

  return (
    <div className="bg-black/5 rounded-xl p-2 text-left">
      <h3 className="mb-5">Partnership Settings:</h3>
      {/* Active Partnership */}
      <div className="rounded-lg bg-black/10 p-1 px-3 mb-3">
        <p>{first.inviter_name !== name ? first.inviter_name : first.invitee_name}</p>
        <div className="flex justify-between mt-2 text-sm">
          <button className="bg-red-600/40 rounded px-2 cursor-not-allowed">Archive</button>
          <div className="opacity-40 italic">Current</div>
        </div>
      </div>

      {/* Other Partnerships */}
      {!!others.length && (
        <>
          <p className="text-right text-sm opacity-70">Click to switch:</p>
          {others.map((p, i) => (
            <div key={i} className="rounded-lg bg-black/10 p-1 px-3 mb-3">
              <p>{p.inviter_name !== name ? p.inviter_name : p.invitee_name}</p>
              <div className="flex justify-between mt-2 text-sm">
                <button className="bg-red-600/40 rounded px-2 cursor-not-allowed">Archive</button>
              </div>
            </div>
          ))}
        </>
      )}

      {/* Invite New Partner */}
      <InvitePartnerLink />

      {/* Archived Partnerships */}
    </div>
  )
}
