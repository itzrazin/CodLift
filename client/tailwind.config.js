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
        // Cyber-Neon Palette
        cyber: {
          pink: "#FF00FF",   // Electric Purple/Pink
          cyan: "#00FFFF",   // Bright Cyan
          green: "#ADFF2F",  // Neon Green / GreenYellow
          dark: "#0a0a0a"
        },
        purple: {
          DEFAULT: "#FF00FF", // Redirect default purple to cyber pink
          light: "#ff66ff",
          dark: "#b300b3",
        },
        yellow: {
          DEFAULT: "#ADFF2F", // Redirect default yellow to cyber green
          light: "#c4ff66",
          dark: "#7ab300",
        },
        navy: {
          DEFAULT: "#050505",
          light: "#0a0a0a",
          lighter: "#111",
        },
      },
      boxShadow: {
        'neo': '4px 4px 0px 0px rgba(255,0,255,1)',
        'neo-cyan': '4px 4px 0px 0px rgba(0,255,255,1)',
        'neo-green': '4px 4px 0px 0px rgba(173,255,47,1)',
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
