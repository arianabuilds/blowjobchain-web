"use server"

import { PartnershipWithName } from "./load-partnerships"

export const Balance = async ({
  name,
  partnerships,
}: {
  name: string
  partnerships: PartnershipWithName
}) => {
  const first = partnerships[0]

  // Partner's name is the one that's not ours
  let partner = first.inviter_name
  if (partner === name) partner = first.invitee_name

  const { me, partner: partner_balance } = await getBalances()

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-12 mb-2">
        <div className="w-[7.5rem]">
          {partner}: {partner_balance.toFixed(1)}
        </div>
        <div className="w-[7.5rem]">
          {name}: {me.toFixed(1)}
        </div>
      </div>
    </div>
  )
}

async function getBalances() {
  // Download my most recent balance summary entry
  const summary = { me: 0, partner: 0 }

  // Download all entries newer then balance summary
  const newEntries = [
    { from: "me", to: "partner", amount: 4 },
    { from: "partner", to: "me", amount: 8 },
    { from: "partner", to: "me", amount: 4 },
  ]

  // Calc new balance
  const new_balance = { ...summary }
  newEntries.forEach((entry) => {
    if (entry.to === "me") new_balance.me += entry.amount / 10
    if (entry.to === "partner") new_balance.partner += entry.amount / 10
  })

  // TODO: If balance changed, store update

  return new_balance
}
