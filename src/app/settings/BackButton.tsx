import Link from "next/link"

export const BackButton = () => {
  return (
    <Link
      href="/"
      className="absolute z-10 p-2 rounded-full cursor-pointer hover:bg-white/15 left-2 top-4 opacity-70 active:bg-white/20"
    >
      <BackSVG className="relative right-px" />
    </Link>
  )
}

export const BackSVG = ({ className, size = 20 }: { className: string; size?: number }) => {
  return (
    <svg
      height={`${size}px`}
      width={`${size}px`}
      version="1.1"
      viewBox="0 0 309.143 309.143"
      className={className}
    >
      <path
        style={{ fill: "#c9b9bd" }}
        d="M112.855,154.571L240.481,26.946c2.929-2.929,2.929-7.678,0-10.606L226.339,2.197
C224.933,0.79,223.025,0,221.036,0c-1.989,0-3.897,0.79-5.303,2.197L68.661,149.268c-2.929,2.929-2.929,7.678,0,10.606
l147.071,147.071c1.406,1.407,3.314,2.197,5.303,2.197c1.989,0,3.897-0.79,5.303-2.197l14.142-14.143
c2.929-2.929,2.929-7.678,0-10.606L112.855,154.571z"
      />
    </svg>
  )
}
