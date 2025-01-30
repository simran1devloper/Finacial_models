/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Exo 2', 'sans-serif'],
      },
      colors: {
        primary: '#1a365d',
        secondary: '#2a4365',
        accent: '#edf2f7',
      },
    },
  },
  plugins: [],
}


