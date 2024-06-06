import { revalidatePath } from "next/cache"
import { get_user_id_server } from "@/app/get-user-id-server"
import { BackSVG } from "../BackButton"
import { PartnershipsWithName } from "@/app/logged-in/load-partnerships"

export const SetCurrentButton = ({ p }: { p: PartnershipsWithName[0] }) => {
  return (
    <form>
      <button
        type="submit"
        className="px-2 text-sm text-black border rounded text-opacity-30 border-black/20 hover:bg-white/20 hover:text-opacity-70 hover:border-purple-600 active:bg-white/40 group"
        formAction={async () => {
          "use server"

          // Get user.id
          const { user_id, supabase } = await get_user_id_server()
          if (!user_id) return console.error("Error: not logged in")

          // Save new active_partner id to db
          const { error } = await supabase
            .from("profiles")
            .update({ active_partner: p.inviter !== user_id ? p.inviter : p.invitee })
            .eq("user_id", user_id)
          if (error) return console.error("Error setting active_partner:", error)

          revalidatePath("/settings")
        }}
      >
        Set Current{" "}
        <BackSVG
          className="relative inline opacity-50 -scale-x-100 group-hover:opacity-90 bottom-px"
          size={10}
        />
      </button>
    </form>
  )
}
