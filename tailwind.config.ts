import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      screens: {
        p: "240px",
        d: "1024px",
        lg: "1650px",
      },
      fontFamily: {
        LexendDeca: ["Lexend Deca", "sans-serif"],
        Raleway: ["Raleway", "sans-serif"],
        Oswald: ["Oswald", "sans-serif"],
      },

      colors: {
        primary: "#F5B800",
        main: "#F5B800",
        mainBold: "#1F2937",
        bgcontent: "#FFFDF5",
        brand: {
          50: "#FFFBEA",
          100: "#FFF3BF",
          200: "#FFE680",
          300: "#FFD43B",
          400: "#F5B800",
          500: "#E9A400",
          600: "#C98200",
          700: "#945E00",
          800: "#633F00",
          900: "#362200",
        },
      },
      width: {
        default: "1200px",
      },
    },
  },
  plugins: [require("tailwind-scrollbar")],
};
export default config;
