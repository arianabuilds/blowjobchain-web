import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlowjobChain",
    short_name: "BjChain",
    start_url: "/",
    display: "standalone",
    background_color: "#42002E",
    theme_color: "#42002E",
    // icons: [
    //   {
    //     src: "/favicon.ico",
    //     sizes: "any",
    //     type: "image/x-icon",
    //   },
    // ],
  }
}
