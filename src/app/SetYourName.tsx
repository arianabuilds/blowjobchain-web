export const SetYourName = () => {
  return (
    <div className="flex flex-col justify-between">
      <div className="text-center">
        <h3 className="text-xl">Set your name:</h3>
        <input
          type="text"
          className="rounded-xl p-3 py-4 text-[21px] max-w-[250px] my-3 text-center"
          placeholder="Name"
        />
        <div className="text=sm opacity-60 mb-10">
          <p>For your partner to recognize you.</p>
          <p>Can change anytime</p>
        </div>
      </div>
      <button className="border border-blue-800/60 text-blue-900 rounded px-2 py-3 hover:bg-blue-700/20">
        Next →
      </button>
    </div>
  )
}
