"use client"

export const UpgradeMembershipButtons = () => {
  const onClick = () => alert("coming soon")

  return (
    <div className="space-x-5">
      <button onClick={onClick} className="bg-white/40 px-3 rounded-lg">
        Yearly: $10
      </button>
      <button onClick={onClick} className="bg-white/30 px-3 rounded-lg">
        Monthly: $1
      </button>
    </div>
  )
}
