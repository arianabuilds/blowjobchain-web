"use client"

import { useUserId } from "./use-user-id"

export const InvitePartnerLink = () => {
  const { user_id } = useUserId()
  const link = `blowjobchain.com/partner?u=${user_id}`

  return (
    <div className="flex">
      <div className="text-[36px] pr-2">🔗</div>
      <div className="flex flex-col justify-center overflow-hidden">
        {user_id === undefined ? (
          <p className="text-sm italic opacity-50">Loading your custom invite link...</p>
        ) : (
          <>
            <p className="mb-1">Share invite link with partner:</p>
            <a
              href={`https://${link}`}
              target="_blank"
              className="block overflow-hidden text-xs text-blue-700 underline break-words text-ellipsis hover:text-blue-500 active:text-blue-600 whitespace-nowrap"
            >
              {link}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
