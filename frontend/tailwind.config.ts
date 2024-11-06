import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'main-gradient': 'linear-gradient(180deg, #A5DEF5 40%, #DCF3B4 100%)',
        wood: "url('/images/texture/wooden.jpg')",
        'ranking-gradient': 'linear-gradient(180deg, #FFE097 0%, #FFEBBC 100%)',
      },
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          50: '#F6FCEC',
          100: '#EDF9D9',
          200: '#E4F6C6',
          300: '#DCF3B4',
          400: '#D3F0A1',
          500: '#C2EA7C',
          600: '#A6C86A',
          700: '#8AA758',
          800: '#6E8546',
          900: '#536435',
          950: '#374223',
        },
        secondary: {
          50: '#F2FAFD',
          100: '#E5F5FC',
          200: '#D8F0FA',
          300: '#CBECF9',
          400: '#BEE7F7',
          500: '#A5DEF5',
          600: '#8DBED2',
          700: '#759EAF',
          800: '#5E7E8C',
          900: '#465F69',
          950: '#2F3F46',
        },
        text: '#240F0F',
        'gray-dark': '#A9A9A9',
        'gray-medium': '#ECECEE',
        'gray-light': '#F6F6F9',
      },
      textStroke: {
        '1': '1px',
      },
      textStrokeColor: {
        primary: '#240F0F',
      },
      boxShadow: {
        'button-inactive': `
          0px 4px 4px 0px rgba(0, 0, 0, 0.15), 
          0px -10px 20px 10px rgba(0, 0, 0, 0.1) inset, 
          0px 10px 20px 3px rgba(0, 0, 0, 0.15) inset
        `,
        'button-active': `
        0px 4px 4px 0px rgba(0, 0, 0, 0.15), 
        0px -10px 20px 10px rgba(256, 256, 256, 0.1) inset, 
        0px 10px 20px 3px rgba(256, 256, 256, 0.25) inset
      `,
      },
      keyframes: {
        smallPing: {
          '75%, 100%': { transform: 'scale(1.2)', opacity: '0' },
        },
      },
      animation: {
        'small-ping': 'smallPing 1s cubic-bezier(0, 0, 0.2, 1) infinite',
      },
    },
  },
  plugins: [
    require('tailwind-scrollbar-hide'),
    function ({ addUtilities, theme }: any) {
      const newUtilities = {
        '.text-stroke': {
          '-webkit-text-stroke-width': theme('textStroke.1'),
          '-webkit-text-stroke-color': theme('textStrokeColor.primary'),
        },
      }
      addUtilities(newUtilities, ['responsive'])
    },
  ],
}
export default config
