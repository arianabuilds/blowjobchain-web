import { HelloName } from "./HelloName"

const link = `blowjobchain.com/partner/CE23B`

export const EmptyList = ({ name }: { name: string }) => {
  return (
    <div className="text-center">
      <HelloName name={name} />

      <p className="border rounded-lg border-black/50 p-2 my-16 text-black/80">No records yet</p>

      <div className="flex">
        <div className="text-[36px] pr-2">🔗</div>
        <div>
          <p className="mb-1">Share invite link with partner:</p>
          <a href={link} target="_blank" className="block rounded text-xs bg-white/70 p-1">
            {link}
          </a>
        </div>
      </div>
    </div>
  )
}
