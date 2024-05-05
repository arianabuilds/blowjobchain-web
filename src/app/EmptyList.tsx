import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"

export const EmptyList = ({ name }: { name: string }) => {
  return (
    <div className="text-center">
      <HelloName name={name} />

      {/* No records */}
      <p className="border rounded-lg border-black/50 p-2 my-16 text-black/80">No records yet</p>

      {/* Share invite link */}
      <InvitePartnerLink />
    </div>
  )
}
