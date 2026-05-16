import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName, loadPartnerships } from "./load-partnerships"
import { getActivePartnership, isNonEmptyArray } from "./getActivePartnership"
import { PrePartner } from "./PrePartner"
import { NoRecordsYet } from "./NoRecordsYet"
import { PointRow } from "./PointRow"

import { Tables } from "@/supabase/types"
import { PubKeyChangeLine } from "./PubKeyChangeLine"
import { WeeklyExpirationRow } from "./WeeklyExpirationRow"
import { weeklyExpireMergeKey } from "./weekly-expire-merge-key"
import { UpdatedExpireRateRow } from "./UpdatedExpireRateRow"

type Point = Tables<"points">
type PubKeyChange = Tables<"pub_keys">
type RateRow = Tables<"updated_expire_rate">

type ChainItem =
  | { kind: "pubkey-change"; item: PubKeyChange; created_at: string }
  | { kind: "point"; item: Point; created_at: string }
  | { kind: "weekly-expires"; mergeKey: string; points: Point[]; created_at: string }
  | { kind: "expire-rate-change"; item: RateRow; created_at: string }

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

  const [loadedPoints, loadedPubKeyChanges, loadedRatesChanges] = await Promise.all([
    loadPoints(a),
    loadPubKeyChanges(a),
    loadUpdatedExpireRates(a),
  ])
  const points = loadedPoints || []
  const pubKeysChanges = loadedPubKeyChanges || []
  const ratesChanges = loadedRatesChanges || []

  const combinedChain = mergeChainEvents(points, pubKeysChanges, ratesChanges)

  return (
    <>
      <div className="w-full px-1 overflow-y-scroll text-center flex-grow">
        {!combinedChain?.length ? (
          <NoRecordsYet />
        ) : (
          // List of points
          <div className="w-full px-4 max-w-[22rem] mx-auto">
            {combinedChain.map((row) => {
              if (row.kind === "weekly-expires")
                return (
                  <WeeklyExpirationRow key={row.mergeKey} points={row.points} idToName={idToName} />
                )
              if (row.kind === "expire-rate-change")
                return (
                  <UpdatedExpireRateRow
                    key={row.item.id}
                    row={row.item}
                    setByName={idToName[row.item.set_by]}
                  />
                )
              if (row.kind === "pubkey-change")
                return (
                  <PubKeyChangeLine
                    key={row.item.created_at + row.item.user_id}
                    pubKeyChange={row.item}
                    who={idToName[row.item.user_id]}
                  />
                )
              return (
                <PointRow
                  key={row.item.id}
                  point={row.item}
                  who={idToName[row.item.comment === "$$IS_CLAIM$$" ? row.item.from : row.item.to]}
                />
              )
            })}
          </div>
        )}
      </div>
    </>
  )
}

function mergeChainEvents(
  points: Point[],
  pubKeyChanges: PubKeyChange[],
  rateRows: RateRow[],
): ChainItem[] {
  const weeklyBuckets = new Map<string, Point[]>()
  const normalPoints: Point[] = []
  // Separate points from weekly expirations
  for (const p of points) {
    const mk = weeklyExpireMergeKey(p.comment)
    if (mk) {
      const arr = weeklyBuckets.get(mk) ?? []
      arr.push(p)
      weeklyBuckets.set(mk, arr)
    } else normalPoints.push(p)
  }

  // Build the full chain
  const chain: ChainItem[] = []
  for (const [mergeKey, pts] of weeklyBuckets) {
    // Merge weekly expirations into week pairs
    const created = pts.reduce(
      (best, p) => (p.created_at > best ? p.created_at : best),
      pts[0]!.created_at,
    )
    chain.push({ kind: "weekly-expires", mergeKey, points: pts, created_at: created })
  }
  for (const p of normalPoints) chain.push({ kind: "point", item: p, created_at: p.created_at })
  for (const pk of pubKeyChanges)
    chain.push({ kind: "pubkey-change", item: pk, created_at: pk.created_at })
  for (const r of rateRows)
    chain.push({ kind: "expire-rate-change", item: r, created_at: r.created_at })

  // Sort everything newest to oldest
  chain.sort((a, b) => +new Date(b.created_at) - +new Date(a.created_at))
  return chain
}

async function loadPoints(a: PartnershipsWithName[0]) {
  const { data: points, error } = await (await createSupabaseServer())
    .from("points")
    .select(`*, partial_resolutions(*)`)
    .order("created_at", { ascending: false })
    .in("from", [a.inviter, a.invitee])
    .in("to", [a.inviter, a.invitee])
  if (error) return alert(`Error loading points: ${JSON.stringify(error)}`)

  return points
}

async function loadPubKeyChanges(a: PartnershipsWithName[0]) {
  const { data: pubKeyChanges, error } = await (await createSupabaseServer())
    .from("pub_keys")
    .select()
    .order("created_at", { ascending: false })
    .in("user_id", [a.inviter, a.invitee])
  if (error) return alert(`Error loading pubKeyChanges: ${JSON.stringify(error)}`)

  return pubKeyChanges
}

async function loadUpdatedExpireRates(a: PartnershipsWithName[0]) {
  const user_a = a.inviter < a.invitee ? a.inviter : a.invitee
  const user_b = a.inviter < a.invitee ? a.invitee : a.inviter
  const { data, error } = await (await createSupabaseServer())
    .from("updated_expire_rate")
    .select("*")
    .eq("user_a", user_a)
    .eq("user_b", user_b)
    .order("created_at", { ascending: false })
  if (error) return console.error(`Error loading updated_expire_rate: ${JSON.stringify(error)}`)

  return data
}
