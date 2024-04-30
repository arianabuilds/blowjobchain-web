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

export const RotatingTagline = () => {
  const [tagline, setTagline] = useState("")

  // Pick random tagline
  useEffect(() => {
    const choice = Math.floor(Math.random() * taglines.length)
    const result = taglines[choice]

    // If a plain string, set it
    if (typeof result === "string") return setTagline(result)

    // Otherwise, pick randomly from subarray
    const subChoice = Math.floor(Math.random() * result.length)
    return setTagline(result[subChoice])
  }, [])

  return <p className="italic mt-5 font-medium opacity-70 h-9">{tagline}</p>
}
