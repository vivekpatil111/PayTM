/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        paytm: {
          navy: '#002970',
          dark: '#001944',
          cyan: '#00baf2',
          lightCyan: '#e5f8ff',
          green: '#00b259',
          gold: '#f5a623',
          red: '#ff3b30',
          bg: '#f5f7fc',
          card: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'sound-wave': 'soundWave 1.2s ease-in-out infinite alternate',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        soundWave: {
          '0%': { height: '8px' },
          '100%': { height: '32px' },
        }
      }
    },
  },
  plugins: [],
}
