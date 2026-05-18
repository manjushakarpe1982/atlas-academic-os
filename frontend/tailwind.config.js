/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Lexend Deca'", "system-ui", "sans-serif"],
      },
      colors: {
        brand: {
          50:  "#EEEDFE",
          100: "#D5D3FD",
          200: "#ABA9FA",
          300: "#8180F7",
          400: "#6B68F4",
          500: "#534AB7",
          600: "#3C3489",
          700: "#2A245E",
        },
      },
      animation: {
        "fade-up":  "fadeUp 0.7s ease both",
        "fade-in":  "fadeIn 0.5s ease both",
        "float":    "float 6s ease-in-out infinite",
      },
      keyframes: {
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%":     { transform: "translateY(-12px)" },
        },
      },
    },
  },
  plugins: [],
};
