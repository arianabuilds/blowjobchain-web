"use server"

import { createSupabaseServer } from "@/supabase/server"
import { InvitePartnerLink } from "../InvitePartnerLink"
import { loadPartnerships } from "../load-partnerships"

export const PartnershipSettings = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: string | null
}) => {
  const { partnerships } = await loadPartnerships()
  if (!partnerships) return <p>Error loading partnerships</p>

  const active =
    partnerships.find((p) => [p.inviter, p.invitee].includes(active_partner || "")) ||
    partnerships[0]

  return (
    <div className="bg-black/5 rounded-xl p-2 text-left">
      <h3 className="mb-5">Partnership Settings:</h3>
      {/* Active Partnership */}
      <div className="rounded-lg bg-black/10 p-1 px-3 mb-3">
        <p>{active.inviter_name !== name ? active.inviter_name : active.invitee_name}</p>
        <div className="flex justify-between mt-2 text-sm">
          <button className="bg-red-600/40 rounded px-2 cursor-not-allowed">Archive</button>
          <div className="opacity-40 italic">Current</div>
        </div>
      </div>

      {/* Other Partnerships */}
      {partnerships.length > 1 && (
        <>
          {partnerships
            .filter((p) => p !== active)
            .map((p, i) => (
              <div key={i} className="rounded-lg bg-black/10 p-1 px-3 mb-3">
                <p>{p.inviter_name !== name ? p.inviter_name : p.invitee_name}</p>
                <div className="flex justify-between mt-2 text-sm">
                  <button className="bg-red-600/40 rounded px-2 cursor-not-allowed">Archive</button>
                  <form>
                    <button
                      type="submit"
                      className="bg-neutral-200/40 hover:bg-neutral-300/40 rounded px-2"
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
