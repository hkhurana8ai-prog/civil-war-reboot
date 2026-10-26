/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        arcade: {
          bg: '#0f172a',
          panel: '#1e293b',
          border: '#334155',
          cyan: '#06b6d4',
          gold: '#f59e0b',
          green: '#22c55e',
          red: '#ef4444',
        }
      },
      fontFamily: {
        mono: ['Courier New', 'Courier', 'monospace'],
      },
      keyframes: {
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(2px, -2px)' },
          '60%': { transform: 'translate(-1px, 1px)' },
          '80%': { transform: 'translate(1px, -1px)' },
        },
        flicker: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
        pulse_gold: {
          '0%, 100%': { boxShadow: '0 0 6px #f59e0b' },
          '50%': { boxShadow: '0 0 20px #f59e0b' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':       { transform: 'translateX(-6px)' },
          '40%':       { transform: 'translateX(6px)' },
          '60%':       { transform: 'translateX(-6px)' },
          '80%':       { transform: 'translateX(6px)' },
        },
        pop: {
          '0%':   { transform: 'scale(1)' },
          '50%':  { transform: 'scale(1.15)' },
          '100%': { transform: 'scale(1)' },
        }
      },
      animation: {
        glitch:     'glitch 0.4s infinite',
        flicker:    'flicker 1.2s ease-in-out infinite',
        pulse_gold: 'pulse_gold 1.5s ease-in-out infinite',
        shake:      'shake 0.4s ease',
        pop:        'pop 0.2s ease',
      }
    },
  },
  plugins: [],
}
