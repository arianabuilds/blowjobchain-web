"use server"

import { PartnershipWithName } from "./load-partnerships"

export const Balance = async ({
  name,
  partnerships,
}: {
  name: string
  partnerships: PartnershipWithName
}) => {
  const first = partnerships[0]

  // Partner's name is the one that's not ours
  let partner = first.inviter_name
  if (partner === name) partner = first.invitee_name

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
