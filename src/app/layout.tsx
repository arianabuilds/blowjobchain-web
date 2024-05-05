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
    <html lang="en" className="bg-red-300">
      <body
        className={`from-red-300 to-blue-200 bg-gradient-to-b  min-h-[100cqh] flex flex-col items-center justify-between px-4 overflow-hidden ${inter.className}`}
      >
        {children}
      </body>
    </html>
  )
}