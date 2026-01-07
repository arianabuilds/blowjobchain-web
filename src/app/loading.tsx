import { CgSpinner } from "react-icons/cg"

export default function Loading() {
  return (
    <div className="my-auto animate-spin opacity-50">
      <CgSpinner size={64} />
    </div>
  )
}
