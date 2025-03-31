import { loadUserProfile } from "@/app/HomePage"
import { HelloNameClient } from "./HelloNameClient"
import { redirect } from "next/navigation"

export const HelloName = async () => {
  const { name } = await loadUserProfile()
  if (!name) redirect("/")

  return <HelloNameClient name={name} />
}
