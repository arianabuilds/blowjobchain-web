import { createSupabaseServer } from "@/supabase/server"
import { InvitePartnerLink } from "../InvitePartnerLink"
import { loadPartnerships } from "../load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"

const rowStyle = "rounded-lg bg-white/10 p-1 px-4 mb-3 flex justify-between"

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
      <h3 className="mb-3">Partnership Settings:</h3>
      {/* Active Partnership */}
      <div className={rowStyle}>
        {/* Name */}
        <div>{active.inviter_name !== name ? active.inviter_name : active.invitee_name}</div>
        {/* Current label */}
        {partnerships.length > 1 && <div className="text-sm opacity-40 italic pt-0.5">Current</div>}
      </div>

      {/* Other Partnerships */}
      {partnerships.length > 1 &&
        partnerships
          .filter((p) => p !== active)
          .map((p, i) => (
            // One row
            <div key={i} className={rowStyle}>
              {/* Name */}
              <div>{p.inviter_name !== name ? p.inviter_name : p.invitee_name}</div>

              {/* Set Current button */}
              <form>
                <button
                  type="submit"
                  className="text-black/30 border-black/20 border hover:bg-white/20 hover:text-black/70 rounded px-2 text-sm"
                  formAction={async () => {
                    "use server"

                    const supabase = createSupabaseServer()

                    // Get user.id
                    const {
                      data: { session },
                    } = await supabase.auth.getSession()
                    if (!session) return console.error("Error: not logged in")
                    const { user } = session

                    // Save new active_partner id to db
                    const { error } = await supabase
                      .from("profiles")
                      .update({ active_partner: p.inviter !== user.id ? p.inviter : p.invitee })
                      .eq("user_id", user.id)
                    if (error) return console.error("Error setting active_partner:", error)
                  }}
                >
                  Set Current
                </button>
              </form>
            </div>
          ))}

      {/* Invite New Partner */}
      <InvitePartnerLink />

      {/* Archived Partnerships */}
    </div>
  )
}
