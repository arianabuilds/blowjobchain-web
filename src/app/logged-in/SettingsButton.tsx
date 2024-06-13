import Link from "next/link"

export const SettingsButton = () => {
  return (
    <div className="hover:bg-white/10 rounded-full absolute right-5 top-[18px] cursor-pointer z-10 p-2 py-2.5 opacity-80 active:bg-white/15">
      <Link href="settings" className="space-y-1">
        <div className="w-5 h-0.5 bg-zinc-300/40" />
        <div className="w-5 h-0.5 bg-zinc-300/40" />
        <div className="w-5 h-0.5 bg-zinc-300/40" />
      </Link>
    </div>
  )
}
