"use client"

import { useUserId } from "./use-user-id"

export const InvitePartnerLink = () => {
  const { user_id } = useUserId()
  const link = `blowjobchain.com/partner?u=${user_id}`

  return (
    <div className="flex">
      <div className="text-[36px] pr-2">🔗</div>
      <div className="overflow-hidden flex flex-col justify-center">
        {user_id === undefined ? (
          <p className="text-sm opacity-50 italic">Loading your custom invite link...</p>
        ) : (
          <>
            <p className="mb-1">Share invite link with partner:</p>
            <a
              href={`https://${link}`}
              target="_blank"
              className="block text-ellipsis text-blue-700 hover:text-blue-500 active:text-blue-600 text-xs underline overflow-hidden break-words whitespace-nowrap"
            >
              {link}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
