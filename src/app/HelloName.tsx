"use client"

import { createSupabaseClient } from "@/supabase/client"

export const HelloName = ({ name }: { name: string }) => {
  return (
    <p className="text-xl">
      Hello{" "}
      <a
        className="underline decoration-dashed decoration-slate-500 cursor-pointer"
        style={{ textUnderlineOffset: 3 }}
        onClick={async () => {
          if (!confirm("Change your name?")) return

          const supabase = createSupabaseClient()
          const user_id = (await supabase.auth.getUser()).data.user?.id

          await supabase
            .from("profiles")
            .delete()
            .eq("user_id", user_id || "")
          window.location.reload()
        }}
      >
        {name}
      </a>
    </p>
  )
}
