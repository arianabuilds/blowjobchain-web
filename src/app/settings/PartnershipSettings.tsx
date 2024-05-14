"use server"

import { createSupabaseServer } from "@/supabase/server"
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
          {others.map((p, i) => (
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
