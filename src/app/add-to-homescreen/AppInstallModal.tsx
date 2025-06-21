import Image from "next/image"
import React from "react"

interface AppInstallModalProps {
  onClose: () => void
  open: boolean
}

export function AppInstallModal({ onClose, open }: AppInstallModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Dark background overlay */}
      <div className="fixed inset-0 z-10 bg-black/60" onClick={onClose} />

      {/* Modal */}
      <div className="bg-gray-950 z-20 border border-gray-800 rounded-xl shadow-xl w-full max-w-md p-6 relative animate-fade-in">
        {/* Close button */}
        <button
          aria-label="Close"
          className="absolute top-4 right-4 text-gray-300 hover:text-gray-700 text-2xl font-bold active:opacity-50 cursor-pointer"
          onClick={onClose}
        >
          ×
        </button>

        {/* Title: Install the app */}
        <h2 className="text-xl font-semibold mb-8">Install the app</h2>

        {/* Icon, Title, URL  */}
        <div className="flex items-center gap-3 bg-gray-900 rounded-lg p-3 mb-11">
          {/*<Image
            alt="App Icon"
            className="rounded-md border"
            height={40}
            onError={(e) => (e.currentTarget.style.display = "none")}
            src={appIcon}
            width={40}
          />*/}
          <div>
            <div className="font-medium">BlowjobChain</div>
            <div className="text-xs text-gray-500">https://blowjobchain.com</div>
          </div>
        </div>

        {/* Instructions */}
        <ol className="list-decimal list-inside space-y-8 text-sm text-gray-400 mb-5">
          <li>
            Tap the
            {/* Share icon */}
            <span className="inline-block align-middle mx-1">
              <ShareIcon />
            </span>
            Share button in the browser toolbar.
          </li>
          <li>
            Scroll down and select{" "}
            <span className="font-semibold bg-gray-700 px-1.5 py-0.5 rounded text-gray-200">
              Add to Home Screen
            </span>
          </li>

          {/* Then */}
          <li className="list-none text-center mt-18">
            Look for the{" "}
            <span className="inline-block align-middle mx-1">
              {/*<Image
                alt="App Icon"
                className="rounded border inline"
                height={20}
                onError={(e) => (e.currentTarget.style.display = "none")}
                width={20}
              />*/}
            </span>{" "}
            icon on your home screen 🎉
          </li>
        </ol>
      </div>
    </div>
  )
}

function ShareIcon() {
  return (
    <svg
      className="inline"
      fill="none"
      height="18"
      viewBox="0 0 24 24"
      width="18"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12 16V4M12 4L8 8M12 4L16 8"
        stroke="#ddd"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <rect fill="#ddd" height="4" rx="2" width="16" x="4" y="16" />
    </svg>
  )
}
