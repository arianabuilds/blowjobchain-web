import Link from "next/link"

export const BackButton = () => {
  return (
    <Link
      href="/"
      className="hover:bg-black/10 rounded-full absolute left-3 top-4 opacity-70 cursor-pointer z-10 p-2"
    >
      <svg
        height="20px"
        width="20px"
        version="1.1"
        viewBox="0 0 309.143 309.143"
        className="right-px relative"
      >
        <path
          style={{ fill: "#231F20" }}
          d="M112.855,154.571L240.481,26.946c2.929-2.929,2.929-7.678,0-10.606L226.339,2.197
	C224.933,0.79,223.025,0,221.036,0c-1.989,0-3.897,0.79-5.303,2.197L68.661,149.268c-2.929,2.929-2.929,7.678,0,10.606
	l147.071,147.071c1.406,1.407,3.314,2.197,5.303,2.197c1.989,0,3.897-0.79,5.303-2.197l14.142-14.143
	c2.929-2.929,2.929-7.678,0-10.606L112.855,154.571z"
        />
      </svg>
    </Link>
  )
}
