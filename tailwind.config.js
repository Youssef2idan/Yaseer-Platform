/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./pages/**/*.html",
    "./js/**/*.js",
    "./src/**/*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Cairo", "ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

