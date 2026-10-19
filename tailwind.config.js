/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0C0C0C',
          900: '#0C0C0C',
          800: '#111111',
          700: '#171717',
          600: '#1F1F1F',
        },
        mist: {
          DEFAULT: '#D7E2EA',
          muted: '#9CA3AF',
          dim: '#646973',
        },
        accent: {
          DEFAULT: '#3B82F6',
          light: '#60A5FA',
          cyan: '#22D3EE',
          deep: '#0B1F3A',
        },
        line: {
          DEFAULT: 'rgba(215, 226, 234, 0.1)',
          strong: 'rgba(215, 226, 234, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
