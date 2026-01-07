import type { Metadata, Viewport } from "next"
import "./globals.css"
import { Suspense } from "react"

export const viewport: Viewport = {
  maximumScale: 1,
  userScalable: false,
  themeColor: "#42002E",
}

export const metadata: Metadata = {
  title: "BlowjobChain",
  description: "Orgasms for world peace",
  icons: { apple: "/icons/icon-612x612.png", shortcut: "/icons/icon-612x612.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BlowjobChain" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-[#42002E]">
      <body
        style={{ WebkitUserSelect: "none", backgroundColor: "#42002E" }}
        className="from-[#42002E] to-[#4e031f] bg-gradient-to-b h-[100cqh] flex flex-col items-center overflow-hidden text-white/70 select-none cursor-default"
      >
        <Suspense fallback={<div className="mt-20 mb-20 italic animate-pulse">Loading...</div>}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
