/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0D1326",
        secondary: "#031473",
        accent: "#0424D9",
      },
    },
  },
  plugins: [],
}
