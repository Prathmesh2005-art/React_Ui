export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./.storybook/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ['hover', 'focus'],
      borderColor: ['hover', 'focus'],
      ringColor: ['hover', 'focus'],
      scale: ['hover', 'focus'],
      rotate: ['hover', 'focus'],
      boxShadow: ['hover', 'focus'],
    },
  },
  plugins: [],
}