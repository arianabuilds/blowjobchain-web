import { HelloName } from "./HelloName"
import { InvitePartnerLink } from "./InvitePartnerLink"
import { NoRecordsYet } from "./NoRecordsYet"

export const PrePartner = ({ name }: { name: string }) => {
  return (
    <div className="text-center flex-1 mt-20 w-full px-4 max-w-[22rem] mx-auto">
      <HelloName name={name} />

      <NoRecordsYet />

      <InvitePartnerLink />
    </div>
  )
}
