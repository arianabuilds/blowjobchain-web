import { createSupabaseClient } from "@/supabase/client"
import { useEffect, useState } from "react"

const supabase = createSupabaseClient()

/** Quickly reads current `user_id` from cookie. `undefined` = loading. Could be forged. */
export const useUserId = () => {
  const [user_id, setUserId] = useState<undefined | null | string>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUserId(data?.session?.user.id || null)
    })
  }, [])

  return { user_id, supabase }
}
