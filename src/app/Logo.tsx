export const Logo = ({ big }: { big?: boolean }) => (
  <p
    className={`
    font-medium tracking-tight bg-gradient-to-r from-pink-200 via-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_2px_8px_rgba(236,72,153,0.3)]
    ${big ? "text-4xl pt-20" : "text-2xl pt-5"}
  `}
  >
    BlowjobChain
  </p>
)
