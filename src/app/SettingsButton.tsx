import Link from "next/link"

export const SettingsButton = () => {
  return (
    <div className="absolute right-5 top-7">
      <Link href="settings" className="space-y-1">
        <div className="w-5 h-0.5 bg-black/60" />
        <div className="w-5 h-0.5 bg-black/60" />
        <div className="w-5 h-0.5 bg-black/60" />
      </Link>
    </div>
  )
}
