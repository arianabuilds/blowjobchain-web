import Link from "next/link"
import { IoMdSettings } from "react-icons/io"

export const SettingsButton = () => {
  return (
    <div className="hover:bg-white/10 rounded-full absolute right-5 top-[18px] cursor-pointer z-10 p-2 opacity-80 active:bg-white/15">
      <Link href="settings">
        <IoMdSettings size={22} />
      </Link>
    </div>
  )
}
