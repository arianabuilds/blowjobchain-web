import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName, loadPartnerships } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./settings/getActivePartnership"
import { PrePartner } from "./PrePartner"
import { NoRecordsYet } from "./NoRecordsYet"
import { PointRow } from "./PointRow"

export const MainScreen = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: null | string
}) => {
  const { partnerships } = await loadPartnerships()

  if (partnerships === null) return <p>Error loading partnerships.</p>
  if (!isNonEmptyArray(partnerships)) return <PrePartner name={name} />

  const a = getActivePartnership(partnerships, active_partner)
  const idToName = { [a.inviter]: a.inviter_name, [a.invitee]: a.invitee_name }

  const points = await loadPoints(a)

  return (
    <div className="text-center">
      {!points?.length ? (
        <NoRecordsYet />
      ) : (
        // List of points
        <div className="mt-6 text-left overflow-y-scroll max-h-[65vh]">
          {points.map((point) => (
            <PointRow
              key={point.id}
              point={point}
              who={idToName[point.amount < 0 ? point.from : point.to]}
            />
          ))}
        </div>
      )}
    </div>
  )
}

async function loadPoints(a: PartnershipsWithName[0]) {
  const supabase = createSupabaseServer()
  const { data: points, error } = await supabase
    .from("points")
    .select()
    .order("created_at", { ascending: false })
    .in("from", [a.inviter, a.invitee])
    .in("to", [a.inviter, a.invitee])
  if (error) return alert(`Error loading points: ${JSON.stringify(error)}`)

  return points
}
