"use client"

export const Logo = ({ big }: { big?: boolean }) => (
  <p
    onClick={() => window.location.reload()}
    className={`
      font-bold tracking-tight
      bg-gradient-to-b from-white via-white/90 to-white/20
      bg-clip-text text-transparent
      [text-shadow:_2px_2px_8px_rgba(255,255,255,0.15)]
      ${big ? "text-4xl mt-20" : "text-2xl mt-5"}
    `}
  >
    BlowjobChain
  </p>
)
