import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        black: '#1E1F1F',
        gray: {
          900: '#1B1D1F',
          800: '#26282B',
          600: '#464C52',
          500: '#73787E',
          400: '#9FA4A8',
          200: '#CBCDD3',
          100: '#E9EBED',
          50: '#F7F8F9'
        },
        main: '#F52E46',
        warning: '#FF9500'
      }
    }
  },
  plugins: [
    require('tailwind-scrollbar-hide')
  ],
};

export default config;
