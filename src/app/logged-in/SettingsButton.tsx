import Link from "next/link"
import { IoSettingsOutline } from "react-icons/io5"

export const SettingsButton = () => {
  return (
    <div className="hover:bg-white/10 rounded-full absolute right-[18px] top-[17px] cursor-pointer z-10 p-2 opacity-80 active:bg-white/15">
      <Link href="settings">
        <IoSettingsOutline size={22} />
      </Link>
    </div>
  )
}
