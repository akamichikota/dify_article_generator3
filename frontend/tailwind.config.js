/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'magic-blue': '#4A90E2',
        'magic-green': '#50E3C2',
        'dark-bg': '#1C1C1E',
        'text-white': '#FFFFFF',
        'text-gray': '#A0A0A0',
      },
      fontFamily: {
        'roboto': ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}