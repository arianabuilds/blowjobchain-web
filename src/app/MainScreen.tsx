import { createSupabaseServer } from "@/supabase/server"
import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"
import { loadPartnerships } from "./load-partnerships"
import { format } from "@expo/timeago.js"

export const MainScreen = async ({ name }: { name: string }) => {
  const { partnerships } = await loadPartnerships()
  const hasPartner = !!partnerships?.length

  const records = await loadPoints()

  return (
    <div className="text-center">
      <HelloName name={name} />

      {!records?.length ? (
        // No records
        <p className="border rounded-lg border-black/50 p-2 px-10 my-16 text-black/80">
          No records yet
        </p>
      ) : (
        // List of points
        <div className="mt-6 text-left">
          {records.map((r, index) => (
            <p
              key={index}
              className="border rounded-lg border-black/50 p-2 px-3 my-2 text-black/80"
            >
              <span className="mr-4">
                {format(r.created_at).replace(" hours", "h").replace(" minutes", "m")}
              </span>{" "}
              {r.to} +{r.amount} point
              {r.amount !== 1 ? "s" : ""}
            </p>
          ))}
        </div>
      )}

      {/* Share invite link */}
      {!hasPartner && <InvitePartnerLink />}
    </div>
  )
}

async function loadPoints() {
  const supabase = createSupabaseServer()
  const { data: points, error } = await supabase.from("points").select()
  if (error) return alert(`Error loading points: ${JSON.stringify(error)}`)

  return points
}
