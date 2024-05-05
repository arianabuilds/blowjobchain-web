"use client"

import { useUserId } from "./useUserId"

export const InvitePartnerLink = () => {
  const { userId } = useUserId()
  const link = `blowjobchain-web.vercel.app/partner/${userId}`

  return (
    <div className="flex">
      <div className="text-[36px] pr-2">🔗</div>
      <div>
        <p className="mb-1">Share invite link with partner:</p>
        <a
          href={`https://${link}`}
          target="_blank"
          className="block rounded text-xs bg-white/70 p-1 overflow-clip"
        >
          {link}
        </a>
      </div>
    </div>
  )
}
