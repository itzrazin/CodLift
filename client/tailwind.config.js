/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#080b10",
        cyan: {
          DEFAULT: "#00f5d4",
          light: "#33f7dd",
          dark: "#00c4aa",
        },
        yellow: {
          DEFAULT: "#ffd60a",
          light: "#ffde40",
          dark: "#ccab00",
        },
        navy: {
          DEFAULT: "#080b10",
          light: "#0d131a",
          lighter: "#141d26",
        },
      },
      fontFamily: {
        syne: ["Syne", "sans-serif"],
        sans: ["DM Sans", "sans-serif"],
        mono: ["DM Mono", "monospace"],
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        }
      }
    },
  },
  plugins: [],
}
