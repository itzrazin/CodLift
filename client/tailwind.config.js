/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#000000",
        purple: {
          DEFAULT: "#a855f7",
          light: "#c084fc",
          dark: "#9333ea",
        },
        yellow: {
          DEFAULT: "#ffd60a",
          light: "#ffde40",
          dark: "#ccab00",
        },
        navy: {
          DEFAULT: "#000000",
          light: "#080b10",
          lighter: "#101010",
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
        'slide': 'slide 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        slide: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(300%)' },
        }
      }
    },
  },
  plugins: [],
}
