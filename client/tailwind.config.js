/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        crick: {
          dark: '#080C15',
          navy: '#0C1322',
          surface: '#11192C',
          card: '#162138',
          cardHover: '#1B2945',
          border: '#1F2E4C',
          borderLight: '#283B60',
          textMuted: '#94A3B8',
          textLight: '#F1F5F9',
          emerald: '#10B981',
          emeraldHover: '#059669',
          emeraldGlow: 'rgba(16, 185, 129, 0.25)',
          lime: '#10B981', // Emerald green as primary accent
          limeHover: '#059669',
          amber: '#F59E0B',
          red: '#EF4444',
          blue: '#3B82F6',
          purple: '#8B5CF6'
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      boxShadow: {
        'glow-emerald': '0 0 25px -4px rgba(16, 185, 129, 0.4)',
        'glow-sm': '0 0 12px -2px rgba(16, 185, 129, 0.3)',
        'card-dark': '0 4px 24px -2px rgba(0, 0, 0, 0.5)',
        'hero-auction': '0 20px 50px -10px rgba(0, 0, 0, 0.7), 0 0 30px -5px rgba(16, 185, 129, 0.15)'
      },
      animation: {
        'pulse-fast': 'pulse 1.2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    },
  },
  plugins: [],
}
