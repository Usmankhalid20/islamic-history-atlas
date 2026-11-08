import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Islamic History Atlas (632–1000 CE)",
    short_name: "Islamic Atlas",
    description:
      "Interactive, evidence-based historical atlas exploring Islamic dynasties, territories, intellectual monuments, trade routes, and military campaigns across the 7th–10th centuries CE.",
    start_url: "/",
    display: "standalone",
    background_color: "#FDFBF7",
    theme_color: "#1C1917",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
