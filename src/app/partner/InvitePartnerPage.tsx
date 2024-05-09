import { Suspense } from "react"
import { Login } from "../Login"
import { Logo } from "../Logo"
import { createSupabaseAdmin } from "@/supabase/admin"

export type SearchParamsProp = { searchParams: { [key: string]: string | string[] | undefined } }

export async function InvitePartnerPage({ searchParams }: SearchParamsProp) {
  const { u } = searchParams
  if (typeof u !== "string") return <p className="p-4">Error! Missing inviter{"'"}s user ID</p>

  const inviter = await loadInvitersName(u)

  return (
    <div className="text-center">
      <Logo />
      <p className="mt-7">
        <b className="font-semibold">{inviter}</b> invites you to be their partner 💕
      </p>

      <div className="opacity-60 mt-8 space-y-3 mb-12">
        <p>A surprisingly fun way to reward each other.</p>
        <p>
          <i>Earn 10 points to claim 1 blowjob card</i>
        </p>
      </div>

      <Suspense>
        <Login inviterID={u} />
      </Suspense>
    </div>
  )
}

async function loadInvitersName(user_id: string): Promise<string> {
  const supabase = createSupabaseAdmin()
  const { data } = await supabase.from("profiles").select().eq("user_id", user_id)
  if (!data?.[0]) return "[Error: User not found]"

  return data[0].name
}
