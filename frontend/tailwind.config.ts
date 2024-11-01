import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
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
      backgroundImage: {
        wood: "url('/images/texture/wooden.jpg')",
      },
    },
  },
  plugins: [],
}
export default config
