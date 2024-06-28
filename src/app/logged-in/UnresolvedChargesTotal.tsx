import { printDecimals } from "./Balance"

export const UnresolvedChargesTotal = ({
  partner_name,
  partner_charges,
  my_name,
  my_charges,
}: {
  partner_name: string | null
  partner_charges: number
  my_name: string
  my_charges: number
}) => {
  return (
    <div className="py-1 mb-3 text-sm border-2 border-red-700 rounded-lg">
      Unresolved Charges
      <div className="mb-1 text-xs opacity-50">Don{"'"}t let toxicity fester!</div>
      <div className="flex justify-center py-2 rounded-full space-x-7 text-zinc-300/70 bg-black/20">
        {[
          { who: partner_name, total: partner_charges },
          { who: my_name, total: my_charges },
        ].map(({ who, total }, index) => (
          <div className={`w-[9.1rem] ${!total ? "opacity-30" : ""}`} key={index}>
            {who}: {printDecimals(total)}
          </div>
        ))}
      </div>
    </div>
  )
}
