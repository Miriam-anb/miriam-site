/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 950: '#050C1A', 900: '#0A1730', 800: '#0F2140', 700: '#18305A', 600: '#244374' },
        ink: '#15171C',
        mist: '#F4F6F9',
        line: '#E2E7EF',
        accent: { DEFAULT: '#C8F04B', soft: '#EEFBCF', deep: '#7FA51C' },
      },
      fontFamily: {
        sans: ['Manrope', 'system-ui', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'serif'],
      },
      maxWidth: { site: '1180px' },
      keyframes: {
        rise: { '0%': { opacity: 0, transform: 'translateY(14px)' }, '100%': { opacity: 1, transform: 'none' } },
        dash: { to: { strokeDashoffset: '-40' } },
        pulse2: { '0%,100%': { opacity: 0.35 }, '50%': { opacity: 1 } },
      },
      animation: {
        rise: 'rise .7s cubic-bezier(.2,.7,.2,1) both',
        dash: 'dash 2.4s linear infinite',
        pulse2: 'pulse2 2.8s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
