/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/pages/**/*.{html,js}", "./dist/pages/*.{html,js}"],
  theme: {
    extend: {
      screens: {
        nav: "978px",
      },
    },
  },
  plugins: [],
};
