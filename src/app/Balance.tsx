"use server"

import { createSupabaseServer } from "@/supabase/server"
import { PartnershipWithName } from "./load-partnerships"

export const Balance = async ({
  name,
  partnerships,
}: {
  name: string
  partnerships: PartnershipWithName
}) => {
  const firstPartnership = partnerships[0]

  const balances = await getBalances(firstPartnership)
  if (!balances) return <p>Error loading balances</p>

  // Partner's name is the one that's not ours
  let partner = firstPartnership.inviter_name
  let partner_balance = balances[firstPartnership.inviter]
  let my_balance = balances[firstPartnership.invitee]
  // We assumed partner was inviter,
  // if that was wrong, flip inviter and invitee
  if (partner === name) {
    partner = firstPartnership.invitee_name
    partner_balance = balances[firstPartnership.invitee]
    my_balance = balances[firstPartnership.inviter]
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
