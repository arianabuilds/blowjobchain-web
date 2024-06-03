export const PasswordSettings = () => {
  return (
    <div className="bg-black/5 rounded-lg p-2 text-left px-5">
      <h2 className="font-medium">Set Password for Extra Security</h2>
      <p className="text-sm opacity-60">
        This password will be used as a private key to prevent anyone else from granting points.
      </p>
      <p className="text-sm text-black/60 mt-2">🔒 Required when granting or claiming points</p>
      <input
        className="w-56 p-2 py-2 rounded-lg mt-2 opacity-90"
        placeholder="correcthorsebatterystaple"
      />
      <button className="border ml-2 p-2 rounded-lg text-sm px-5 hover:bg-white/10">Save</button>
    </div>
  )
}
