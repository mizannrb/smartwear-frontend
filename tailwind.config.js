/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Playfair Display', 'Georgia', 'serif'],
        body: ['DM Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50:  '#f0f4ff',
          100: '#e0e9ff',
          200: '#c7d6fe',
          300: '#a5b8fc',
          400: '#8093f9',
          500: '#6366f1',
          600: '#1a1f3a',
          700: '#141830',
          800: '#0e1126',
          900: '#08091a',
        },
        gold: {
          400: '#f0c040',
          500: '#e6a817',
          600: '#c48a0f',
        }
      },
      boxShadow: {
        'card': '0 4px 24px rgba(26,31,58,0.10)',
        'card-hover': '0 8px 40px rgba(26,31,58,0.18)',
      }
    },
  },
  plugins: [],
}
