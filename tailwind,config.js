// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 👈 covers your components
  ],
  theme: {
    extend: {},
    screens: {
      mobileS: '320px',
      mobileM: '375px',
      mobileL: '425px',
      xs: '480px', // custom
      sm: '640px', // default
      md: '768px', // default
      lg: '1024px', // default
      xl: '1280px', // default
      '2xl': '1536px', // default
    },
  },
  plugins: [],
};
