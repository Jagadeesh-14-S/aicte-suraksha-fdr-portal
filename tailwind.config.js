/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        aicte: {
          primary: '#1E3A8A',    // Deep Sovereign AICTE Blue
          secondary: '#D97706',  // Saffron / Gold highlight
          dark: '#0F172A',       // Slate 900
          light: '#F8FAFC',
          accent: '#059669',     // Emerald compliant green
          warning: '#DC2626',    // Crimson Alert
        }
      }
    },
  },
  plugins: [],
}
