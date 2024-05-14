import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName } from "./load-partnerships"
import { getActivePartnership } from "./settings/PartnershipSettings"

export const Balance = async ({
  name,
  partnerships,
  active_partner,
}: {
  name: string
  partnerships: PartnershipsWithName
  active_partner?: null | string
}) => {
  const active = getActivePartnership(partnerships, active_partner)

  const balances = await getBalances(active)
  if (!balances) return <p>Error loading balances</p>

  // Partner's name is the one that's not ours
  let partner = active.inviter_name
  let partner_balance = balances[active.inviter]
  let my_balance = balances[active.invitee]
  // We assumed partner was inviter,
  // if that was wrong, flip inviter and invitee
  if (partner === name) {
    partner = active.invitee_name
    partner_balance = balances[active.invitee]
    my_balance = balances[active.inviter]
  }

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-12 mb-2">
        <div className="w-[7.5rem]">
          {partner}: {partner_balance.toFixed(1)}
        </div>
        <div className="w-[7.5rem]">
          {name}: {my_balance.toFixed(1)}
        </div>
      </div>
    </div>
  )
}

async function getBalances({ inviter, invitee }: { inviter: string; invitee: string }) {
  // TODO: Download my most recent balance summary entry
  const summary = { [inviter]: 0, [invitee]: 0 }

  // Download all entries [TODO: newer then balance summary]
  const { data: newEntries, error } = await createSupabaseServer().from("points").select()
  if (!newEntries)
    return console.error(`Error loading new balance entries: ${JSON.stringify(error)}`)

  // Calc new balance
  const new_balance = { ...summary }
  newEntries.forEach((entry) => {
    if (entry.to === inviter) new_balance[inviter] += entry.amount / 10
    if (entry.to === invitee) new_balance[invitee] += entry.amount / 10
  })

  // TODO: If balance changed, store update

  return new_balance
}
