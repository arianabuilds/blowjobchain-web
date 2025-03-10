import { Suspense, type ReactNode } from "react"

export const SuspenseHelper = ({ name, children }: { name: string; children: ReactNode }) => (
  <Suspense
    fallback={
      <p className="animate-pulse">
        Loading <i>{name}</i>...
      </p>
    }
  >
    {children}
  </Suspense>
)
