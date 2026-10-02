/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './app.js',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      colors: {
        kab: {
          50:  '#fff5f1',
          100: '#ffe6dc',
          200: '#ffc9b6',
          300: '#ffa285',
          400: '#ff6f47',
          500: '#f04e23',
          600: '#d93a10',
          700: '#b52c0c',
          800: '#8f230b',
          900: '#731f0d',
        },
      },
      animation: {
        'fade-up':     'fadeUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) both',
        'fade-in':     'fadeIn 0.6s ease-out both',
        'float':       'float 6s ease-in-out infinite',
        'shimmer':     'shimmer 2.5s linear infinite',
        'pulse-ring':  'pulseRing 2.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'gradient':    'gradientShift 8s ease infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseRing: {
          '0%':   { transform: 'scale(0.95)', opacity: '0.7' },
          '70%':  { transform: 'scale(1.3)',  opacity: '0' },
          '100%': { transform: 'scale(1.3)',  opacity: '0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};