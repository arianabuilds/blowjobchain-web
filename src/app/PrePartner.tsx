import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"
import { NoRecordsYet } from "./NoRecordsYet"

export const PrePartner = ({ name }: { name: string }) => {
  return (
    <div className="text-center">
      <HelloName name={name} />

      <NoRecordsYet />

      <InvitePartnerLink />
    </div>
  )
}
