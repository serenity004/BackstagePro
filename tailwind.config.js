/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enables dark mode with 'dark' class
  theme: {
    extend: {
      fontFamily: {
        'digital-7': ['Digital-7', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'grow': 'grow 1s ease-in-out infinite',
      },
      keyframes: {
        grow: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        }
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6', // blue-500
          dark: '#2563EB',    // blue-600
        },
        secondary: {
          DEFAULT: '#6B7280', // gray-500
          dark: '#4B5563',    // gray-600
        },
        background: {
          light: '#FFFFFF',
          dark: '#111827',    // gray-900
        },
      }
    },
  },
  plugins: [],
}