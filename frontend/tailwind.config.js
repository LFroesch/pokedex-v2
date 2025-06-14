/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pokemon: {
          red: '#DC2626',
          blue: '#2563EB', 
          yellow: '#EAB308',
          green: '#16A34A',
        }
      },
      fontFamily: {
        'pokemon': ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}