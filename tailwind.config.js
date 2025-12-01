/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#6366f1',
        secondary: '#ec4899',
        accent: '#10b981',
        surface: '#1e293b',
        background: '#0f172a',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6'
      },
      fontFamily: {
        'display': ['Bebas Neue', 'cursive'],
        'sans': ['Inter', 'sans-serif']
      },
      boxShadow: {
        'neon': '0 0 20px currentColor',
        'neon-lg': '0 0 30px currentColor',
        'card': '0 4px 12px rgba(0,0,0,0.5)'
      },
      animation: {
        'pop-in': 'popIn 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'shake': 'shake 0.2s ease-in-out',
        'pulse-glow': 'pulseGlow 0.6s ease-in-out',
        'draw-line': 'drawLine 0.6s ease-out',
        'scale-pulse': 'scalePulse 0.6s ease-in-out'
      },
      keyframes: {
        popIn: {
          '0%': { transform: 'scale(0) rotate(0deg)', opacity: '0' },
          '50%': { transform: 'scale(1.1) rotate(5deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-4px)' },
          '75%': { transform: 'translateX(4px)' }
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 20px currentColor' },
          '50%': { boxShadow: '0 0 40px currentColor, 0 0 60px currentColor' }
        },
        drawLine: {
          '0%': { transform: 'scaleX(0)', opacity: '0' },
          '100%': { transform: 'scaleX(1)', opacity: '1' }
        },
        scalePulse: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' }
        }
      }
    },
  },
  plugins: [],
}