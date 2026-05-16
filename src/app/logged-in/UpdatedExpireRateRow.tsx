import { Tables } from "@/supabase/types"

export const UpdatedExpireRateRow = ({
  row,
  setByName,
}: {
  row: Tables<"updated_expire_rate">
  setByName: string | null | undefined
}) => {
  const pct = (n: number) => `${Math.round(n * 100)}%`
  return (
    <div className="mb-2 opacity-30 text-sm italic">
      {setByName ?? "Partner"} set weekly expire rate: {pct(row.previous_r)} → {pct(row.next_r)}
    </div>
  )
}
