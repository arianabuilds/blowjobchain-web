import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName } from "./load-partnerships"
import { NonEmptyArray, getActivePartnership } from "./getActivePartnership"

export const Balance = async ({
  name,
  partnerships,
  active_partner,
}: {
  name: string
  partnerships: NonEmptyArray<PartnershipsWithName[0]>
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
      <div className="flex justify-center mb-2 space-x-10">
        <div className="w-[9.1rem]">
          {partner}: {printDecimals(partner_balance)}
        </div>
        <div className="w-[9.1rem]">
          {name}: {printDecimals(my_balance)}
        </div>
      </div>
    </div>
  )
}

async function getBalances({ inviter, invitee }: { inviter: string; invitee: string }) {
  // TODO: Download my most recent balance summary entry
  const summary = { [inviter]: 0, [invitee]: 0 }

  // Download all entries [TODO: newer then balance summary]
  const { data: newPoints, error } = await createSupabaseServer()
    .from("points")
    .select()
    .in("from", [inviter, invitee])
    .in("to", [inviter, invitee])
  if (!newPoints) return console.error(`Error loading new balance Points: ${JSON.stringify(error)}`)

  // Calc new balance
  const new_balance = { ...summary }
  newPoints.forEach((point) => {
    new_balance[point.amount < 0 ? point.from : point.to] += point.amount / 10
  })

  // TODO: If balance changed, store update

  return new_balance
}

/** Show up to 2 decimal places, but don't show trailing zeros in the decimal places */
function printDecimals(number: number): string {
  return parseFloat(number.toFixed(4)).toString()
}
