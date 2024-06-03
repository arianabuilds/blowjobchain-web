import { get_user_id } from "./get-user-id"

export const InvitePartnerLink = async () => {
  const { user_id } = await get_user_id()
  const link = `blowjobchain.com/partner?u=${user_id}`

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
