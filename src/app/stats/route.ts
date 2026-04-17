import { createSupabaseAdmin } from "@/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  const { count, error } = await createSupabaseAdmin()
    .from("partnerships")
    .select("*", { count: "exact", head: true })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({
    partnerships: count ?? 0,
    last_updated: new Date().toLocaleString(),
  })
}
