import { CgSpinner } from "react-icons/cg"

export default function Loading() {
  return (
    <div className="mt-20 mb-20 animate-spin opacity-50">
      <CgSpinner size={64} />
    </div>
  )
}
