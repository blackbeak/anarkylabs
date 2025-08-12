module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Make sure to include all relevant files here
    './public/index.html'
  ],
  theme: {
    extend: {
      fontFamily: {
        manrope: ['Manrope', 'sans-serif'],
      },
      colors: {
        'brandblue': '#383c5c',
        'brandred': '#c1535a',
        //'brandorange': '#f29278',
        'brandorange': '#FF765F',
        'brandgold':'#fbc78c',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  safelist: [
    'top-1/2',
    'left-20',
    'transform',
    '-translate-y-1/2',
    'z-20',
  ],
};