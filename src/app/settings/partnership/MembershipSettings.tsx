import { UpgradeMembershipButtons } from "./UpgradeMembershipButtons"

export const MembershipSettings = () => {
  return (
    <div className="text-center bg-black/5 rounded-lg space-y-1 p-2 my-2 mx-auto flex flex-col sm:px-10 px-5">
      <h4 className="text-sm opacity-70 mx-auto">Free Usage Remaining:</h4>
      <div className="space-x-5 min-w-[50%] mt-1">
        <span>You: 2 cards</span>
        <span>Partner: 2 cards</span>
      </div>

      {/* Upgrade Membership Box */}
      <div className="inline-block p-2 min-w-[70%] rounded-lg bg-white/15">
        <h4 className="text-sm font-semibold mb-1">Upgrade Couple Membership</h4>
        <UpgradeMembershipButtons />
      </div>
    </div>
  )
}
