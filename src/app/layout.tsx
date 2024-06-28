import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const viewport: Viewport = { maximumScale: 1, userScalable: false }
export const metadata: Metadata = { title: "BlowjobChain", description: "" }

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{ WebkitUserSelect: "none" }}
        className={`from-[#42002E] to-[#4e031f] bg-gradient-to-b h-[100cqh] flex flex-col items-center overflow-hidden text-white/70 select-none cursor-default ${inter.className}`}
      >
        {children}
      </body>
    </html>
  )
}
