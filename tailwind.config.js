/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Copilot Money dark theme colors
        dark: {
          bg: '#0a0e1a',
          surface: '#141824',
          border: '#1f2937',
          hover: '#1e293b',
        }
      }
    },
  },
  plugins: [],
}
