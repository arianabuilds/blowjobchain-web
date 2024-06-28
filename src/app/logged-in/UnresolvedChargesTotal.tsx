import { printDecimals } from "./Balance"

export const UnresolvedChargesTotal = ({
  partner,
  partner_charges,
  name,
  my_charges,
}: {
  partner: string | null
  partner_charges: number
  name: string
  my_charges: number
}) => {
  return (
    <div className="py-1 mb-3 text-sm border-2 border-red-700 rounded-lg">
      Unresolved Charges
      <div className="mb-1 text-xs opacity-50">Don{"'"}t let toxicity fester!</div>
      <div className="flex justify-center py-2 rounded-full space-x-7 text-zinc-300/70 bg-black/20">
        <div className="w-[9.1rem]">
          {partner}: {printDecimals(partner_charges)}
        </div>
        <div className="w-[9.1rem]">
          {name}: {printDecimals(my_charges)}
        </div>
      </div>
    </div>
  )
}
