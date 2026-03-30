/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Playfair Display', 'serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        ink: '#4f392b',
        accent: '#cba72f',
        muted: '#755843',
        'outline-variant': '#e0e0e0',
      },
    },
  },
  plugins: [],
}