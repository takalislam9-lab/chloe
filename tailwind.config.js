/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./gracias.html",
    "./assets/js/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FBF8F3",
        sand: "#F3ECE1",
        ink: "#26221E",
        mocha: "#6B5B4C",
        gold: "#B08D57",
        nude: "#D8B4A6",
      },
      fontFamily: {
        display: ['"Playfair Display"', "serif"],
        serif: ['"Cormorant Garamond"', "serif"],
        sans: ["Jost", "ui-sans-serif", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
