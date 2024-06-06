import { InvitePartnerLink } from "../../InvitePartnerLink"
import { loadPartnerships } from "../../load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { revalidatePath } from "next/cache"
import { get_user_id_server } from "../../get-user-id-server"
import { MembershipSettings } from "./MembershipSettings"

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
    <div className="bg-black/5 rounded-xl p-3 px-5 text-left">
      {/* Active Partnership */}
      <h3 className="mb-1 font-medium">Active Partnership</h3>
      <div className={`${shadedRowStyle} flex-col`}>
        {/* Top row */}
        <div className="flex justify-between">
          {/* Name */}
          <div>{active.inviter_name !== name ? active.inviter_name : active.invitee_name}</div>
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
              <div>{p.inviter_name !== name ? p.inviter_name : p.invitee_name}</div>

              {/* `Set Current` button */}
              <form>
                <button
                  type="submit"
                  className="text-black text-opacity-30 border-black/20 border hover:bg-white/20 hover:text-opacity-70 hover:border-purple-600 active:bg-white/40 rounded px-2 text-sm"
                  formAction={async () => {
                    "use server"

                    // Get user.id
                    const { user_id, supabase } = await get_user_id_server()
                    if (!user_id) return console.error("Error: not logged in")

                    // Save new active_partner id to db
                    const { error } = await supabase
                      .from("profiles")
                      .update({ active_partner: p.inviter !== user_id ? p.inviter : p.invitee })
                      .eq("user_id", user_id)
                    if (error) return console.error("Error setting active_partner:", error)

                    revalidatePath("/settings")
                  }}
                >
                  Set Current
                </button>
              </form>
            </div>
          ))}

      {/* Invite New Partner */}
      <InvitePartnerLink />
    </div>
  )
}
