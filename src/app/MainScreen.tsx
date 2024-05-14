import { createSupabaseServer } from "@/supabase/server"
import { PartnershipsWithName, loadPartnerships } from "./load-partnerships"
import { format } from "@expo/timeago.js"
import { getActivePartnership, isNonEmptyArray } from "./settings/PartnershipSettings"
import { PrePartner } from "./PrePartner"
import { NoRecordsYet } from "./NoRecordsYet"

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
        <div className="mt-6 text-left">
          {points.map((r, index) => (
            // Single row
            <div
              key={index}
              className="border rounded-lg border-black/50 p-2 px-3 my-2 text-black/80"
            >
              {/* Timestamp */}
              <span className="inline-block w-[5rem] opacity-70 text-sm">
                {format(r.created_at)
                  .replace("ago", "")
                  .replace("just ", "")
                  .replace(/\d\d seconds/, "now")
                  .replace(" minute", "m")
                  .replace(" hour", "h")
                  .replace(" day", "d")
                  .replace("s ", " ")}
              </span>{" "}
              {/* From */}
              <span className="mr-1">{idToName[r.to]?.[0]}</span>
              {/* Amount */}
              <>
                +{r.amount} point
                {r.amount !== 1 ? "s" : ""}
              </>
              {/* Comment icon */}
              <span className="inline-block w-[5rem] text-right">{r.comment ? "💬" : ""}</span>
            </div>
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
