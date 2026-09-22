/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: '#050505',
          secondary: '#0B0B0B',
          surface: '#111111',
          elevated: '#171717',
        },
        border: {
          subtle: 'rgba(255, 255, 255, 0.08)',
          glow: 'rgba(59, 130, 246, 0.3)',
        },
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          cyan: '#22D3EE',
        },
        text: {
          primary: '#F5F5F5',
          secondary: '#A1A1AA',
          muted: '#71717A',
        }
      },
      fontFamily: {
        sans: ['Geist', 'Plus Jakarta Sans', 'Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      boxShadow: {
        'glow-sm': '0 0 15px rgba(59, 130, 246, 0.2)',
        'glow-md': '0 0 30px rgba(59, 130, 246, 0.3)',
        'glow-lg': '0 0 50px rgba(59, 130, 246, 0.4)',
      }
    },
  },
  plugins: [],
}
