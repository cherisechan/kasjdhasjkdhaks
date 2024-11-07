/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        "warps": '953px',
      }
    },
  },
  plugins: [require('@tailwindcss/line-clamp'),],
}

