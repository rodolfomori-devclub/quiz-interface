/** @type {import('tailwindcss').Config} */

export default {
  content: ['./src/pages/**/*.{js,ts,jsx,tsx,mdx}', './src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/**/*.{js,ts,jsx,tsx,mdx}', './index.html'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#37E359', // Verde DevClub
          dark: '#2BC348',    // Verde mais escuro
          light: '#52FF74',   // Verde mais claro
          // Escala numérica para compatibilidade com utilities padrão do Tailwind
          50: '#EEFFF0',
          100: '#D8FFE0',
          200: '#B1FFC1',
          300: '#8AFFA3',
          400: '#63F984',
          500: '#37E359', // Igual ao DEFAULT
          600: '#2BC348', // Igual ao dark
          700: '#20A33A',
          800: '#17832E',
          900: '#0E6322'
        },
        secondary: {
          DEFAULT: '#051626', // Azul escuro DevClub
          light: '#0A2E4D',   // Azul escuro mais claro
          dark: '#020A13',    // Azul escuro mais escuro
          // Escala numérica para compatibilidade
          50: '#E6EEF5',
          100: '#CCDCE8',
          200: '#99B8D1',
          300: '#6695BA',
          400: '#3371A3',
          500: '#0A2E4D', // Secondary light
          600: '#051626', // Secondary DEFAULT
          700: '#041220',
          800: '#030D16',
          900: '#020A13'  // Secondary dark
        },
        // Cores de fundo
        background: {
          light: '#F8F9FA',
          dark: '#051626',
        },
        // Cores de texto
        text: {
          light: '#051626',
          dark: '#F8F9FA',
          muted: {
            light: '#64748B',
            dark: '#94A3B8',
          },
        },
        // Cores neutras para compatibilidade
        neutral: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
          950: '#020617',
        },
        // Outras cores para mensagens de erro, avisos, etc.
        success: {
          50: '#ECFDF5',
          500: '#10B981',
          700: '#047857',
        },
        error: {
          50: '#FEF2F2',
          500: '#EF4444',
          700: '#B91C1C',
        },
        warning: {
          50: '#FFFBEB',
          500: '#F59E0B',
          700: '#B45309',
        },
        info: {
          50: '#EFF6FF',
          500: '#3B82F6',
          700: '#1D4ED8',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      boxShadow: {
        'neon': '0 0 5px theme(colors.primary.DEFAULT), 0 0 20px theme(colors.primary.DEFAULT)',
        'neon-lg': '0 0 10px theme(colors.primary.DEFAULT), 0 0 30px theme(colors.primary.DEFAULT)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'typing': 'typing 1.5s steps(40, end) infinite alternate',
        'blink-caret': 'blink-caret .75s step-end infinite',
        'bounce-subtle': 'bounce-subtle 2s infinite',
        'loading-dots': 'loadingDots 1.4s infinite both',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(55, 227, 89, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(55, 227, 89, 0.9), 0 0 30px rgba(55, 227, 89, 0.3)' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: 0 },
          '100%': { transform: 'translateY(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        typing: {
          'from': { width: '0' },
          'to': { width: '100%' }
        },
        'blink-caret': {
          'from, to': { borderColor: 'transparent' },
          '50%': { borderColor: 'currentColor' }
        },
        'bounce-subtle': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        loadingDots: {
          '0%, 100%': { opacity: 0.2 },
          '20%': { opacity: 1 }
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      minHeight: {
        '14': '3.5rem',
        '64': '16rem',
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
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionDuration: {
        '2000': '2000ms',
        '3000': '3000ms',
      },
      scale: {
        '102': '1.02',
        '103': '1.03',
      },
    },
  },
  plugins: [],
}
