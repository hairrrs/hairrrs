module.exports = {
  purge: {
    enabled: true,
    // content: ['./src/**/*.tsx'],
  },
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    typography: (theme) => ({
      dark: {
        css: {
          color: 'white',
        },
      },
    }),
    extend: {
      colors: {
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        main: "var(--main)",
        baseColor: '#EB004E',
        background: "var(--background)",
        header: "var(--header)",
        accent: "var(--accent)",
      },
    },
  },
  variants: {},
  plugins: [require('@tailwindcss/typography')],
}





// module.exports = {
//   darkMode: 'class',
//   purge: ['./src/**/*.js'],
//   content: [
//     './pages/**/*.{js,ts,jsx,tsx}',
//     './components/**/*.{js,ts,jsx,tsx}',
//   ],
//   theme: {
//     typography: (theme) => ({}),
//     extend: {
      // colors: {
      //   primary: "var(--primary)",
      //   secondary: "var(--secondary)",
      //   main: "var(--main)",
      //   background: "var(--background)",
      //   header: "var(--header)",
      //   accent: "var(--accent)",
      // },
//     },
//   },
//   plugins: [require('@tailwindcss/typography')],
// }
