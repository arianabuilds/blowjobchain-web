import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName } from "./load-partnerships"
import { NonEmptyArray, getActivePartnership } from "./getActivePartnership"
import { UnresolvedChargesTotal } from "./UnresolvedChargesTotal"
import { printDecimals } from "./print-decimals"

export const Balance = async ({
  name: my_name,
  partnerships,
  active_partner,
}: {
  name: string
  partnerships: NonEmptyArray<PartnershipsWithName[0]>
  active_partner?: null | string
}) => {
  const active = getActivePartnership(partnerships, active_partner)

  const results = await getBalances(active)
  if (!results) return <p>Error loading balances</p>
  const { balances, unresolved_charges } = results

  // Partner's name is the one that's not ours
  let partner_name = active.inviter_name
  let partner = active.inviter
  let me = active.invitee
  // We assumed partner was inviter,
  // if that was wrong, flip inviter and invitee
  if (partner_name === my_name) {
    partner_name = active.invitee_name
    partner = active.invitee
    me = active.inviter
  }

  return (
    <div className="text-center">
      <div className="flex justify-center py-3 mb-5 rounded-full space-x-7 text-zinc-300/70 bg-black/20 hide-on-charges-filter">
        <div className="w-[9.1rem]">
          {partner_name}: {printDecimals(balances[partner])}
        </div>
        <div className="w-[9.1rem]">
          {my_name}: {printDecimals(balances[me])}
        </div>
      </div>

      <UnresolvedChargesTotal
        {...{
          partner_name,
          my_name,
          partner_charges: unresolved_charges[partner],
          my_charges: unresolved_charges[me],
        }}
      />
    </div>
  )
}

async function getBalances({ inviter, invitee }: { inviter: string; invitee: string }) {
  // TODO: Download my most recent balance summary entry
  const cached_balances = { [inviter]: 0, [invitee]: 0 }
  const cached_charges = { ...cached_balances }

  // Download all entries [TODO: newer then balance summary]
  const { data: newPoints, error } = await (await createSupabaseServer())
    .from("points")
    .select()
    .in("from", [inviter, invitee])
    .in("to", [inviter, invitee])
  if (!newPoints) return console.error(`Error loading new balance Points: ${JSON.stringify(error)}`)

  // Calc new balance
  const balances = { ...cached_balances }
  const unresolved_charges = { ...cached_charges }
  newPoints.forEach((point) => {
    // If it's a positive grant, add to's balance
    if (point.amount > 0) return (balances[point.to] += point.amount / 10)

    // If it's a $$IS_CLAIM$$, subtract from's balance 1 card
    if (point.comment === "$$IS_CLAIM$$") return (balances[point.from] -= 1)

    // If it's a negative charge and unresolved, add to's Charges balance
    if (point.amount < 0 && !point.resolved_at)
      return (unresolved_charges[point.to] += point.amount / 10)
  })

  // TODO: If balance changed, store update

  return { balances, unresolved_charges }
}
