import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName, loadPartnerships } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { PrePartner } from "./PrePartner"
import { NoRecordsYet } from "./NoRecordsYet"
import { PointRow } from "./PointRow"
import Image from "next/image"
import orgasm from "./orgasm.png"

export const MainList = async ({
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
    <>
      <Image className="max-w-[22rem] mx-auto px-2" src={orgasm} alt="Orgasm image" />
      <div className="w-full px-1 overflow-y-scroll text-center">
        {!points?.length ? (
          <NoRecordsYet />
        ) : (
          // List of points
          <div className="w-full px-4 max-w-[22rem] mx-auto">
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
    </>
  )
}

async function loadPoints(a: PartnershipsWithName[0]) {
  const { data: points, error } = await createSupabaseServer()
    .from("points")
    .select()
    .order("created_at", { ascending: false })
    .in("from", [a.inviter, a.invitee])
    .in("to", [a.inviter, a.invitee])
  if (error) return alert(`Error loading points: ${JSON.stringify(error)}`)

  return points
}
