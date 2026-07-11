// tailwind.config.js
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}', // 👈 covers your components
  ],
  theme: {
    extend: {
      keyframes: {
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'collapsible-down': 'collapsible-down 1.2s ease-out',
        'collapsible-up': 'collapsible-up 1.7s ease-in-out', // Modified to match your 700ms request
      },
    },
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
