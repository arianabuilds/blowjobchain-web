import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName, loadPartnerships } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { PrePartner } from "./PrePartner"
import { NoRecordsYet } from "./NoRecordsYet"
import { PointRow } from "./PointRow"
import Image from "next/image"
import orgasm from "./orgasm.png"
import { Tables } from "@/supabase/types"
import { PubKeyChangeLine } from "./PubKeyChangeLine"

type Point = Tables<"points">
type PubKeyChange = Tables<"pub_keys">
const isPoint = (item: Point | PubKeyChange): item is Point => item.hasOwnProperty("from")

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

  const points = (await loadPoints(a)) || []
  const pubKeyChanges = (await loadPubKeyChanges(a)) || []

  const combinedChain = [...pubKeyChanges, ...points].sort(
    (a, b) => +new Date(b.created_at) - +new Date(a.created_at),
  )

  return (
    <div className="flex-1">
      <Image className="max-w-[22rem] mx-auto px-2" src={orgasm} alt="Orgasm image" />
      <div className="w-full px-1 overflow-y-scroll text-center">
        {!combinedChain?.length ? (
          <NoRecordsYet />
        ) : (
          // List of points
          <div className="w-full px-4 max-w-[22rem] mx-auto">
            {combinedChain.map((item) =>
              isPoint(item) ? (
                <PointRow
                  key={item.id}
                  point={item}
                  who={idToName[item.amount < 0 ? item.from : item.to]}
                />
              ) : (
                <PubKeyChangeLine
                  key={item.created_at + item.user_id}
                  pubKeyChange={item}
                  who={idToName[item.user_id]}
                />
              ),
            )}
          </div>
        )}
      </div>
    </div>
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

async function loadPubKeyChanges(a: PartnershipsWithName[0]) {
  const { data: pubKeyChanges, error } = await createSupabaseServer()
    .from("pub_keys")
    .select()
    .order("created_at", { ascending: false })
    .in("user_id", [a.inviter, a.invitee])
  if (error) return alert(`Error loading pubKeyChanges: ${JSON.stringify(error)}`)

  return pubKeyChanges
}
