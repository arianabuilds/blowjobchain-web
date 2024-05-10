"use client"

import { PartnershipWithName } from "./load-partnerships"

const buttonClasses = `px-10 py-2 border-2 rounded-md text-gray-800 transition font-medium`

export const GrantAndClaimBtns = ({
  partnerships,
}: {
  partnerships: PartnershipWithName | null
}) => {
  const partner = partnerships?.[0]

  return (
    <div className="flex justify-center space-x-10">
      <button
        className={`${buttonClasses} border-blue-400/70 bg-blue-300`}
        onClick={() =>
          !partner ? alert("Add a partner to grant them blowjob points") : grantPoints()
        }
      >
        Grant
      </button>
      <button
        className={`${buttonClasses} border-purple-400/80 bg-purple-300/80`}
        onClick={() => alert("Earn 10 points from your partner to claim 1 blowjob card")}
      >
        Claim
      </button>
    </div>
  )
}

function grantPoints() {
  const points = prompt("Grant how many points?")
  if (!points) return

  const comment = prompt("Add optional comment:")
  alert(`${points}: ${comment}`)
}
