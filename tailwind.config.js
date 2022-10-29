/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "eerie-black": "#1b1b1b",
        filter:{
          primary: "",
          accent: "rgb(255, 255, 255)",
        },
        white: {
          20: "rgba(255, 255, 255, 0.20)",
          25: "rgba(255, 255, 255, 0.25)",
          30: "rgba(255, 255, 255, 0.30)",
          50: "rgba(255, 255, 255, 0.5)",
          90:  "rgba(255, 255, 255, .9)"
        },
        "chinese-black": {
          25: "rgba(13, 13, 13, 0.25)",
          50: "rgba(13, 13, 13, 0.50)"
        }
      },
      fontFamily: {
        // "roboto": ['Roboto', 'sans-serif'],
        // "roboto-condensed": ['Roboto Condensed', 'sans-serif']
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar')
  ],
  variants: {
    scrollbar: ['rounded'],
  },
}