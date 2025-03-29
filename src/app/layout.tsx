import type { Metadata, Viewport } from "next"
import "./globals.css"

export const viewport: Viewport = { maximumScale: 1, userScalable: false }

export const metadata: Metadata = {
  title: "BlowjobChain",
  description: "Orgasms for world peace",
  manifest: "/manifest.json",
  icons: { apple: "/icons/icon-612x612.png", shortcut: "/icons/icon-612x612.png" },
  appleWebApp: { capable: true, statusBarStyle: "default", title: "BlowjobChain" },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        style={{ WebkitUserSelect: "none" }}
        className="from-[#42002E] to-[#4e031f] bg-gradient-to-b h-[100cqh] flex flex-col items-center overflow-hidden text-white/70 select-none cursor-default"
      >
        {children}
      </body>
    </html>
  )
}
