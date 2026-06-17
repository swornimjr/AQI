/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        tank: {
          darkest: '#0D1F1A',
          dark: '#132820',
          mid: '#1E3D33',
          accent: '#4ECAA0',
          accentLight: '#A8E6CF',
          text: '#E8F5F0',
          muted: '#6BA898',
          amber: '#E8A954',
        },
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
