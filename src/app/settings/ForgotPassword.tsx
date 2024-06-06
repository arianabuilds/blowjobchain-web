"use client"

export const ForgotPassword = () => {
  return (
    <>
      <button
        className="bg-purple-500/20 rounded-lg w-full text-sm py-1.5 my-1.5 text-black/50"
        onClick={() => {
          confirm(
            `Are you sure you want to remove your password & public key from your account?
            
This will be shown in the chain.`,
          )
        }}
      >
        Forgot Password?
      </button>
    </>
  )
}
