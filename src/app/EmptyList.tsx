import { createSupabaseServer } from "@/supabase/server"
import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"

export const EmptyList = async ({ name }: { name: string }) => {
  const { partnerships } = await lookupPartnerships()
  const hasPartner = !!partnerships?.length

  return (
    <div className="text-center">
      <HelloName name={name} />

      {/* No records */}
      <p className="border rounded-lg border-black/50 p-2 px-10 my-16 text-black/80">
        No records yet
      </p>

      {/* Share invite link */}
      {!hasPartner && <InvitePartnerLink />}
    </div>
  )
}

async function lookupPartnerships() {
  const supabase = createSupabaseServer()
  const { data: partnerships, error } = await supabase.from("partnerships").select()
  return { partnerships }
}
