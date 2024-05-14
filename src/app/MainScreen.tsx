import { createSupabaseServer } from "@/supabase/server"
import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"
import { loadPartnerships } from "./load-partnerships"
import { format } from "@expo/timeago.js"

export const MainScreen = async ({
  name,
  active_partner,
}: {
  name: string
  active_partner?: null | string
}) => {
  const { partnerships } = await loadPartnerships()
  const hasPartner = !!partnerships?.length

  const userIdToName = (partnerships || []).reduce(
    (memo, p) => ({ ...memo, [p.inviter]: p.inviter_name?.[0], [p.invitee]: p.invitee_name?.[0] }),
    {} as Record<string, string | undefined>,
  )

  const points = await loadPoints()

  return (
    <div className="text-center">
      <HelloName name={name} />

      {!points?.length ? (
        // No records
        <p className="border rounded-lg border-black/50 p-2 px-10 my-16 text-black/80">
          No records yet
        </p>
      ) : (
        // List of points
        <div className="mt-6 text-left">
          {points.map((r, index) => (
            <div
              key={index}
              className="border rounded-lg border-black/50 p-2 px-3 my-2 text-black/80"
            >
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
              <span className="mr-1">{userIdToName[r.to]}</span> +{r.amount} point
              {r.amount !== 1 ? "s" : ""}
              <span className="inline-block w-[5rem] text-right">{r.comment ? "💬" : ""}</span>
            </div>
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
  const { data: points, error } = await supabase
    .from("points")
    .select()
    .order("created_at", { ascending: false })
  if (error) return alert(`Error loading points: ${JSON.stringify(error)}`)

  return points
}
