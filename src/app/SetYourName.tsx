"use client"

import { createSupabaseClient } from "@/supabase/client"

export const SetYourName = () => {
  return (
    <form action={SetYourNameAction} className="flex flex-col justify-between">
      <div className="text-center">
        <h3 className="text-xl">Set your name:</h3>
        <input
          type="text"
          name="name"
          className="rounded-xl p-3 py-4 text-[21px] max-w-[250px] my-3 text-center"
          placeholder="Name"
        />
        <div className="text=sm opacity-60 mb-10">
          <p>For your partner to recognize you.</p>
          <p>Can change anytime</p>
        </div>
      </div>
      <button
        className="border border-blue-800/60 text-blue-900 rounded px-2 py-3 hover:bg-blue-700/20"
        type="submit"
      >
        Next →
      </button>
    </form>
  )
}

async function SetYourNameAction(formData: FormData) {
  const name = formData.get("name")
  if (typeof name !== "string") return console.error("SetName error", name)

  const supabase = createSupabaseClient()
  const user_id = (await supabase.auth.getUser()).data.user?.id
  if (typeof user_id !== "string") return console.error("SetName: not logged in", user_id)

  await supabase.from("profiles").insert({ name, user_id })

  window.location.reload()
}
