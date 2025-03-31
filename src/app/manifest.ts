import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlowjobChain",
    short_name: "BlowjobChain",
    description: "Track and settle debts with friends",
    start_url: "/",
    display: "standalone",
    background_color: "#42002E",
    theme_color: "#42002E",
    orientation: "portrait",
    icons: [
      {
        src: "/icons/icon-612x612.png",
        sizes: "612x612",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  }
}
