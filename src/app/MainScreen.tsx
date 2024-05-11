import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"
import { loadPartnerships } from "./load-partnerships"

export const MainScreen = async ({ name }: { name: string }) => {
  const { partnerships } = await loadPartnerships()
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
