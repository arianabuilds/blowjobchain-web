"use client"

import { useState } from "react"

import { AppInstallModal } from "./AppInstallModal"

export function AddToHomeScreen() {
  const [showModal, setShowModal] = useState(false)

  return (
    <>
      <button
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-950 rounded-lg hover:bg-blue-900/80 active:bg-blue-800 transition duration-75 cursor-pointer border border-blue-900"
        onClick={() => setShowModal(true)}
      >
        <svg
          className="w-5 h-5"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
        Add to Home Screen
      </button>
      <AppInstallModal onClose={() => setShowModal(false)} open={showModal} />
    </>
  )
}
