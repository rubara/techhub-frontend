import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // TechHub Brand Colors
        'th-green': '#00B553',
        'th-green-dark': '#00a04a',
        'th-midnight': '#101720',
        'th-purple': '#5940D3',
        'th-yellow': '#FFB40E',
        'th-blue': '#00ABFF',
        'th-pink': '#E9418B',
        'th-teal': '#008761',
        'th-dark-green': '#1B3627',
      },
      fontFamily: {
        russo: ['Russo One', 'sans-serif'],
        raleway: ['Raleway', 'sans-serif'],
      },
    },
  },
  plugins: [],
};

export default config;
