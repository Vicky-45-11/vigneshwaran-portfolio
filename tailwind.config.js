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
          DEFAULT: '#4CAF35',
          light: '#7DDC5B',
          cyan: '#4AEDD9',
          deep: '#14320C',
        },
        line: {
          DEFAULT: 'rgba(215, 226, 234, 0.1)',
          strong: 'rgba(215, 226, 234, 0.2)',
        },
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['VT323', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        pixel: ['"Pixelify Sans"', 'VT323', 'ui-monospace', 'monospace'],
      },
      // Block games have no rounded corners. Circles (rounded-full) are kept.
      borderRadius: {
        none: '0',
        sm: '0',
        DEFAULT: '0',
        md: '0',
        lg: '0',
        xl: '0',
        '2xl': '0',
        '3xl': '0',
      },
      transitionTimingFunction: {
        editorial: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      },
    },
  },
  plugins: [],
}
