/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["var(--font-serif)", "serif"],
        sans: ["var(--font-sans)", "sans-serif"]
      },
      colors: {
        peach: {
          50: "#fff7f2",
          100: "#ffefe6",
          200: "#ffd9c6",
          300: "#ffc1a6",
          400: "#ff9c78",
          500: "#ff7d57",
          600: "#f2603f",
          700: "#c9472d",
          800: "#a33a28",
          900: "#7f2f23"
        },
        blush: {
          50: "#fff9f6",
          100: "#fff1ea",
          200: "#ffe2d3",
          300: "#ffd1ba",
          400: "#f7b299",
          500: "#ec8f78"
        }
      },
      borderRadius: {
        xl: "18px",
        '2xl': "22px"
      },
      boxShadow: {
        soft: "0 12px 30px rgba(244, 165, 132, 0.18)",
        card: "0 12px 40px rgba(88, 42, 26, 0.08)"
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #fff1ea 0%, #fff8f4 50%, #ffe6d4 100%)"
      }
    }
  },
  plugins: [require("@tailwindcss/typography")]
};

