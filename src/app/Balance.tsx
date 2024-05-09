"use server"

import { lookupPartnerships } from "./EmptyList"
import { loadInvitersName } from "./partner/InvitePartnerPage"

export const Balance = async ({ name }: { name: string }) => {
  const { partnerships } = await lookupPartnerships()
  if (!partnerships?.[0]) return null

  // FIXME: wrongly assumes invitee is partner
  const partner = await loadInvitersName(partnerships[0].invitee)

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-12 mb-2">
        <div className="w-[7.5rem]">{partner}: 0</div>
        <div className="w-[7.5rem]">{name}: 0</div>
      </div>
      {/* {JSON.stringify(partnerships)} */}
    </div>
  )
}
