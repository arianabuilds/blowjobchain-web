import { createSupabaseAdmin } from "@/supabase/admin"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await createSupabaseAdmin().rpc("get_public_stats")

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const row = data?.[0]

  return NextResponse.json({
    partnerships: Number(row?.partnerships_count),
    total_points_granted: Number(row?.total_points_granted),
    last_updated: new Date().toLocaleString(),
  })
}
