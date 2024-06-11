"use client"

export const MembershipUpgradeButtons = () => {
  return (
    <div className="space-x-5 text-sm">
      {[["Yearly: $10"], ["Monthly: $1"]].map(([label]) => (
        <button
          key={label}
          onClick={() => alert("coming soon")}
          className="px-3 bg-white rounded bg-opacity-20 hover:bg-opacity-30 active:bg-opacity-40"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
