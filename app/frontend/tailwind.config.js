/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // We can add custom specific colors here if needed outside the Daisy theme
      colors: {
        'tile-500': '#14b8a6', // Teal/Cyan shade
        'orange-500': '#f97316', // Orange shade
      }
    },
  },
  // DaisyUI configuration
  daisyui: {
    themes: [
      {
        tealOrangeTheme: {
          "primary": "#14b8a6",   // Teal - used for main buttons/inputs
          "secondary": "#f97316", // Orange - used for accents
          "accent": "#37cdbe",
          "neutral": "#3d4451",
          "base-100": "#ffffff",  // Clean white card backgrounds
          "base-200": "#f0fdfa",  // Very light teal tint for app background
          "info": "#3abff8",
          "success": "#14b8a6",   // Use teal for success too
          "warning": "#fbbd23",
          "error": "#f87272",
        },
      },
      "light", # Fallback
    ],
  },
  plugins: [require("daisyui")],
}