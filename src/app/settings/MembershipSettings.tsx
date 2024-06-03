import { UpgradeMembershipButtons } from "./UpgradeMembershipButtons"

export const MembershipSettings = () => {
  return (
    <div className="text-center space-y-1">
      <h4>Free Usage Remaining:</h4>
      <div className="space-x-5 border border-white/30 rounded-lg inline-block p-2 min-w-[50%] mt-1">
        <span>Partner: 3 cards</span>
        <span>You: 3 cards</span>
      </div>

      {/* Upgrade Membership Box */}
      <div className="border inline-block p-2 min-w-[70%] rounded-lg border-white/30">
        <h4 className="text-sm font-semibold mb-1">Upgrade Couple Membership</h4>
        <UpgradeMembershipButtons />
      </div>
    </div>
  )
}
