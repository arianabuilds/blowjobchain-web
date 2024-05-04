const buttonClasses = `px-10 py-2 border-2 rounded-md text-gray-800 transition font-medium`

export const GrantAndClaimBtns = () => {
  return (
    <div>
      <p className="mb-3 text-center italic opacity-40 text-lg">10 points = 1 blowjob card</p>
      <div className="flex justify-center space-x-10">
        <button className={`${buttonClasses} border-blue-400/70 bg-blue-300`}>Grant</button>
        <button className={`${buttonClasses} border-purple-400/80 bg-purple-300/80`}>Claim</button>
      </div>
    </div>
  )
}
