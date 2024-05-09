"use server"

import { lookupPartnerships } from "./EmptyList"

export const Balance = async () => {
  const { partnerships } = await lookupPartnerships()

  return (
    <div className="text-center">
      <div className="flex justify-center space-x-12">
        <div className="w-[7.5rem]">Other: 0</div>
        <div className="w-[7.5rem]">Me: 0</div>
      </div>
      {/* {JSON.stringify(partnerships)} */}
    </div>
  )
}
