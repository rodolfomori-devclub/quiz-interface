/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}', './index.html'],
  theme: {
    extend: {
      colors: {
        violet: {
          25: '#FCFAFF',
        },

        violet: {
          25: '#FCFAFF',
          50: '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
          950: '#2E1065',
        },

        blue: {
          25: '#F2FAFD',
          50: '#E5F4FB',
          100: '#B8E0F7',
          200: '#8BCEF3',
          300: '#5EBCF0',
          400: '#0179B8',
          600: '#016298',
          700: '#014A77',
          800: '#013256',
          900: '#011A35',
        },

        error: {
          25: '#FFFBFA',
          50: '#FEF3F2',
          100: '#FEE4E2',
          200: '#FECDCA',
          300: '#FDA29B',
          400: '#F97066',
          500: '#F04438',
          600: '#D92D20',
          700: '#B42318',
          800: '#912018',
          900: '#7A271A',
        },
      },
      screens: {
        'max-xs': { max: '560px' },
        'max-md': { max: '767px' },
        'max-lg': { max: '1080px' },
        'max-xl': { max: '1280px' },
        'max-2xl': { max: '1536px' },
        'max-3xl': { max: '1700px' },
        'min-xs': { min: '560px' },
        'min-md': { min: '767px' },
        'min-lg': { min: '1080px' },
        'min-xl': { min: '1280px' },
      },
      fontFamily: {
        sans: ['Montserrat', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'bounce-slow': 'bounce 1s infinite ease-in-out',
      },
    },
  },
  plugins: [],
}
