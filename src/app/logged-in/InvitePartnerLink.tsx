"use client"

import { useUserId } from "../use-user-id"
import LinkIcon from "./link-icon.svg"
import Image from "next/image"

export const InvitePartnerLink = () => {
  const { user_id } = useUserId()
  const link = `blowjobchain.com/partner?u=${user_id}`

  return (
    <div className="flex">
      <Image src={LinkIcon} alt="Link Icon" className="text-[36px] pr-2" />
      <div className="flex flex-col justify-center overflow-hidden">
        {user_id === undefined ? (
          <p className="text-sm italic opacity-50">Loading your custom invite link...</p>
        ) : (
          <>
            <p className="my-2 opacity-60">Share invite link with partner:</p>
            <a
              href={`https://${link}`}
              target="_blank"
              className="block overflow-hidden text-xs text-blue-500 underline break-words text-ellipsis hover:text-blue-300 active:text-blue-600 whitespace-nowrap"
            >
              {link}
            </a>
          </>
        )}
      </div>
    </div>
  )
}
