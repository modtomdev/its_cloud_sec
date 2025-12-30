export default {
  content: [
    "./index.html",
    "./App.jsx",
    "./main.jsx",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#0ea5a4', // teal
          light: '#8ee0dc',
          dark: '#057a74'
        },
        accent: {
          DEFAULT: '#ff7a00', // orange
          light: '#ff9b4a',
          dark: '#c05400'
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui'],
      }
    },
  },
  plugins: [require("daisyui")],
}
