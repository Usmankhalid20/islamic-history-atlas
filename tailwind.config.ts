import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        archival: {
          bg: "#FAF8F5",
          surface: "#F4EFEB",
          border: "#E7DFD5",
          ink: "#1C1917",
          muted: "#57534E",
          gold: "#B45309",
          lapis: "#1E3A8A",
          terracotta: "#9A3412",
          emerald: "#065F46",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Georgia", "serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;

