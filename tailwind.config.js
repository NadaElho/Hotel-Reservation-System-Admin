/** @type {import('tailwindcss').Config} */
export default {
  darkMode:"selector",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/flowbite/**/*.js",
  ],
  theme: {
    extend: {
      colors: {
        main:{
          100: '#AA9383',
          200: '#997c6a',
          300: '#997c6a',
          400: '#81664b',
          800: '#52381D'
        },
        grey:{
          100: '#fff7f2',
          500: '#C5BDBA',
        }
      },
    },
  },

  plugins: [require('flowbite/plugin')],
}