import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-source-sans)", "system-ui", "sans-serif"],
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
      },
      colors: {
        primary: {
          50: "#f5eef3",
          100: "#eadce7",
          200: "#d5b9cf",
          300: "#c096b7",
          400: "#ab739f",
          500: "#965087", // Base color (lighter shade of Pantone 7652 C)
          600: "#5e2751", // Pantone 7652 C - Main primary color
          700: "#4a1f40",
          800: "#36172f",
          900: "#230f1e",
        },
        footer: {
          DEFAULT: "#1a1a2e",
          bg: "#1a1a2e",
          input: "#2d2d44",
          border: "#2d2d44",
        },
        // Aesop-style neutrals
        aesop: {
          cream: "#f7f5f3",
          stone: "#e8e6e3",
          ink: "#1a1a1a",
          graphite: "#4a4a4a",
        },
      },
      letterSpacing: {
        "aesop-tight": "-0.02em",
        "aesop-wide": "0.08em",
        "diptyque": "0.12em",
      },
      borderRadius: {
        "diptyque": "0",
      },
    },
  },
  plugins: [],
};
export default config;

