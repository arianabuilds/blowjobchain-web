import { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BlowjobChain",
    short_name: "BjChain",
    start_url: "/",
    display: "standalone",
    background_color: "#fca5a5",
    theme_color: "#fca5a5",
    // icons: [
    //   {
    //     src: "/favicon.ico",
    //     sizes: "any",
    //     type: "image/x-icon",
    //   },
    // ],
  }
}
