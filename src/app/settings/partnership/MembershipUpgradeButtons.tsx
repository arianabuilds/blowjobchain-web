"use client"

export const MembershipUpgradeButtons = () => {
  return (
    <div className="space-x-5 text-sm">
      {[["Yearly: $10"], ["Monthly: $1"]].map(([label]) => (
        <button
          key={label}
          onClick={() => alert("coming soon")}
          className="bg-white bg-opacity-40 hover:bg-opacity-50 active:bg-opacity-70 px-3 rounded-lg"
        >
          {label}
        </button>
      ))}
    </div>
  )
}
