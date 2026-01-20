import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
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
      },
    },
  },
  plugins: [],
};
export default config;

