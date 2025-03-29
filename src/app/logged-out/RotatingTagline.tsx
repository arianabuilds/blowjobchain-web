"use client"

import { useEffect, useState } from "react"

const taglines = [
  "finally a useful application for a blockchain",
  "currency for couples",
  "10 points = 1 blowjob card",
  ["orgasms for world peace", "world peace thru orgasm", "orgasms can create world peace"],
  "imagine a world of ten times more blowjobs",
  "discover the magic of blockchains :sparkles:",
  "your own private currency",
  "orgasms when you want it",
]

const getRandomTagline = () => {
  const choice = Math.floor(Math.random() * taglines.length)
  const result = taglines[choice]

  // If a plain string, return it
  if (typeof result === "string") return result

  // Otherwise, pick randomly from subarray
  const subChoice = Math.floor(Math.random() * result.length)
  return result[subChoice]
}

export const RotatingTagline = () => {
  const [tagline, setTagline] = useState("")
  const [isHovered, setIsHovered] = useState(false)

  // Pick initial random tagline
  useEffect(() => {
    setTagline(getRandomTagline())
  }, [])

  const rerollTagline = () => {
    let newTagline
    // Make sure we get a different tagline
    do {
      newTagline = getRandomTagline()
    } while (newTagline === tagline)
    setTagline(newTagline)
  }

  return (
    <div
      onClick={rerollTagline}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative mt-8 cursor-pointer select-none"
    >
      <p className="px-5 text-lg font-light tracking-wide text-white/70 transition-all duration-300 group-hover:text-white/90">
        <span className="animate-fadeIn inline-flex items-center gap-2">
          {tagline}
          <span className="text-sm opacity-60 transition-transform duration-300 group-hover:translate-x-0.5">
            ↻
          </span>
        </span>
      </p>
      <div className="absolute inset-x-0 -bottom-1 mx-auto w-48 h-px bg-gradient-to-r from-transparent via-pink-500/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
    </div>
  )
}
