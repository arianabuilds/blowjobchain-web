import { createSupabaseClient } from "@/supabase/client"
import { useEffect, useState } from "react"

export const useUserId = () => {
  const [userId, setUserId] = useState<string>()
  const supabase = createSupabaseClient()

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setUserId(data.session.user.id)
    })
  }, [supabase.auth])

  return { userId }
}
